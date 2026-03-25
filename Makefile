.PHONY: install test lint test-coverage check

install:
	npm install

test:
	npm test

lint:
	npm run lint

test-coverage:
	npm run test-coverage

check: lint test
