import paramiko
import logging
import os
import traceback
import sys
import progressbar

logger = logging.getLogger(__name__)


class SSHConfig:
    def __init__(self) -> None:
        self.load()

    def load(self):
        self.hosts_file_path = os.path.expanduser('~') + "/.ssh/config"
        logger.info("Loading " + self.hosts_file_path)
        self.hosts = {}
        item = None

        with open(self.hosts_file_path, "r") as f:
            for l in f.readlines():
                values = l.strip().split()
                if len(values) < 2:
                    continue
                k, v = values[0].lower(), values[1].lower()
                if values[0] == "Host":
                    if item is not None:
                        self.hosts[item["host"]] = item
                    item = {k: v}
                else:
                    if item is not None:
                        item[k] = v
        logger.info(self.hosts)

    def get_host_config(self, host):
        return self.hosts.get(host)


class SSHClient:
    def __init__(self, host, username, password=None, private_key=None):
        if password is not None:
            self.connect_with_logins(host, username, password)
        else:
            self.connect_with_keyfile(host, username, private_key)

        self.sftp = self.ssh_client.open_sftp()

    def connect_with_keyfile(self, host, username, key_filename):
        self.ssh_client = paramiko.SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh_client.connect(hostname=host,
                                username=username,
                                key_filename=key_filename,
                                look_for_keys=False)

    def connect_with_logins(self, host, username, password):
        self.ssh_client = paramiko.SSHClient()
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh_client.connect(hostname=host,
                                username=username,
                                password=password,
                                look_for_keys=False)

    def close(self):
        self.ssh_client.close()

    def sftp_cd(self, path):
        self.sftp.chdir(path)

    def sftp_getcwd(self):
        self.sftp.getcwd()

    def sftp_stat(self, fn):
        st = self.sftp.stat(fn)
        return st

    def sftp_exists(self, fn):
        try:
            st = self.sftp.stat(fn)
            return True
        except:
            return False

    def sftp_makedirs(self, dirs, mode):
        values = dirs.split("/")
        if not values[0] == "":
            logger.warning("Must use absloute path:", dirs)
            return
        path = ""
        for c in values[1:]:
            path = path + "/" + c
            logger.warning("Path: "+path)
            if self.sftp_exists(path):
                st = self.sftp.stat(path)
                logger.warning("STAT Path: "+path + str(st))
            else:
                self.sftp.mkdir(path, st.st_mode)
                self.sftp.chown(path, st.st_uid, st.st_gid)


class SSHClientPool:
    def __init__(self):
        self.hosts = {}
        self.host_config = SSHConfig()

    def connect(self, host, username=None, password=None):
        conn = self.hosts.get(host)
        if conn is not None:
            logger.info("Use cached connection for " + host)
            return conn

        if username is not None:
            conn = SSHClient(host=host,
                             username=username, password=password)
        else:
            config = self.host_config.get_host_config(host)
            if config is None:
                logger.info("Couldn't find config for " + host)
                return None

            print("Using config: ", config)
            if config.get("identityfile"):
                conn = SSHClient(host=config["host"],
                                 username=config["user"], private_key=config["identityfile"])
            else:
                conn = SSHClient(host=config["host"],
                                 username=config["user"], password="password")

        self.hosts[host] = conn
        return conn

    def clear(self):
        for c in self.connections:
            c.close()

    def upload_folder(self, conn, local, remote):
        if not conn.sftp_exists(remote):
            logger.warning("Creating dir: " + remote)
            conn.sftp_makedirs(remote, mode=777)

        conn.sftp_cd(remote)

        # Find all files, ignore ""."
        files = os.listdir(local)
        for fn in files:
            fp = os.path.join(local, fn)
            if os.path.isfile(fp):
                print("Put file %s/%s" % (fp, os.path.join(remote, fn)))
                print(conn.sftp.put(fp, fn))
                print(conn.sftp_getcwd())

    def exec_command(self, host, cmd):
        try:
            conn = self.connect(host)
            if conn is None:
                return False
            conn.ssh_client.exec_command(cmd)
        except:
            logger.error(traceback.format_exc())

    def makedirs(self, host, dirs, mode):
        try:
            conn = self.connect(host)
            if conn is None:
                return False
            conn.sftp_makedirs(dirs, mode)
        except:
            pass

    def printTotals(self, transferred, toBeTransferred):
        if self.bar is None:
            self.bar = progressbar.ProgressBar(max_value=toBeTransferred)
        self.bar.update(transferred)

    def upload(self, host, local_file, remote_file):
        logger.info("Uploading " + local_file +
                    " -> " + host + " " + remote_file)
        try:
            conn = self.connect(host)
            if conn is None:
                return False

            remote_folder = os.path.dirname(remote_file)
            if not conn.sftp_exists(remote_folder):
                logger.warn("Creating dir: " + remote_folder)
                conn.sftp.makedirs(remote_folder, mode=777)

            conn.sftp_cd(remote_folder)

            logger.warning("upload: "+local_file + " to " + remote_file)

            if os.path.isdir(local_file):
                self.upload_folder(conn, local_file, remote_file)
            else:
                self.bar = None
                conn.sftp.put(localpath=local_file,
                              remotepath=remote_file,
                              callback=self.printTotals)

            return True
        except:
            logger.error(traceback.format_exc())
        return False


if __name__ == "__main__":
    host = sys.argv[1]
    local = sys.argv[2]
    remote = sys.argv[3]
    pool = SSHClientPool()
    pool.connect(host)
    pool.upload(host, local, remote)
