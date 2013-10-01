//TODO insert copyright and licensing
//TODO check perfdata handling after failfast and missing values
/*
 * This "pre"-"test" exhibits all his event processing and functions to the real test afterwards
 */

/*
 * Load fs module
 */
var fs = require('fs');

/*
 * Get options from calling script
 */
if ( casper.cli.has('hgResultpath') === false ) {
	casper.die('Needed argument hgResultpath not provided');
} else {
	var resultpath = casper.cli.get("hgResultpath");
}

/*
 * Casper options
 */
casper.options.viewportSize = {
	width: 1024,
	height: 768
};
casper.options.pageSettings = {
	loadImages: true,
	loadPlugins: false
};

/*
 * Basic settings
  */
var pg = new WebPage();
pg.resources = [];
pg.startTime = new Date();
casper.startTime = new Date();

/*
 * Timeout options and handling
 */
casper.options.timeout = 60000;
casper.on('timeout', function() {
	hgCapture(casper);
	casper.test.fail('Test ran into Overall timeout');
});
casper.options.stepTimeout = 20000;
casper.on('step.timeout', function() {
	hgCapture(casper);
	casper.test.fail('Test ran into Step timeout');
});
casper.options.waitTimeout = 10000;
casper.on('waitFor.timeout', function() {
	hgCapture(casper);
	casper.test.fail('Test ran into WaitFor timeout');
});

/*
 * HTTP status callbacks
 */
casper.on("http.status.404", function(resource) {
        //failed.push(this.requestUrl);
        hgCapture(casper);
        casper.test.fail('HTTP Error 404');
});
casper.on("http.status.500", function(resource) {
        //failed.push(this.requestUrl);
        hgCapture(casper);
        casper.test.fail('HTTP Error 500');
});

/*
 * Format date as ISO string, needed to override builtin for correct HAR generation
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
};

/*
 * Funtion for capturing page html and screenshots
 */
function hgCapture(casper) {
	var now = new Date().toISOString();
	// Save HTML
	var html = casper.getHTML();
	fs.write(resultpath+'/html__'+now+'.html', html, 'w');
	// Take screenshots if enabled
	if ( casper.cli.get("hgScreenshot") ) {
		casper.capture(resultpath+'/screenshot__'+now+'.png');
	}
	// Save HAR if enabled
	if ( casper.cli.get("hgHar") ) {
		casper.endTime = new Date();
		var content = JSON.stringify(createHar(pg.address, 'HolyGhost', pg.startTime, pg.resources), undefined, 3);
		fs.write(resultpath+'/har'+now+'.har', content, 'w');
	}
}

/*
 * HAR creation if enabled
 */
if ( casper.cli.get("hgHar") ) {
	function createHar(address, title, startTime, resources)
	{
	    var entries = [];
	
	    resources.forEach(function (resource) {
	        var request = resource.request,
	            startReply = resource.startReply,
	            endReply = resource.endReply;
	
	        if (!request || !startReply || !endReply) {
	            return;
	        }
	        
	        // Exclude Data URI from HAR file because
	        // they aren't included in specification
	        if (request.url.match(/(^data:image\/.*)/i)) {
	        	return;
	        }
	
	        entries.push({
	            startedDateTime: request.time.toISOString(),
	            time: endReply.time - request.time,
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
	                status: endReply.status,
	                statusText: endReply.statusText,
	                httpVersion: "HTTP/1.1",
	                cookies: [],
	                headers: endReply.headers,
	                redirectURL: "",
	                headersSize: -1,
	                bodySize: startReply.bodySize,
	                content: {
	                    size: startReply.bodySize,
	                    mimeType: endReply.contentType
	                }
	            },
	            cache: {},
	            timings: {
	                blocked: 0,
	                dns: -1,
	                connect: -1,
	                send: 0,
	                wait: startReply.time - request.time,
	                receive: endReply.time - startReply.time,
	                ssl: -1
	            },
	            pageref: address
	        });
	    });
	
	    return {
	        log: {
	            version: '1.2',
	            creator: {
	                name: "CasperJS",
	                version: phantom.version.major + '.' + phantom.version.minor +
	                    '.' + phantom.version.patch
	            },
	            pages: [{
	                startedDateTime: startTime.toISOString(),
	                id: address,
	                title: title,
	                pageTimings: {
	                	onLoad: casper.endTime - casper.startTime
	                }
	            }],
	            entries: entries
	        }
	    };
	};
	
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
};

/*
 * Ignore resources from specific URIs
 */
casper.on('resource.requested', function (req, request) {
   	if(req.url.indexOf("push.dab-bank") > -1) {
    request.abort();
    }
}); 

/*
 * Actions on step completion
 */
casper.on('step.complete', function(step) {
	pg.address = this.getCurrentUrl();
	hgCapture(casper);
});

/*
 * Finalizing this "test"
 */
casper.test.done();
