# About HolyGhost

HolyGhost is a monitoring solution for performing end2end tests on websites (HTML/JavaScript). HolyGhost uses PhantomJS (http://www.phantomjs.org) and CasperJS (http://www.casperjs.org) and therefore can run headless and with very low impact in multiple environments. HolyGhost has been tested on Linux and Mac OSX. HolyGhost is a plugin for nagios and similar monitoring tools like icinga, naemon or shinken.  

## Prerequisites

To use HolyGhost phantomjs and casperjs have to be installed and reachable in your path.

HolyGhost needs CasperJS API version 1.1+. HolyGhost is tested with PhantomJS 2.1.1 and CasperJS 1.1.1 on Linux.

HolyGhost needs the perl modules XML::libXML and File::Which. On Ubuntu or Debian for exmaple you can install them with the following command:

    sudo apt-get install libxml-libxml-perl libfile-which-perl

PhantomJS requires fontconfig. On Ubuntu or Debian you can install it with the following command:

    sudo apt-get install libfontconfig1

### Installation under Linux

Get phantomjs depending on your Architecture (32bit/64bit) from http://phantomjs.org/download.html
At the time of writing this is https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2

    cd /opt
    sudo tar xjvf Downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
    sudo ln -s phantomjs-2.1.1-linux-x86_64 phantomjs
    sudo ln -s /opt/phantomjs/bin/phantomjs /usr/local/bin/

Get casperjs from https://github.com/casperjs/casperjs/releases:
At the time of writing this is https://github.com/casperjs/casperjs/archive/1.1.1.tar.gz

    cd /opt
    sudo tar xzvf Downloads/1.1.1.tar.gz
    sudo ln -s casperjs-1.1.1 casperjs
    sudo ln -s /opt/casperjs/bin/casperjs /usr/local/bin/
    
## Write or record your tests

In the dirctory ```tests``` you can find some sample test cases. These are ready to run and can give you an idea, what you can do with HolyGhost.

A good starting point is the CasperJS documentation. See http://docs.casperjs.org/en/latest/ to get an idea of all the possibilities of CasperJS.

You can also use the Chrome-extension "Resurrectio" to record CasperJS tests. You can find it on Github https://github.com/ebrehault/resurrectio or get it from the Chrome Web Store.

Resurrectio can be a very good starting point to help you writing your tests, but be also aware, that from my experience no recorded test can suffice for qualified e2e montoring. For example you should really add more assertions and double-check, if Resurrectio chose the right css/xpath selectors for you.

As you have to store passwords within your test case, you should really use dedicated accounts for your tests, that are restricted to the absolute minimal needed rights. Be also aware, that also your test results (screenshots, HAR-Files, HTML-Files, etc.) could possibly expose confidential data.
So be sure to make test cases and result files only accessible to trusted persons using file system permissions and webserver authentication. Also consider, whether notification texts could contain confidential data.

## Run your tests

You can find some sample test cases in this repositories' subdirectory ```tests```.

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

Very important for HolyGhost is the ```casper.test.begin``` statement.
In the description string (first argument to ```casper.test.begin```) you can set separated by ```::``` the nagios return code (CRITICAL, WARNING, ...), a short name and a description of your test case.
The planned number (second argument to ```casper.test.begin```) represents the number of tests (The javascript statement ```test.```) used in your test case. You will get an error message from CasperJS if this number differs from the real number of tests within the test case.

    casper.test.begin('CRITICAL::TestCaseName::Description of my test', 2, function suite( test ) { ...

In the message string of a test you can set a step name and a step description, separated by ```::```.

    test.assertTitle('Google', 'STEP1::Verify title is "Google"');

Please note, that you can use the step name multiple times. Using this feature you can combine multiple test assertions into one single step. You get performace data for that combined step.

In performance data output, you also get the total execution time of the test case. Default label is "Total", you can change this with the command line option ```--label```.

You can specify any amount of parameters on your HolyGhost command line using the option ```--param```. You can use these parameters within your test cases using
    
    casper.cli.get("hgParam0");
    casper.cli.get("hgParamr1");
    ...
    casper.cli.get("hgParamN");

The parameters are numbered in the order you specify them on the command line.

## Screenshots and HAR files

HolyGhost captures always a cookiejar file and the HAR file of the complete test case. For more information about the HAR specification see https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/HAR/Overview.html

HolyGhost also captures on test failure the current html source and a screenshot.

By default these files are only kept on failed tests. You can change that behaviour using the command line options ```--keep``` or ```--delete```.

## HAR viewer

HolyGhost uses the HAR viewer component of Jan Odvarko (http://www.janodvarko.cz/har/viewer/) to display the har file nicely respresented as a waterfall chart.

To use this option, you have to have a webserver running, expose the folder ```www``` as a location and specify this location with the command line option ```--url```. Provide a complete URL containing a preceding ```http(s)://``` and a trailing ```/```.

When ```--url``` is set, the plugin output contains links to the results of the curent test case, if a failure occurred or when the option ```--keep``` is used.

The option ```--dir``` is needed, if you want or need to move the directory ```wwww``` containing the HAR viewer and the results directory to another location. 

## Debug mode

By using the command line option ```--debug``` you get more detailed output, for example the calculated command to call CasperJS, as well as its complete output. In debug mode HolyGhost captures the current html source and a screenshot on every test assertion (```test.```).
