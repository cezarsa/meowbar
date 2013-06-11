module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: {
          'dist/meow-bar.basic.min.js': ['meow-bar.js', 'meow-bar-basic-connector.js'],
          'dist/meow-bar.jquery.min.js': ['meow-bar.js', 'meow-bar-jquery-connector.js']
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/meow-bar.min.css': ['meow-bar.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['uglify', 'cssmin']);

};
