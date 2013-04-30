# HolyGhost

## Prerequisites

To use HolyGhost phantomjs and casperjs have to be installed.

### Installation under Linux

Get phantomjs depending on your Architecture (32bit/64bit) from http://phantomjs.org/download.html.

    sudo mkdir /opt/phantomjs
    wget https://phantomjs.googlecode.com/files/phantomjs-1.9.0-linux-x86_64.tar.bz2
    sudo tar -C /opt/phantomjs/ -xjvf phantomjs-1.9.0-linux-x86_64.tar.bz2
    sudo ln -s /opt/phantomjs/phantomjs-1.9.0-linux-x86_64/bin/phantomjs /usr/local/bin/

Get casperjs from http://casperjs.org/.

    sudo mkdir /opt/casperjs
    wget https://github.com/n1k0/casperjs/tarball/1.0.2
    sudo tar -C /opt/casperjs/ -xzvf 1.0.2
    sudo ln -s /opt/casperjs/n1k0-casperjs-bc0da16/bin/casperjs /usr/local/bin/

## Run your tests

Run your tests simply specifiying your testcase and optionally your proxy.

    ./HolyGhost --test=tests/simpletest_casperjs.js --proxy=http://YOUR.PROXY.HERE:1234

## Writing test cases

See casperjs documentation as a starting point.
    TODO
