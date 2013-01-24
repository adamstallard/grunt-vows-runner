var vows = require('vows');
var util = require('util');

module.exports = function(grunt){

  var testFiles = [];

  grunt.registerMultiTask('vows', 'Runs vows tests.', function(){

    var files = this.data.files;
    if(grunt.utils._.isString(files))
      files = [files];
    else
      files = grunt.utils._.flatten(files);
    grunt.utils._.each(files, function(filePattern){
      testFiles = testFiles.concat(grunt.file.expandFiles(filePattern));
    });

    grunt.verbose.writeln("Running vows tests in: " + testFiles);

    testFiles.forEach(function(file){
      var x = require('../' + file);
      console.dir(x);
    })
  });
};
