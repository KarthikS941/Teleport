# Teleport
![alt tag](https://raw.githubusercontent.com/KarthikSankar29/Teleport/master/res/icon.png)
Teleport - iOS Swift logging framework
Logs have been vital part in program debugging. iOS NSLog and print statements provide the flexibility in printing logs in console if devices are connected to Mac. But we as developers have faced problems where we need remote logging. One usual approach that we used was to log into a file and get that file for further debugging a particular use case. But what about realtime debugging, Teleport lets you to see real time logs on your local Windows or Mac machine. Real time logs are printed in console as the app logs it for us.

This helps in fixing bugs that developer is not able to trace using static logs.

Teleport contains two components 
1. Desktop Node JS App.
2. iOS Framework that gets you logging started in your app.

### Installing the Desktop App
#### Prerequisites
Node JS (https://nodejs.org/en/)

#### Install Modules
```
npm install
```

#### Run the app
```
node teleport.js
```
### Adding Framework to iOS App
#### Using Cocoapods
TeleportiOS is available through CocoaPods. To install it, simply add the following line to your Podfile:
```
pod "TeleportiOS"
```
#### Using Frameworks
Download the iOS framework project from folder 'iOS Framework/Teleport'
