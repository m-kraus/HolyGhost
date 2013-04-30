/*
 * Configuration settings
 */
testConfig = {
    resultPath : '/tmp/results',
    testName : 'google',
    errorLevel : 2,
	har:  true,
    casper : {
        logLevel: "error",
        verbose: false,
        stepTimeout: 10000,
        timeout: 30000
            }
    };

casper.thenOpen('http://www.google.de/', function() {
    stepName = 'open google';
    this.test.assert(this.getTitle() === 'Google', 'Verify title is "Google"');
    this.fill('form[action="/search"]', { q: 'cheeseeee' }, true);
});

casper.then(function() {
    stepName = 'find_cheese';
    this.test.assertMatch(this.getTitle(), /cheeseeee/i, 'Verify title contains "cheeseeee"');
});
