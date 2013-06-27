//TODO
// complete documentation
// take screenshot when?
// make screenshots configurable
// check when timeouts occur
// implement total time even on timeout
// make url exclusions configurable
// Timout handling necessary also on onWaitTimeout and onTimeout

/*
 * Initialize default objects
 */
var config = {
    resultPath : '/tmp',
    testName : 'unset',
    errorLevel : 2,
    har :  true,
    casper : {
        viewportSize: {
            width : 1024,
            height : 768
            },
        pageSettings: {
            loadImages :  true,
            loadPlugins : false
            },
        logLevel : 'error',
        verbose : true,
        stepTimeout : 10000,
        timeout : 30000
        }
    };

/*
 * Initialize base variables
 */
var stepCount = 0;
var stepsFailed = 0;
var testsFailed = 0;
var stepName = '';
var testStartTime = new Date().toISOString();
var t1;
var t2;
var t;

var nagiosrc = {
    0 : 'OK',
    1 : 'WARNING',
    2 : 'CRITICAL',
    3 : 'UNKNOWN'
    };

var message = '';
var perfdata = '|';


var casper = require('casper').create({
    colorizerType : 'Dummy',
    viewportSize: {
        width: config.casper.viewportSize.width,
        height: config.casper.viewportSize.height
    },
    pageSettings: {
        loadImages:  config.casper.pageSettings.loadImages,
        loadPlugins: config.casper.pageSettings.loadPlugins
    },
    logLevel: config.casper.logLevel,
    verbose: config.casper.verbose,
    stepTimeout: config.casper.stepTimeout,
    timeout: config.casper.timeout,
    failFast: true,
    onStepTimeout: function() {
    	// Timings
    	t2 = new Date().getTime();
    	t = t2 - t1;
    	var now = new Date().toISOString();
    	
        // Format step names
        //?? stepCount++;
        stepsFailed++;
        if (stepName === '') {
            stepName = 'step'+stepCount;
        } else {
            stepName  = stepName.replace(/\s+/g, '_'); // safely replace whitespace characters
        }
        
        // Format output
        casper.echo('Step ('+stepName+') exceeded timeout of '+config.casper.stepTimeout+'msec');
        
        // Add perfdata
        perfdata += '\''+stepName+'\'='+t+'msec ';
        
        // Take screenshot
        casper.capture(config.resultPath+'/'+config.testName+'/'+testStartTime+'/screenshot__'+stepName+'_'+now+'.png');
        
        // Save har
        if (config.har) {
        	pg.endTime = new Date();
        	var content = JSON.stringify(createHar(config.testName, config.testName, pg.startTime, pg.endTime - pg.startTime, pg.resources), undefined, 4);
        	var now = new Date().toISOString();
        	fs.write(config.resultPath+'/'+config.testName+'/'+testStartTime+'/'+now+'.har', content, 'w');
        }
        
        // Exit with rc
        var rc = config.errorLevel;
        message += nagiosrc[rc]+': Timeout in step '+stepName+', failed '+stepsFailed+' steps';
        casper.echo(message+perfdata);
        this.exit(rc);
    }
});


/*
 * Include helper libraries
 */
var fs = require('fs');


/*
 * Format date as ISO string
 */
Date.prototype.toISOString = function () {
    function pad(n) { return n < 10 ? '0' + n : n; }
    function ms(n) { return n < 10 ? '00'+ n : n < 100 ? '0' + n : n }
    return this.getFullYear() + '-' +
        pad(this.getMonth() + 1) + '-' +
        pad(this.getDate()) + 'T' +
        pad(this.getHours()) + ':' +
        pad(this.getMinutes()) + ':' +
        pad(this.getSeconds()) + '.' +
        ms(this.getMilliseconds()) + 'Z';
}


/*
 * Start casper, load test case and parse local config options
 */
var testConfig;

casper.start();

// Load test case file
var testFile = casper.cli.options['test'];
if(/^\/.*$/.test(testFile)) {
    require(testFile);
} else {
    require('./'+testFile);
}

// Parse casper config options
for(var key in testConfig['casper']) {
    casper.options[key] = testConfig['casper'][key];
}
// Parse other config options
for(var key in testConfig) {
    config[key] = testConfig[key];
}

/*
 * HAR creation
 */
if (config.har) {
    function createHar(address, title, startTime, elapsedTime, resources) {
        var entries = [];
    
        resources.forEach(function (resource) {
            var request = resource.request,
                startReply = resource.startReply,
                endReply = resource.endReply;
    
            if (!request || !startReply || !endReply) {
                return;
            }

	    // Exclude Data URI from HAR file because they aren't included in specification
	    if (request.url.match(/(^data:image\/.*)/i)) {	
	        return;
	    }
    
            entries.push({
                startedDateTime: request.time.toISOString(),
                time: endReply ? endReply.time - request.time : -1,
                request: {
                    method: request.method,
                    url: request.url,
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: request.headers,
                    queryString: [],
                    headersSize: -1,
                    bodySize: -1
                },
                response: {
                    status: endReply ? endReply.status : 0,
                    statusText: endReply ? endReply.statusText : "",
                    httpVersion: "HTTP/1.1",
                    cookies: [],
                    headers: endReply ? endReply.headers : [],
                    redirectURL: "",
                    headersSize: -1,
                    bodySize: startReply ? startReply.bodySize : -1,
                    content: {
                        size: startReply ? startReply.bodySize : -1,
                        mimeType: endReply ? endReply.contentType : ""
                    }
                },
                cache: {},
                timings: {
                    blocked: 0,
                    dns: -1,
                    connect: -1,
                    send: 0,
                    wait: startReply ? startReply.time - request.time : -1,
                    receive: (startReply && endReply) ? endReply.time - startReply.time : -1,
                    ssl: -1
                }
            });
        });

    return {
        log: {
            version: '1.2',
            creator: {
                name: "PhantomJS",
                version: phantom.version.major + '.' + phantom.version.minor +
                    '.' + phantom.version.patch
            },
            pages: [{
                startedDateTime: startTime.toISOString(),
                id: address,
                title: title,
                pageTimings: {
                    onContentLoad : 0,
                    onLoad : elapsedTime
                }
            }],
            entries: entries
        }
    };
}

    var pg = new WebPage()
    pg.resources = [];
    
    casper.on('load.started', function (res) {
        pg.startTime = new Date();
    }); 
    
    casper.on('resource.requested', function (req, request) {
       	pg.resources[req.id] = { 
       	    request: req,
       	    startReply: null,
       	    endReply: null
        };
    }); 
    
    casper.on('resource.received', function(res) {
    	if (res.stage === 'start') {
    	    pg.resources[res.id].startReply = res;
    	}   
    	if (res.stage === 'end') {
    	    pg.resources[res.id].endReply = res;
    	}
    });
}


/*
 * Ignore resources from specific URIs
 */
casper.on('resource.requested', function (req, request) {
   	if(req.url.indexOf("push.dab-bank") > -1) {
    request.abort();
    }
}); 


/*
 * Format step names
 */
casper.on('step.start', function(stepResult) {
    // Format step names
    stepCount++;
    if (stepName === '') {
        stepName = 'step'+stepCount;
    } else {
        // safely replace whitespace characters
        stepName  = stepName.replace(/\s+/g, '_');
    }
});


/*
 * Format step output and take screenshot
 */
casper.on('step.complete', function(stepResult) {
    // Detect failures
    if (this.test.getFailures().length > testsFailed) {
        var stepMessage = 'failed';
        stepsFailed++;
        testsFailed = this.test.getFailures().length;
    } else {
        var stepMessage = 'passed';
    }
   
    // Timings
    var now = new Date().toISOString();
    
    // Format output
    casper.echo('Step ('+stepName+') '+stepMessage+', took '+t+'msec');
    
    // Add perfdata
    perfdata += '\''+stepName+'\'='+t+'msec ';
    
    // Take screenshot
    casper.capture(config.resultPath+'/'+config.testName+'/'+testStartTime+'/screenshot__'+stepName+'_'+now+'.png');
    
    // Reset stepName
    stepName = '';
});


/*
 * Timer functions
 */
casper.on('load.started', function() {
    t1 = new Date().getTime();
});

casper.on('load.finished', function() {
    t2 = new Date().getTime();
    t = t2 - t1;
});


/*
 * Run and finish
 */
casper.run(function() {
    // Timings
    pg.endTime = new Date();
    var now = new Date().toISOString();
    
    // Save har
    if (config.har) {
    	var content = JSON.stringify(createHar(config.testName, config.testName, pg.startTime, pg.endTime - pg.startTime, pg.resources), undefined, 4);
    	fs.write(config.resultPath+'/'+config.testName+'/'+testStartTime+'/'+now+'.har', content, 'w');
    }
    
    // Detect failures
    if (stepsFailed > 0) {
        var rc = config.errorLevel;
        message += nagiosrc[rc]+': failed '+stepsFailed+' steps.';
    } else {
        var rc = 0;
        message += nagiosrc[rc]+': passed all steps';
        }
    
    // Exit with rc
    casper.echo(message+perfdata);
    this.exit(rc);
});
