MOCHA-PHANTOMJS=node_modules/.bin/mocha-phantomjs

test:
	@$(MOCHA-PHANTOMJS) test/index.html spec
.PHONY: test
