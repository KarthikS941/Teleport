//
//  ViewController.swift
//  Teleport-iOS-Example
//
//  Created by Karthik Sankar on 3/27/17.
//  Copyright © 2017 Karthik Sankar. All rights reserved.
//

import UIKit
import Teleport

class ViewController: UIViewController,TeleportDelegate {

    let tel = Teleport.sharedInstance

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        tel.delegate = self
        tel.connectWith(pin: "o11pt92pr")
        

        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func teleportConnected() {
        tel.writeLogWith(logType: .info, message: "test")
        tel.writeLogWith(logType: .warning, message: "test warning")
        tel.writeLogWith(logType: .error, message: "test error")
        tel.writeLogWith(logType: .verbose, message: "test verbose")
        tel.writeLogWith(logType: .debug, message: "test debug")
    }
    
    func teleportDisconnected() {
        tel.writeLogWith(logType: .info, message: "test")

    }

    func teleportWriteError(error: TeleportError) {
        print(error.description)
    }
}

