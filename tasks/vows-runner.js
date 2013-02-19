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
    if(options.disable){
      grunt.log.ok(targetName + ' tests disabled');
      done();
      return;
    }

    if (files.length) {
      var outputFile = this.files[0].dest;

      grunt.verbose.subhead(targetName + ' options').writeflags(options);
      grunt.verbose.oklns(targetName + ' running tests: ' + files);
      if (outputFile) {
        grunt.verbose.writeln(targetName + ' deleting output file');
        try {
          fs.unlinkSync(outputFile);
        } catch(e) {}
        grunt.verbose.writeln(targetName + ' writing output to "' + outputFile + '"');
      }
      else {
        grunt.log.subhead(targetName + ' test output');
      }

      var _ = grunt.util._;
      var async = grunt.util.async;

      var suiteTasks = {};

      _.forEach(files, function(filename){
        var fullFilename = '../' + filename;
        delete require.cache[require.resolve(fullFilename)];
        var file = require(fullFilename);
        _.forEach(file, function(suite){
          suite._filename = filename;
          var suiteRunner = new SuiteRunner(suite, options);
          suiteTasks[suite.subject] = function(callback){
            suiteRunner.run(function(error, result, output){
              if(outputFile){
                fs.appendFileSync(outputFile, output);
              }
              else{
                grunt.log.oklns(output);
              }
              callback(error, result);
            });
          }
        });
      });

      vows.suites = [];

      async.parallel(suiteTasks, function(error, results){
        var endReporter;

        totals = _.reduce(results, function(subTotals, result){
          return _.reduce(result, function(x, total, header){
            x[header] = total + subTotals[header];
            return x;
          }, {});
        });

        endReporter = new SuiteRunner(vows.describe('End Totals'), options);
        endReporter.reportTotals(totals);
        grunt.log.oklns(endReporter.getOutput());

        done();
      });
    }
    else {
      grunt.log.error(targetName + ' no test files');
      done();
    }
  });
};



