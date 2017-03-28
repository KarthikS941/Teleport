#!/usr/bin/env node
var portfinder = require('portfinder');             // Port Finder
var WebSocketServer = require('websocket').server;  // Web Socket
var http = require('http');                         // Http
var localtunnel = require('localtunnel');           // Local Localtunnel
var randomstring = require('randomstring');         // Random String
var parseDomain = require('parse-domain');          // Parse Domain
var clc = require('cli-color');                     // CLI Color
var emoji = require('node-emoji');                  // Emoticons
var table = require('easy-table')                   // Content Table

// Colors based on https://github.com/medikoo/cli-color
var headerBackground = clc.xterm(39);
var error = clc.red;
var warn = clc.yellow;
var notice = clc.xterm(19);
var connectionFont = clc.xterm(3);
var debugColor = clc.xterm(41);
var infoColor = clc.xterm(45);
var warningColor = clc.xterm(227);
var errorColor = clc.xterm(196);
var verboseColor = clc.xterm(201);
var tableHeader = clc.xterm(6);

// Variables
var serverPort = 8080
var contentTable = new table

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
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
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

getLogColorFor = function(logMode) {
    if (logMode == "Info") {
        return infoColor
    }
    else if (logMode == "Warning") {
        return warningColor
    }
    else if (logMode == "Error") {
        return errorColor
    }
    else if (logMode == "Verbose") {
        return verboseColor
    }
    else if (logMode == "Debug") {
        return debugColor
    }
    else {
        return debugColor
    }
}
printEmptyTable = function() {

    var loadDict = [{
        timeStamp : "                   ",
        logType : "    ",
        fileName : "                         ",
        functionName : "                            ",
        lineNumber : "    ",
        message : "                                     "
    }]

    console.log(tableHeader(table.print(loadDict, function(log, cell) {
        cell('Time Stamp', log.timeStamp)
        cell('Log Type', log.logType)
        cell('File',log.fileName)
        cell('Function',log.functionName)
        cell('Line',log.lineNumber)
        cell('Message',log.message)
    }, function(table1) {
        return table1.toString()
    })));
}
printLog = function(logString) {
    // Check for type of log 
    var color = debugColor
    var logArray = logString.split("@");

    if (logArray.length > 1) {
        var timeStamp = logArray[0];        // Time Stamp
        var logType = logArray[1];          // Log Type
        var fileName = logArray[2];         // File Name
        var functionName = logArray[3];     // Function Name
        var lineNumber = logArray[4];       // Line Number
        var message = logArray[5];          // Message

        var loadDict = [{
            timeStamp : timeStamp,
            logType : logType,
            fileName : fileName,
            functionName : functionName,
            lineNumber : lineNumber,
            message : message
        }]

        var logColor = getLogColorFor(logType)

        console.log(table.print(loadDict, function(log, cell) {
            cell('Time Stamp', log.timeStamp)
            cell('Log Type', logColor(log.logType))
            cell('File',log.fileName)
            cell('Function',log.functionName)
            cell('Line',log.lineNumber)
            cell('Message',message)
        }, function(table1) {
            return table1.print()
        }))
    }
    else {
        console.log(connectionFont(logString));
        printEmptyTable();
    }
}