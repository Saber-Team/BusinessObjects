#!/usr/bin/python

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from os import curdir, sep
import os
import cgi
import json

PORT = 8080

class Handler(BaseHTTPRequestHandler):
    def formatPath(self, p):
        if p.startswith('/dist') or p.startswith('/lib'):
            return '../..' + p;
        return '.' + p

    def do_GET(self):
        if self.path == "/":
            self.path = "/imageuploader.html"

        try:
            sendReply = False
            if self.path.endswith('.html'):
                mimetype = 'text/html'
                sendReply = True

            if self.path.endswith('.jpg'):
                mimetype = 'image/jpg'
                sendReply = True

            if self.path.endswith('.png'):
                mimetype = 'image/png'
                sendReply = True

            if self.path.endswith('.gif'):
                mimetype = 'image/gif'
                sendReply = True

            if self.path.endswith(".js"):
                mimetype='application/javascript'
                sendReply = True
            if self.path.endswith(".css"):
                mimetype='text/css'
                sendReply = True

            if sendReply:
                filePath = self.formatPath(self.path)
                if not os.path.exists(filePath):
                    filePath = './images' + sep + self.path
                f = open(filePath)
                self.send_response(200)
                self.send_header('Content-Type', mimetype)
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
            return
        except IOError:
            self.send_error(400, 'File Not Found: %s' % self.path)

    def do_POST(self):
        if self.path == "/upload":
            form = cgi.FieldStorage(
                    fp = self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST', 'CONTENT-TYPE': self.headers['Content-Type']}
                    )

            uploadFile = form['ufile']

            print uploadFile.filename

            if uploadFile.filename and uploadFile.filename != 'error.jpg':
                if not os.path.exists(curdir + sep + 'images'):
                    os.mkdir(curdir + sep + 'images')
                fw = open(curdir + sep + 'images' + sep + uploadFile.filename, 'w')
                fw.write(uploadFile.file.read())
                fw.close()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "data": {
                        "filehash": '/images/' + uploadFile.filename,
                        "filename": uploadFile.filename
                    }
                }))
                return

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error_code": 100,
                "error_msg": "test error"
            }))
            return


try:
    server = HTTPServer(('', PORT), Handler)
    print 'Server start 127.0.0.1:8080'
    server.serve_forever()
except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()

