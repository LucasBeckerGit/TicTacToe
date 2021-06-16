# TicTacToe

HOW TO LAUNCH THE SERVER ?

git clone the project

cd into the project

npm init -y

npm install express socket.io

sudo node index.js
(you need sudo otherwise network error)



To launch the server directly at the boot of the EC2 instance, you need to create a systemd service.

Check this raspberry pi link : https://www.raspberrypi.org/documentation/linux/usage/systemd.md


My service is : myscript.service

(it works with ubuntu as the user and not root for some reason even if when we launch the server normaly we need to do : sudo node index.js to open ports)
Maybe because we use sudo with systemctl ??? (sudo systemctl enable myscript.service)

[Unit]
Description=My service
After=network.target

[Service]
ExecStart=/usr/bin/node index.js
WorkingDirectory=/home/ubuntu/TicTacToe
StandardOutput=inherit
StandardError=inherit
Restart=always
User=ubuntu

[Install]
WantedBy=multi-user.target
