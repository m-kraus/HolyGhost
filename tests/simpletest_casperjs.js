//casper.options.viewportSize = {width: 1600, height: 600};
//casper.options.stepTimeout = 20000;
//casper.options.waitTimeout = 10000;
//casper.options.timeout = 60000;

casper.test.begin('CRITICAL::CASE-NOFAIL::Description of my test', 2, function suite(test) {
	casper.start('http://www.google.de/', function() {
		test.assertTitle('Google', 'STEP1::Verify title is "Google"');
		this.fill('form[action="/search"]', { q: 'cheeseeee' }, true);
	});
	
	casper.then(function() {
		test.assertMatch(this.getTitle(), /cheeseeee/i, 'STEP2::Verify title contains "cheeseeee"');
	});
	casper.userAgent('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; en-GB)');
	casper.run(function() {
		test.done();
	});
});
