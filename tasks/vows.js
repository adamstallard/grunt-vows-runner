var fs = require('fs');
var SuiteRunner = require('./lib/SuiteRunner');
var vowsConsole = require('vows/lib/vows/console');
var vows = require('vows');

module.exports = function(grunt){

  vowsConsole.nocolor = grunt.option('no-color');

  grunt.registerMultiTask('vows', 'Runs vows tests.', function(){
    var files = this.files[0].src;
    var targetName = this.name + ':' + this.target;
    var done = this.async();
    var options = this.options();
    if(options.disabled){
      grunt.log.ok(targetName + ' tests disabled');
      done();
      return;
    }
    grunt.verbose.subhead(targetName + ' options').writeflags(options);

    if (files.length) {
      var outputFile = this.files[0].dest;
      if (outputFile) {
        grunt.verbose.writeln(targetName + ' deleting output file');
        try {
          fs.unlinkSync(outputFile);
        } catch(e) {}
        grunt.verbose.writeln(targetName + ' writing output to "' + outputFile + '"');
      }

      var _ = grunt.util._;
      var async = grunt.util.async;
      var suiteTasks = {};

      // don't show the totals until all the suites in the task are done

      options.writeTotals = false;

      _.forEach(files, function(filename){
        var fullFilename = process.cwd() + '/' + filename;

        // Require the suites in the file, but don't cache them.  This way we can run them multiple times with different options.

        delete require.cache[require.resolve(fullFilename)];
        var file = require(fullFilename);

        _.forEach(file, function(suite){
          suite._filename = filename;
          grunt.verbose.writeln(targetName + ' starting "' + suite.subject + '"');
          var suiteRunner = new SuiteRunner(suite, options);
          suiteTasks[suite.subject] = function(callback){
            suiteRunner.run(function(error, result, output){
              writeOutput(output);
              callback(error, result);
            });
          }
        });
      });

      async.parallel(suiteTasks, function(error, results){

        // report the totals and tell grunt we are done

        var totals = _.reduce(results, function(subTotals, result){
          return _.reduce(result, function(x, total, header){
            x[header] = total + subTotals[header];
            return x;
          }, {});
        });
        options.writeTotals = true;
        var endReporter = new SuiteRunner(vows.describe('Totals'), options);
        endReporter.reportTotals(totals);
        writeOutput(endReporter.getOutput());
        grunt.log.ok(targetName + " done");
        grunt.verbose.writeflags(totals);
        if(totals.errored || totals.broken){
          done(false);
        }
        else{
          done();
        }
      });

      // helper function to write output to console or a file

      function writeOutput(output){
        if(outputFile){
          fs.appendFileSync(outputFile, output);
        }
        else{
          grunt.log.oklns(output);
        }
      }

      // TODO: remove this when we are using vows-core

      vows.suites = []; // so it doesn't try to do anything on process.exit (see "vows.js")
    }
    else {
      grunt.log.error(targetName + ' no test files');
      done();
    }
  });
};



