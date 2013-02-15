var runner = require('./lib/vows-runner');

module.exports = function(grunt){

  grunt.registerMultiTask('vows', 'Runs vows tests.', function(){

    var done = this.async();

    if (this.filesSrc.length) {
      grunt.log.oklns('vows: running tests: ' + this.filesSrc);
      options = {
        reporter : "spec"
      };
      runner.run(this.filesSrc, options, done);
    }
    else {
      grunt.log.error('vows: no test files');
      done();
    }

  });
};



