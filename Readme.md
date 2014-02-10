![Myyna, pintrest clone](http://www.myyna.com/wp-content/uploads/2014/02/band_logo11.png)

#Install Node.js version 0.8 or above (stable version preferred)

###Mac

If you're using the excellent homebrew package manager, you can install node with one command: brew install node.
Otherwise, follow the below steps:
Install Xcode.
Install git.
Run the following commands:<br>
`git clone git://github.com/ry/node.git`<br>
`cd node`<br>
`./configure`<br>
`make`<br>
`sudo make install`

###Ubuntu

1.Install the dependencies:<br>
`sudo apt-get install g++ curl libssl-dev apache2-utils`<br>
`sudo apt-get install git-core`<br>
2.Run the following commands:<br>
`git clone git://github.com/ry/node.git`<br>
`cd node`<br>
`./configure`<br>
`make`<br>
`sudo make install`

NB: node version can be checked from terminal by <br>
`$ node -v`

use this link for further information: 
http://howtonode.org/how-to-install-nodejs


### Install Mongodb 

`sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10`

`echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen'` | `sudo tee /etc/apt/sources.list.d/mongodb.list`

`sudo apt-get update`<br>
`sudo apt-get install mongodb-10gen`
use this link for further information:  
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

###Install MongoDB with Homebrew

Homebrew [1] installs binary packages based on published “formulae”. The following commands will update brew to the latest packages and install MongoDB.

In a terminal shell, use the following sequence of commands to update``brew`` to the latest packages and install MongoDB:<br>

`brew update`<br>
`brew install mongodb`<br>

use this link for further information: 
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/



### Install ImageMagick

`sudo apt-get install imagemagick`


### Download & extract myyna to your project folder.


###Provide read and write permission to config & uploads folder
It is mandatory, since we need to rewrite the config files & uploads directory.
###Open terminal, and navigate to project directory & Run
For example,<br>
`cd Projects/myyna`<br>
`node app`<br>

##Install Myyna

1.Navigate browser to  http://localhost:3000 to continue installation.
 
2.You will be asked to fill up an installation form., Follow the the installation instructions.

3.Please fill all the details like port you want to run the application, database credentials, database name, admin username, admin  password etc.

4.Be sure to provide the correct site url. If you are running on a local system, site url will be http://localhost:3000 or http://192.168.1.1:3000 , assuming your port is 3000 & local ip is 192.168.1.1. Or if you’ve configured a domain for your application, just give that url, for example, http://www.example.com

5.If you need support to host application on a domain, please feel free to contact our support team.

6.If you need to run the application in low level ports like, 100, 1000 then you must run the project as root.
sudo node app.js

7.After installation, You can optionally send a message to myyna team for support or feedbacks using the feedback form.

8.Then, go back to terminal and run the project again as we stopped it to change the configurations. You can either start normally using node app or, use nohup to avoid process exit on closing terminal.
nohup node app &

9. Visit your site url to see it in action 
eg:-http://localhost:3000 or http://example.com

###See your admin section

Myyna application includes an admin panel, to control your site.  Here you can manage users, admin users, site name & logo, meta descriptions, social connects and all. Admin section can be accessed by navigating to your siteurl/admin, with  username and password selected at the installation time.

eg: http://example.com/admin



## License

(The MIT License)

Copyright Cubet Techno Labs (c) 2013  <info@cubettech.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
