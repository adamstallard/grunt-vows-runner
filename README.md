##grunt-vows-runner

An alternative test-runner for vows using grunt.

###Philosophy

File/dir matching, file watching, coverage reporting, etc. should all be supplied by third-party tools where possible.

Grunt is a great source of such third-party-tools.  These are much more likely to continue development than the equivalent
tools built into vows, since they are used by many other packages as well.

Thus grunt-vows-runner is a replacement for the vows command-line runner.

###Additions

* Uses grunt [tasks](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) and [templates]
(https://github.com/gruntjs/grunt/wiki/Configuring-tasks#Templates)
* Runs suites in the same task concurrently
* Sets options at the task level

###Differences from the vows command-line runner

* Uses grunt to specify which [files](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#Files) to run
* Uses grunt's ``watch`` task instead of vows' built-in watch implementation
* No shuffle option (if you want this, let me know--it is easy to implement)
* No built-in js-coverage support
 * I highly recommend [istanbul](https://github.com/yahoo/istanbul), which does not need the cooperation of the test-runner
 (simply ``istanbul cover bin/vows`` will work ); and it is written in javascript, not java

###Alternatives

If you would like a grunt plugin that simply forwards options to the vows command-line runner,
see [grunt-vows](https://github.com/CMTegner/grunt-vows).

