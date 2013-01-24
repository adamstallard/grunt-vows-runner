##grunt-vows-runner

An alternative test-runner for vows using grunt.

###Philosophy

A test-runner shouldn't do anything other than run tests and generate a report.  File/dir matching, file watching,
coverage reporting, etc. should all be supplied by third-party tools.

Grunt is a great source of such third-party-tools.  These are much more likely to continue development than the equivalent
tools built into vows, since they are used by many other packages as well.

Thus grunt-vows-runner is a replacement for the vows command-line runner.

###Differences from the vows command-line runner

* Uses grunt's [task configuration for specifying files](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#Files)
* No "watch" mode
 * use the grunt "watch" task
* No shuffle option (if you want this, let me know--it is easy to implement)
* No js-coverage support
 * I highly recommend [istanbul](https://github.com/yahoo/istanbul), which does not need the cooperation of the test-runner
 (simply ``istanbul cover bin/vows`` will work ) and is written in javascript, not java

###Additions

* The ability to run suites in parallel

####Alternatives

If you would like a grunt plugin that simply forwards options to the vows command-line runner,
see [grunt-vows](https://github.com/CMTegner/grunt-vows).
