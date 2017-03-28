//
//  Utility.swift
//  Teleport
//
//  Created by Karthik Sankar on 3/27/17.
//  Copyright © 2017 Karthik Sankar. All rights reserved.
//

import Foundation

class Utility:NSObject {

/**
     Generate Tunnel.me Url with subdomain
     More details on Tunnel.me can be found in https://localtunnel.github.io
     
     - Parameters:
        - subDomain: domain name thats added to tunnel.me
 */
    class func getTunnelMeURLStringWith(subDomain: String) -> String {
        return "ws://\(subDomain).localtunnel.me"
    }
}
