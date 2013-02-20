##grunt-vows-runner

A test-runner for vows using [grunt](http://gruntjs.com/).

###Philosophy

File and directory matching, file watching, coverage reporting, etc. should be supplied by third-party tools where possible.
Grunt is a great source of such third-party-tools.  These are much more likely to continue development than the equivalent
tools built into vows, since they are used by many other packages as well.

###Additions

With grunt-vows-runner you can

* Use grunt [tasks](http://gruntjs.com/configuring-tasks) and [templates](http://gruntjs.com/configuring-tasks#templates).
* Run suites in the same [target](http://gruntjs.com/configuring-tasks#task-configuration-and-targets)
concurrently.
* Set options at the target level.
* Set the ``isolate`` option at the suite and target level, and run isolated and non-isolated suites concurrently.
* Disable groups of tests at the target level

###Differences from the vows command-line runner

* Uses grunt to specify which [files](http://gruntjs.com/configuring-tasks#files) to run
* Uses grunt's ``watch`` task instead of vows' built-in watch implementation
* No shuffle option (if you want this, let me know--it is easy to implement)
* No built-in js-coverage support
 * I highly recommend [istanbul](https://github.com/yahoo/istanbul), which does not need the cooperation of the test-runner
 (simply ``istanbul cover bin/vows`` will work ); and it is written in javascript, not java

###Installation

1. Change directories to the root directory of your project
2. ``npm install grunt-vows-runner``

###Usage

Add the following line to your ``Gruntfile.js``

    grunt.loadNpmTasks('grunt-vows-runner');

The ``vows`` task is now available; for example

    grunt vows

###Configuration

Configuration is placed in the ``grunt.initConfig`` section of your ``Gruntfile.js`` file in the ``vows`` object.

``vows`` is a [multitask](http://gruntjs.com/creating-tasks#multi-tasks).

Each target references one or more source files containing suites and may contain options which will be applied to all of those
suites.

An example ``vows`` configuration with two targets:

    ...
    vows : {
      all : {
        src : "<%= allTests %>",
        options : {
          reporter : "spec"
        }
      },
      allXunit : {
        src : "<%= allTests %>",
        dest : "testResults.xml"
        options : {
          reporter : "xunit"
        }
      }
    },
    allTests : "tests/*"
    ...

The example above uses the [_compact format_ for specifying files](http://gruntjs.com/configuring-tasks#compact-format)
as well as [templates](http://gruntjs.com/configuring-tasks#templates).

One destination file (``dest``) can be specified per target.  It will contain the output of all the suites in the target.  If no
destination file is specified, the output will go to the console.

Paths for both source and destination files are relative to the directory that the ``Gruntfile.js`` is in.

Results are summed by target.  Grunt-vows-runner doesn't combine the results of multiple targets.

Suites within a target are run concurrently; faster suites will finish first.  Targets in grunt are always run sequentially.

####Options

Options can be placed at the task (``vows``), target, or suite level.

Here is an example of each:

_Gruntfile.js_ (task- and target-level options)

    ...
    vows : {
      options : {
        reporter : "spec"
      },
      most : {
        src : ["test/*", "!test/chattyTests.js"]
      },
      chatty : {
        src : "test/chattyTests.js",
        options : {
          reporter : "silent"
        }
      }
    }
    ...

_test/errorTests.js_ (suite-level options)

    ...
    vows.describe('Error Handling').addBatch({
    ...
    }).export(module, {error : false});
    ...

The following options are available:

* ``error``
 * Whether or not vows should handle errors in topics for you.  Set ``error : false`` if you want to handle your own errors.
 The first argument to your vows will be reserved for errors.
* ``reporter``
 * silent, spec, json, tap, xunit, dot-matrix.  (Look in [vows/lib/vows/reporters](https://github.com/cloudhead/vows/tree/master/lib/vows/reporters)
  for a complete list.)
* ``matcher``
 * a javascript [RegExp object](http://www.w3schools.com/jsref/jsref_obj_regexp.asp); only run tests whose titles match this
 object.
* ``isolate``
 * Run each suite in its own process.  This is useful if the system-under-test uses the node process object internally.
* ``disabled``
 * Temporarily disable tests for a target.

###Alternatives

If you would like a grunt plugin that simply forwards options to the existing vows command-line runner,
see [grunt-vows](https://github.com/CMTegner/grunt-vows).

