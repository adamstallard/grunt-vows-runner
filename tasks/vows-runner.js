var fs = require('fs');
var SuiteRunner = require('./lib/SuiteRunner');

module.exports = function(grunt){

  grunt.registerMultiTask('vows', 'Runs vows tests.', function(){
    var files = this.files[0].src;
    var targetName = this.name + ':' + this.target;
    var done = this.async();

    if (files.length) {
      var options = this.options();
      var outputFile = this.files[0].dest;

      grunt.verbose.subhead(targetName + ' options').writeflags(options);
      grunt.verbose.oklns(targetName + ' running tests: ' + files);
      if (outputFile) {
        grunt.verbose.writeln(targetName + ' writing output to "' + outputFile + '"');
      }
      else {
        grunt.log.subhead(targetName + ' test output');
      }

      var _ = grunt.util._;
      var async = grunt.util.async;

      var suiteTasks = {};
      var suiteRunners = [];

      _.forEach(files, function(filename){
        _.forEach(require('../' + filename), function(suite){
          suite._filename = filename;
          var suiteRunner = new SuiteRunner(suite, options);
          suiteRunners.push(suiteRunner);
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

      async.parallel(suiteTasks, function(error, result){
        console.dir(result);
        done();
        //_.forEach(suiteRunners, function(suiteRunners)
      });
    }
    else {
      grunt.log.error(targetName + ' no test files');
      done();
    }
  });
};



