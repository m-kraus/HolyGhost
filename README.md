# About HolyGhost

HolyGhost is a monitoring solution for performing end2end-tests on websites (HTML/JavaScript). HolyGhost uses PhantomJS and CasperJS and therefore can run headless and with very low impact in multiple environments. HolyGhost has been tested on Linux and Mac OSX. HolyGhost is a plugin for nagios and similar monitoring tools like icinga, naemon or shinken.  

## Prerequisites

To use HolyGhost phantomjs and casperjs have to be installed and reachable in your path.

HolyGhost needs CasperJS API version 1.1+.

**Please note, that at the time of writing (2015-02-16) PhantomJS 2.0.0 has been recently released. Unfortunately CasperJS works only when using the current master branch or the branch phantomjs-2 from its Github-repository. To make things a little more complictaed, there are no official PhantomJS-2 binaries for linux at the moment. You can download third party binaries from https://github.com/eugene1g/phantomjs/releases or compile it yourself.**

**I recommend to use PhantomJS 1.9.7 and CasperJS 1.1-beta3 at the moment.**

HolyGhost needs the perl modules XML::libXML and File::Which. On Ubuntu or Debian for exmaple you can install them with the following command:

    sudo apt-get install libxml-libxml-perl libfile-which-perl

PhantomJS 1.9 requires libfontconfig1. On Ubuntu or Debian you can install it with the following command:

    sudo apt-get install libfontconfig1

### Installation under Linux

Get phantomjs depending on your Architecture (32bit/64bit) from http://phantomjs.org/download.html

    cd /opt
    sudo tar xvf Downloads/phantomjs-1.9.8-linux-x86_64.tar
    sudo ln -s phantomjs-1.9.8-linux-x86_64 phantomjs
    sudo ln -s /opt/phantomjs/bin/phantomjs /usr/local/bin/

Get casperjs from http://casperjs.org/

    cd /opt
    sudo unzip Downloads/n1k0-casperjs-1.1-beta3-0-g4f105a9.zip
    sudo ln -s n1k0-casperjs-4f105a9 casperjs
    sudo ln -s /opt/casperjs/bin/casperjs /usr/local/bin/
    
## Write or record your tests

A good starting point is the CasperJS documentation. See http://docs.casperjs.org/en/latest/ to get an idea of all the possibilities, CasperJS can offer you.

You can also use the Chrome-extension "Resurrectio" to record CasperJS tests. You can find it on Github https://github.com/ebrehault/resurrectio or from the Chrome Web Store.

Resurrectio can be a very good starting point to help you writing your tests, but be also aware, that from my experience no recorded test can suffice for qualified e2e montoring. For example you should really add more assertions or double-check, if Resurrectio chose the right css/xpath selectors for you.

As you have to store passwords within your test case, you should really use dedicated accounts for your tests, that are restricted to the absolute minimal needed rights. Be also aware, that also your test results (screenshots, HAR-Files, HTML-Files, etc.) could expose confidential data.
So be sure to make test cases and result files only accessible to trusted persons using file system permissions and webserver authentication. Also consider, whether notification texts could contain confidential data.

## Run your tests

You can find some sample test cases in this repositories' subdirectory "tests".

Run your tests simply specifiying your testcase and optionally your proxy.

    ./HolyGhost --test=tests/simpletest_casperjs.js --proxy=http://YOUR.PROXY.HERE:1234

For other options see

    ./HolyGhost --help

## HolyGhost conventions

You can set CasperJS options within your test case, for example timeouts or viewport sizes:

     casper.options.viewportSize = {width: 1600, height: 600};
     casper.options.stepTimeout = 20000;
     casper.options.waitTimeout = 10000;
     casper.options.timeout = 60000;

Very important for HolyGhost is the casper.test.begin statement.
In the description string (first argument to casper.test.begin) you can set separated by :: the nagios return code (CRITICAL, WARNING, ...), a short name and a description of your test case.
The "planned" number (second argument to casper.test.begin) represents the number of tests ("test.") used in your test case. You will get an error message from CasperJS if this number differs from the real number of tests within the test case.

    casper.test.begin('CRITICAL::TestCaseName::Description of my test', 2, function suite( test ) { ...

In the "message" string of a test you can set a step name and a step description, separated by ::.

    test.assertTitle('Google', 'STEP1::Verify title is "Google"');

Please note, that you can use the step name multiple times. Using this feature you can combine multiple test assertions into one single step. You get performace data for that combined step.

In performance data outpu output, you also get the total execution time of the test case. Default label is "Total", you can change this with the command line option --label

## Screenshots and HAR files

HolyGhost captures always a cookiejar file and the HAR file of the complete test case. For more information about the HAR specification see https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/HAR/Overview.html

HolyGhost also captures on test failure the current html source and a screenshot.

By default these files are only kept on failed tests. You can change that behaviuor using the command line options --keep or --delete

## HAR viewer

TODO
