
2.4.0 / 2018-10-19
==================

  * Update sinon peerDependency to allow 6.x

2.3.0 / 2018-09-06
==================

  * ES6 module export (#93)
  * Add `browser` and `module` properties for bundling discoverability

2.2.1 / 2018-07-24
==================

  * Upgrade sinon peerDependency to allow 6.x

2.2.0 / 2018-05-28
==================

  * Fix promises not passed to unit test framework if test function has parameters Issue 90

2.1.4 / 2018-05-25
==================

  * Update all dependencies
  * Support Sinon 5

2.1.3 / 2018-01-29
==================

  * Add files section to package.json to prevent unnecesary bloat of package (#87)

2.1.2 / 2017-11-03
==================

  * Adds a new RELEASE doc to avoid embarassing mistakes
  * Run tests against Sinon 4

2.1.1 / 2017-09-18
==================
Fix problems with async tests and promises (#75)

2.1.0 / 2017-08-07
==================
Fix compatibility with Sinon 3 (#77)


2.0.0 / 2017-06-22
==================

  * Simplify configuration API (#74)

1.0.0 / 2017-01-02
==================

  * Update README with info on browser build
  * Merge pull request #32 from cbaclig/rm-get-config-dep-warning
  * Removing dependency on deprecated sinon.getConfig() method
  * Merge pull request #30 from fearphage/add-browser-builds
  * fix precommit hook to not run for 0 files
  * added nyc for coverage tracking
  * updated tests to work with mocha.js
  * added utility to identify thenables (aka promises)
  * added additional tests
  * Merge pull request #19 from fearphage/death-to-busterjs
  * Makes doc link more specific; add info vs sinon.test configuration.
  * Merge pull request #14 from RobertWHurst/fix/#6
  * Return promise in promise related tests
  * Bundle latest version of phantomjs for the test server.
  * fix #6 add support for promises
  * Fix #9 port throw caught exceptions from async tests from v1.17
  * Fix #8 make sure nextTick is available in test/test-test.js

0.0.1 / 2016-01-31
==================

First standalone version of `sinon-test`
