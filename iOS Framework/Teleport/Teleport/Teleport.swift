//
//  Teleport.swift
//  Teleport
//
//  Created by Karthik Sankar on 3/27/17.
//  Copyright © 2017 Karthik Sankar. All rights reserved.
//
import Foundation

// Enum for Error Handling
public enum TeleportError: Int,CustomStringConvertible {
    case connectError = 1001,
         unexpectedError,
         writeError
    public var description : String {
        switch self {
            case .writeError: return "Teleport cannot send log"
            case .connectError: return "Teleport cannot connect to server"
            case .unexpectedError: return "Something went wrong in Teleport"
        }
    }
}

// Enum for Log Types
public enum LogType: Int ,CustomStringConvertible {
    case verbose,
         debug,
         info,
         warning,
         error
    public var description : String {
        switch self {
            case .debug: return "Debug";
            case .verbose: return "Verbose";
            case .info: return "Info";
            case .warning: return "Warning";
            case .error: return "Error";
        }
    }
}
// Protocol
public protocol TeleportDelegate:class {
    func teleportConnected()                            // Teleport Connection
    func teleportDisconnected()                         // Teleport Disconnection
    func teleportWriteError(error:TeleportError)        // Teleport Write Error
}

public class Teleport: NSObject{
    
    public static let sharedInstance = Teleport()      // Singleton Instance
    
    var socket:WebSocket!                               // WebSocket
    let connectionProtocols = ["teleport-protocol"]     // Protocols to connect with
    var masterViewController:UIViewController!          // Master View Controller
    var teleportView: TeleportView = .fromNib()         // Teleport View

    public weak var delegate: TeleportDelegate!         // Teleport Delegate
    
    private override init() {}
// MARK: Teleport
/**
     Connect to local server using the pin
     
     - Parameters:
        - pin: Pin used to connect with local host
 */
    public func connectWith(pin: String) {
        // Create WebSocket
        socket = nil
        // Url to connect
        var connectionUrl = Utility.getTunnelMeURLStringWith(subDomain: pin)  // Pin is subdomain
        socket = WebSocket(url: URL(string:connectionUrl)!, protocols: connectionProtocols)
        socket.delegate = self  // Set Delegate
        socket.connect()        // Connect to Websocket
    }

/**
    Disconnect from local server
*/
    public func disconnect() {
        // Disconnect Socket
        socket.disconnect()
    }
    
    public func addTeleportTo(viewController:UIViewController) {
        self.masterViewController = viewController  // Get View Controller
        // Add Tap Gesture
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
        viewController.view.addGestureRecognizer(tap)
        viewController.view.isUserInteractionEnabled = true
    }
    
    func handleTap(_ sender: UITapGestureRecognizer) {
        teleportView.translatesAutoresizingMaskIntoConstraints = false

        if isTeleportVisible() {
            hideTeleportView()
        }
        else {
            showTeleportView()
        }
    }
    
    func showTeleportView() {
        self.masterViewController.view.addSubview(teleportView)
        self.masterViewController.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|[view]|", options: NSLayoutFormatOptions.alignAllCenterY , metrics: nil, views: ["view": teleportView]))
        self.masterViewController.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|[view]", options: NSLayoutFormatOptions.alignAllCenterX , metrics: nil, views: ["view": teleportView]))
        
        teleportView.switch.setOn(isSocketOn(), animated: false)
    }
    
    func isSocketOn () -> Bool {
        guard let _ = socket else {
            return false
        }
        return socket.isConnected
    }

    func hideTeleportView() {
        teleportView.removeFromSuperview()
    }
    
    func isTeleportVisible() -> Bool {
        if teleportView.isDescendant(of: self.masterViewController.view) {
            return true
        }
        return false
    }
}

// MARK: Websocket Methods
/**
    Websocket Delegate callbacks
 */
extension Teleport: WebSocketDelegate {
    
    // Websocket Connected
    public func websocketDidConnect(socket: WebSocket) {
        // Write Device Information
        writeDeviceInfoToLog()
        delegate?.teleportConnected()               // Call Teleport Connected
    }
    
    // Websocket Disconnected
    public func websocketDidDisconnect(socket: WebSocket, error: NSError?) {
        delegate?.teleportDisconnected()            // Call Teleport Disconnected
    }
}

// MARK: Websocket writes
/**
    Websocket writes
 */
extension Teleport {
    
/**
    Writes device information to remote log
 */
    func writeDeviceInfoToLog() {
        let device = "Device \(Device())"       // Device Name
        let timeStamp = DateFormatter.localizedString(from: Date(), dateStyle: .medium, timeStyle: .short)  // Time Stamp
        let deviceLog = "===== Device Information =====\nDevice : \(device)\nConnected on : \(timeStamp)"
        socketWrite(message: deviceLog)            // Write to log
    }
/**
    Write system logs
 */
    public func writeLogWith(_ functionName: StaticString = #function, fileName: String = #file, lineNumber: Int = #line,logType:LogType, message:String) {
        let logString = "\t:: \(logType.description) ::  "                                                  // Log Mode
        let fileString = "[File] \((fileName as NSString).lastPathComponent)\t"                             // File Name
        let functionString = "[Function] \(functionName)\t"                                                 // Function Name
        let lineString  =  "[Line] \(lineNumber)\t"                                                         // Line Number
        let messageString = "[Message] \(message)"                                                          // Message
        let timeStamp = DateFormatter.localizedString(from: Date(), dateStyle: .medium, timeStyle: .short)  // Time Stamp
        
        let debugLogString = "\(timeStamp)\(logString)\(fileString)\(functionString)\(lineString)\(messageString)"
        let serverDebugLogString = "\(timeStamp)@\(logType.description)@\((fileName as NSString).lastPathComponent)@\(functionName)@\(lineNumber)@\(message)"

        socketWrite(message: serverDebugLogString)            // Write to server log
    }
    
/**
    WebSocket write function
 */
    func socketWrite(message:String) {
        // Check for socket connection
        guard let _ = socket else {
            print("Socket Not Found")
            delegate.teleportWriteError(error: .writeError)
            return
        }
        // Write String to Socket
        if socket.isConnected {
            socket.write(string: message)         // Write message to log
            return
        }
            delegate.teleportWriteError(error: .connectError)
    }
}
