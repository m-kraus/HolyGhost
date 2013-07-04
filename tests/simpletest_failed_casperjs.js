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
        stepTimeout: 1000,
        timeout: 5000
            }
    };

/*
 * step1
 */
casper.thenOpen('http://www.google.de/', function() {
    stepName = 'open google';
    this.test.assert(this.getTitle() === 'Google', 'Verify title is "Google"');
    this.fill('form[action="/search"]', { q: 'cheeseeee' }, true);
});

/*
 * step2
 */
casper.then(function() {
    stepName = 'find_cheese';
    this.test.assertMatch(this.getTitle(), /xheeseeee/i, 'Verify title contains "cheeseeee"');
});
