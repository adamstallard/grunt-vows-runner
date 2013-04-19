'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly:   false,
        immed:   true,
        latedef: true,
        newcap:  true,
        noarg:   true,
        sub:     true,
        undef:   true,
        node:    true,
        es5:     true,
        strict:  true,
        camelcase: true,
        nonew:  true,
        unused: true,
        trailing: true
      },
      globals: {}
    },
    vows: {
      options : {
        reporter : "spec"
      },
      all : {
        src : ['test/*.js']
      },
      xunit : {
        src : ['test/*.js'],
        dest : 'out.xml',
        options : {
          reporter : "Xunit",
          disabled : false
        }
      },
      json : {
        src : ['test/*.js'],
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

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'vows');

};