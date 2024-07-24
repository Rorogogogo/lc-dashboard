import s4i_ssh
import sys
pool = s4i_ssh.SSHClientPool()
pool.connect("cloud.s4i.io")
pool.upload("cloud.s4i.io", sys.argv[1], sys.argv[2])
