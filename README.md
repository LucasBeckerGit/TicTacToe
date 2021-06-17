# TicTacToe

HOW TO LAUNCH THE SERVER ?

This link is really good : https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html 

It talks about : ssh -i mykeys.pem ubuntu@11.22.33.44 and "scp" which transfers files through ssh in both directions (desktop -> instance or instance -> desktop).

git clone the project

cd into the project

npm init -y

npm install express socket.io

sudo node index.js
(you need sudo otherwise network error)




HOW TO LAUNCH THE SERVER AT BOOT ?

Check this raspberry pi link : https://www.raspberrypi.org/documentation/linux/usage/systemd.md

In order to have a command or program run when the instance boots, you can add it as a service. Once this is done, you can start/stop enable/disable from the linux prompt.
Creating a service

On your instance, create a .service file for your service, for example:

myscript.service

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

(I didn't really understand how the User works because even with ubuntu it is still root I think ?? Maybe because we use "sudo systemctl ...")

Copy this file into /etc/systemd/system as root, for example:

sudo cp myscript.service /etc/systemd/system/myscript.service

Once this has been copied, you have to inform systemd that a new service has been added. This is done with the following command:

sudo systemctl daemon-reload

Now you can attempt to start the service using the following command:

sudo systemctl start myscript.service

(You can check the status of a service with the command : systemctl status myscript.service)

Stop it using following command:

sudo systemctl stop myscript.service

When you are happy that this starts and stops your app, you can have it start automatically on reboot by using this command:

sudo systemctl enable myscript.service

The systemctl command can also be used to restart the service or disable it from boot up!

Some things to be aware of:

    The order in which things are started is based on their dependencies — this particular script should start fairly late in the boot process, after a network is available (see the After section).
    You can configure different dependencies and orders based on your requirements.

You can get more information from: man systemctl or here: https://fedoramagazine.org/what-is-an-init-system/

You can check the journal of systemctl with the command :

journalctl | grep myscript.service
