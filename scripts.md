# Save page on load
```js
console.log("waiting to populate html")
setTimeout(saveHtml, 5000)

function saveHtml(filename) {
    console.log("saving html")
    const myHtml = document.querySelector("html").innerHTML;
    if (!filename) filename = 'html.html'

    var blob = new Blob([myHtml], {
        type: 'text/html'
    }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/html', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

```

# Build any version of Node
```bash
cd /usr/local/src
wget http://nodejs.org/dist/latest/node-v7.2.1.tar.gz
tar -xvzf node-v7.2.1.tar.gz
cd node-v7.2.1
./configure
make
sudo make install
which node
```

# Register a service
## Create a user that the service will run as
```bash
sudo adduser {username}
# use any password, it will be removed in the next step
sudo passwd -d {username}
```
## Modify the passwd file
```
# temporarily change the permission if needed
# sudo chmod a=wrx /etc/passwd
sudo nano /etc/passwd
```
```bash
# in the following example, {username} is testusername

# now change the last line from this format:
testusername:x:1002:1003:,,,:/home/testusername:/bin/bash

# to this format
testusername:x:1002:1003::/home/testusername:/usr/sbin/nologin
```
## Create the service
```bash
sudo nano /etc/systemd/system/{name}.service
```
```bash
# {name} is the bin executable

[Unit]
Description={fancy name}
After=network.target

[Service]
Type=simple
User={username}
Group={group}
ExecStart=/usr/bin/{name}
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
## Register and enable the service
```bash
sudo systemctl enable {name}
sudo systemctl start {name}
```