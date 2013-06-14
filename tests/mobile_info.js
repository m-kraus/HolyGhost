/*
 * Configuration settings
 */
testConfig = {
    resultPath : '/tmp/results',
    testName : 'mobile_info',
    errorLevel : 2,
	har:  true,
    casper : {
        logLevel: "error",
        verbose: true,
        stepTimeout: 5000,
        timeout: 10000
            }
    };

casper.thenOpen('https://boerse.dab-bank.de/m/factsheet/key_8259995,9284044,.html', function() {
    stepName = 'open mobile dax info';
    this.test.assert(this.getTitle() === 'DAB Bank: DAX 8:00-20:00', 'Verify title is "DAB Bank: DAX 8:00-20:00"');
});
