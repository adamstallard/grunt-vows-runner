'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all : {
        src : [
          "**/*.js",
          "!node_modules/**/*.js"
        ]
      },
      options: {
        jshintrc : ".jshintrc"
      }
    },
    vows: {
      options : {
        reporter : "spec"
      },
      all : {
        src : ['test/**/*.js']
      },
      xunit : {
        src : ['test/**/*.js'],
        dest : 'out.xml',
        options : {
          reporter : "Xunit",
          disabled : false
        }
      },
      json : {
        src : ['test/**/*.js'],
        dest : 'out.json',
        options : {
          reporter : "json",
          disabled : false
        }
      },
      vows : {
        src : [
          'node_modules/vows/test/*.js',
          '!node_modules/vows/test/isolate-test.js',
          '!node_modules/vows/test/supress-stdout-test.js'
        ],
        options : {
          disabled : false
        }
      }
    }
  });

  // Load local tasks
  grunt.loadTasks('tasks');

  // Load Npm tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task
  grunt.registerTask('default', ['jshint', 'vows']);

};