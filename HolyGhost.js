/*
 * Copyright (c) 2013-2015 Michael Kraus
 *
 * This file is part of HolyGhost.
 *
 * HolyGhost is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HolyGhost is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses>.
 */

/*
 * This "pre"-"test" exhibits all his event processing and functions to the real test afterwards
 */

/*
 * Format date as ISO string, needed to override builtin for correct HAR generation
 */
Date.prototype.toISOString = function() {
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    function ms(n) {
        return n < 10 ? '00' + n : n < 100 ? '0' + n : n
    }
    return this.getFullYear() + '-' +
        pad(this.getMonth() + 1) + '-' +
        pad(this.getDate()) + 'T' +
        pad(this.getHours()) + ':' +
        pad(this.getMinutes()) + ':' +
        pad(this.getSeconds()) + '.' +
        ms(this.getMilliseconds()) + 'Z';
};


/*
 * Load fs module
 */
var fs = require('fs');
var utils = require('utils');
//TODO shorten xpath selector like in check_casper

/*
 * Get options from calling script
 */
if (casper.cli.has('hgResultpath') === false) {
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
 * SetUp and TearDown
 */
// Set up: nothing
casper.test.setUp(function() {
    //unused
});
// Tear down:
casper.test.tearDown(function() {
    //ununsed
});

/*
 * Basic settings
 */
var pg = new WebPage();
pg.resources = [];
pg.startTime = new Date();
pg.address = 'Start_' + pg.startTime.toISOString();
casper.startTime = new Date();

/*
 * Actions on test failures
 */
casper.test.on("fail", function(failure) {
    hgCapture(casper, "fail");
    hgHar(casper);
    // must not be used with casperjs > 1.1.3
    //casper.test.terminate("Aborted all remaining tests");
});
/*
 * Actions on test completion
 */
casper.test.on("complete", function() {
    // unused
});

/*
 * Timeout options and handling
 */
casper.options.timeout = 60000;
casper.on('timeout', function() {
    casper.test.fail('Test ran into Overall timeout');
});
casper.options.waitTimeout = 10000;
casper.on('waitFor.timeout', function() {
    casper.test.fail('Test ran into WaitFor timeout');
});

/*
 * HTTP status callbacks
 */
casper.on("http.status.404", function(resource) {
    casper.test.fail('HTTP Error 404');
});
casper.on("http.status.500", function(resource) {
    casper.test.fail('HTTP Error 500');
});

/*
 * Load failed
 */
casper.on("load.failed", function(resource) {
    casper.test.fail('Page loading failed');
});
casper.on("error", function(msg, trace) {
    casper.test.fail('Test failed with error' + msg);
});

/*
 * Funtion for capturing page html and screenshots
 */
function hgCapture(casper, type) {
        var now = new Date().toISOString();
        // Save HTML
        var html = casper.getHTML();
        fs.write(resultpath + '/html_' + type + '_' + now + '.html', html, 'w');
        // Take screenshots
        casper.capture(resultpath + '/screenshot_' + type + '_' + now + '.png');
    }
    /*
     * Funtion for getting har archive files
     */
function hgHar(casper) {
    // Save HAR
    var now = new Date().toISOString();
    casper.endTime = new Date();
    var content = JSON.stringify(createHar(pg.address, 'HolyGhost', pg.startTime, pg.resources), undefined, 3);
    fs.write(resultpath + '/har.har', content, 'w');
}

/*
 * HAR creation
 */
function createHar(address, title, startTime, resources) {
    var entries = [];
    var now = new Date().toISOString();

    resources.forEach(function(resource) {
        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;

        if (!request || !startReply || !endReply) {
            return;
        }

        // Exclude Data URIs from HAR file because
        // they aren't included in specification
        if (request.url.match(/(^data:(image|font|application)\/.*)/i)) {
            return;
        }

        if (typeof request.time === 'string') {
            request.time = new Date(request.time);
        }

        entries.push({
            cache: {},
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
                bodySize: -1,
            },
            response: {
                status: endReply.status,
                statusText: endReply.statusText,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: endReply.headers,
                headersSize: -1,
                redirectURL: "",
                bodySize: startReply.bodySize,
                content: {
                    mimeType: endReply.contentType,
                    size: startReply.bodySize,
                }
            },
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

    // TODO make sure phantom.X is set
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
                    //onLoad: casper.endTime - casper.startTime
                    onLoad: casper.endTime - casper.startTime
                }
            }],
            entries: entries
        }
    };
};

casper.on('resource.requested', function(req, request) {
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
    pg.endTime = new Date();
});

/*
 * Actions on step completion
 */
casper.on('step.complete', function(step) {
    if (utils.isTruthy(this.getCurrentUrl())) {
        pg.address = this.getCurrentUrl();
    }
    if (casper.cli.get("hgDebug")) {
        hgCapture(casper, "debug");
    }
});
/*
 * Actions on test suite completion
 */
casper.test.on("exit", function() {
    hgHar(casper);
})

/*
 * Finalizing this "test"
 */
casper.test.done();
