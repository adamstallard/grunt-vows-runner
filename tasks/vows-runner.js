var runner = require('./lib/vows-runner');

module.exports = function(grunt){

  grunt.registerMultiTask('vows', 'Runs vows tests.', function(){

    var done = this.async();

    if (this.filesSrc.length) {
      grunt.log.oklns('vows: running tests: ' + this.filesSrc);
      runner.run(this.filesSrc, done);
    }
    else {
      grunt.log.error('vows: no test files');
      done();
    }

//    testFiles.forEach(function(file){
//      var x = require('../' + file);
//      console.dir(x.true);
//    });

  });
};



