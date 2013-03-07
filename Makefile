MOCHA-PHANTOMJS=node_modules/.bin/mocha-phantomjs

test:
	@$(MOCHA-PHANTOMJS) test/index.html spec

testserver:
	@node test/testserver

.PHONY: test
