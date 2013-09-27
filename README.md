# HolyGhost

## Prerequisites

To use HolyGhost phantomjs and casperjs have to be installed.

### Installation under Linux

Get phantomjs depending on your Architecture (32bit/64bit) from http://phantomjs.org/download.html

    TODO
    sudo ln -s /opt/phantomjs/.../phantomjs /usr/local/bin/

Get casperjs from http://casperjs.org/

    TODO
    sudo ln -s /opt/casperjs/.../bin/casperjs /usr/local/bin/

## Run your tests

Run your tests simply specifiying your testcase and optionally your proxy.

    ./HolyGhost --test=tests/simpletest_casperjs.js --proxy=http://YOUR.PROXY.HERE:1234

## Writing test cases

See casperjs documentation as a starting point. See also the examples within the directory test/ to see basic layout of HolyGhost-tests.
TODO: describe HolyGhost naming scheme
