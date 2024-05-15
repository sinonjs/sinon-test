
3.1.6 / 2024-05-15
==================

  * fix: handle breaking changes in Sinon 17.0.2

3.1.5 / 2023-01-16
==================

  * Just require Sinon v2 or greater

3.1.4 / 2022-08-05
==================

  * Required upgrades (#195)
  * Update to Sinon 14
  * Bump ansi-regex from 3.0.0 to 3.0.1
  * Bump shell-quote from 1.7.2 to 1.7.3
  * Bump semver-regex from 3.1.3 to 3.1.4
  * chore: Set permissions for GitHub actions

3.1.3 / 2022-02-18
==================

  * Add support for Sinon 13

3.1.2 / 2022-01-20
==================

  * Update lock file version for NPM >= 7
  * Update integration test script
  * feat: add support to sinon 12 (#187)
  * Bump semver-regex from 3.1.2 to 3.1.3

3.1.1 / 2021-08-16
==================

  * Update peer dependency to Sinon 11 (fixes #185)
  * [Security] Bump acorn from 7.1.0 to 7.1.1 (#166)
  * Remove CircleCI config
  * Configure CI using GitHub Actions
  * Bump path-parse from 1.0.6 to 1.0.7
  * Bump glob-parent from 5.1.0 to 5.1.2
  * Bump hosted-git-info from 2.6.0 to 2.8.9
  * Bump lodash from 4.17.19 to 4.17.21

3.1.0 / 2021-04-22
==================

  * Allow sinon 10.x.

3.0.1 / 2021-04-08
==================

  * Bump y18n from 4.0.0 to 4.0.1

3.0.0 / 2020-02-22
==================

  * Drop Node 8

2.4.3 / 2020-02-22
==================

  * Upgrade sinon peerDependency to allow 9.x

2.4.2 / 2020-01-28
==================

  * Adjust for @sinonjs/referee@4 breaking changes
  * Upgrade sinon peerDependency to allow 8.x
  * Remove configureTest

2.4.1 / 2019-12-03
==================

  * Reintroduce injectIntoThis in local config (#135) making it work with Sinon 7.3+

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
