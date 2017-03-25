#!/usr/bin/env node
var portfinder = require('portfinder');             // Port Finder
var WebSocketServer = require('websocket').server;  // Web Socket
var http = require('http');                         // Http
var localtunnel = require('localtunnel');           // Local Localtunnel
var randomstring = require('randomstring');         // Random String
var parseDomain = require('parse-domain');          // Parse Domain
var clc = require('cli-color');                     // CLI Color
var emoji = require('node-emoji');                  // Emoticons

// Colors
var headerBackground = clc.xterm(39);
var error = clc.red;
var warn = clc.yellow;
var notice = clc.xterm(19);
var connectionFont = clc.xterm(3);
var debugColor = clc.xterm(41);
var infoColor = clc.xterm(45);
var warningColor = clc.xterm(227);
var errorColor = clc.xterm(198);

// Variables
var serverPort = 8080

/// Main Module ///
/// Port Finder Module ///
portfinder.getPortPromise()
    .then((port) => {
        // Print Header
        printHeader();
        // There is a free port found
        console.log(notice("Connecting to your computer terminal... ")+emoji.get('computer'));
        // Start the server with free port
        startServerInPort(port);
    })
    .catch((err) => {
        // No free port found
        console.log("No ports are available");
});

///  Server Module ///
var server = http.createServer(function(request, response) {
    console.log((new Date()) + "Received request for " + request.url);
    response.writeHead(404);
    response.end();
});

startServerInPort = function(port) {
        serverPort = port
        // Start your server
        server.listen(parseInt(serverPort), function() {
        // Generate Ramdom String
        var randomString = randomstring.generate({
                            charset: "2912telpor",
                            length : 9
                        });
        var subDomainString = randomString
        var tunnel = localtunnel(parseInt(serverPort), { subdomain: subDomainString }, function(err, tunnel) {
        var test = parseDomain(tunnel.url);
        console.log(notice("Enter '"+test.subdomain+"' in your mobile device."));
        });
    });
}

/// WebSocket ///
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('teleport-protocol', request.origin);
    console.log(connectionFont("Connected to "+emoji.get('calling')));
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            printLog(message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            // connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log(emoji.get('iphone')+connectionFont("  Device disconnected."));
    });
});

/// Utilities ///
printHeader = function() {
    // Teleport Header 
    var header = '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n' +
                 '!!                TELEPORT v0.1' + emoji.get('joystick') + '                 !!\n' +
                 '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n';
    var style = { "!": headerBackground("*")};
    process.stdout.write(clc.art(header, style));
}

printLog = function(logString) {
    // Scan text
    console.log(debugColor(logString));
}