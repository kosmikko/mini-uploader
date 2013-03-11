MOCHA-PHANTOMJS=node_modules/.bin/mocha-phantomjs

test:
	@$(MOCHA-PHANTOMJS) test/index.html spec

example:
	@node example/app

.PHONY: test example
