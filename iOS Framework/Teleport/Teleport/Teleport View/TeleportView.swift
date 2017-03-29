//
//  TeleportView.swift
//  Teleport
//
//  Created by Karthik Sankar on 3/28/17.
//  Copyright © 2017 Karthik Sankar. All rights reserved.
//

import UIKit

class TeleportView: UIView {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

    @IBOutlet weak var pinTextField: UITextField!
    @IBOutlet weak var `switch`: UISwitch!
    
    @IBAction func switchChanged(_ sender: Any) {
        if (sender as! UISwitch).isOn {
            pinTextField.isUserInteractionEnabled = false
            Teleport.sharedInstance.connectWith(pin: pinTextField.text!)
        }
        else {
            pinTextField.isUserInteractionEnabled = true
            Teleport.sharedInstance.disconnect()
        }
    }
}

extension UIView {
    class func fromNib<T : UIView>() -> T {
        return Bundle(for: T.self).loadNibNamed(String(describing: T.self), owner: nil, options: nil)![0] as! T
    }
}
