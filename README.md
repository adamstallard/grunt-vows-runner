##grunt-vows-runner

A test-runner for vows using grunt.

###Philosophy

File and directory matching, file watching, coverage reporting, etc. should be supplied by third-party tools where possible.
Grunt is a great source of such third-party-tools.  These are much more likely to continue development than the equivalent
tools built into vows, since they are used by many other packages as well.

###Additions

* Uses grunt [tasks](https://github.com/gruntjs/grunt/wiki/Configuring-tasks) and [templates]
(https://github.com/gruntjs/grunt/wiki/Configuring-tasks#wiki-templates)
* Runs suites in the same task concurrently
* Sets options at the task level

###Differences from the vows command-line runner

* Uses grunt to specify which [files](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#wiki-files) to run
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

``vows`` is a [multitask](https://github.com/gruntjs/grunt/wiki/Creating-tasks#wiki-multitasks).

Each target references one or more source files containing suites and may contain options which will be applied to all of those
suites.

An example ``vows`` configuration with two targets:

    ...
    vows : {
      all : {
        src : "<%= allTests %>",
        options : {
          runner : "spec"
        }
      },
      allXunit : {
        src : "<%= allTests %>",
        dest : "testResults.xml"
        options : {
          runner : "xunit"
        }
      }
    },
    allTests : "tests/*"
    ...

The example above uses the [_compact format_ for specifying files](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#wiki-files)
as well as [templates](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#wiki-templates).

One destination file (``dest``) can be specified per target.  It will contain the output of all the suites in the target.  If no
destination file is specified, the output will go to the console.

Results are summed by target.  Grunt-vows-runner doesn't combine the results of multiple targets.

Suites within a target are run concurrently; faster suites will finish first.  Targets in grunt are always run sequentially.

####Options

Options can be placed at the task (``vows``), target, or suite level.

Here is an example of each:

_Gruntfile.js_ (task- and target-level options)

    ...
    vows : {
      options : {
        runner : "spec"
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

#####All Levels

* ``error``
 * _description_
* ``reporter``
 * _description_
* ``matcher``
 * _description_

#####Task (``vows``) Level Only

* ``nocolor``
 * _description_
* ``isolate``
 * _description_

###Alternatives

If you would like a grunt plugin that simply forwards options to the vows command-line runner,
see [grunt-vows](https://github.com/CMTegner/grunt-vows).

