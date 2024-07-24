# CHANGE LOGS

17/10/2022: v1.01 Added "All On", "All Off" buttons
21/09/2022: v1.0 First release


# INTRODUCTION

S4i provides a software package for demonstrating XAPI usage over TCP client and Websocket client, including:

* XAPI JavaScript library for demo programs
* A CLI client program, use both TCP and Websockets
* A single page HTML5 application, use Websockets,  ParcelJS (https://parceljs.org ) as build tool.

* NOTE
    - The included source code is for demostration only and NOT supposed for production purpose.
    - To run demo Web App, please install ParcelJS first

# FILES

* js: JavaScript library for XAPI demo
    - xapi: xapi JS library for demo programs
      - transports
        - tcpclient.js: TCP Client
        - wsclient.js: Websockets Client
      - codec.js: XAPI ASCII protocol codec
      - client.js: XAPI Client module
      - cli: CLI demo
        - demo-cli.js: CLI demo
        - To start up, run "node cli.js <url>" from command line

* web: Web App demo
    - css
    - js
    - index.html
    - run-parcel.sh: Start up script, it will create a local http server at 1234 serving a single page web app.

        

