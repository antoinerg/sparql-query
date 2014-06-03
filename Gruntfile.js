module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buildDir: 'dist',
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: '<%= buildDir %>/<%= pkg.name %>.min.js'
      }
    },
    handlebars: {
      all: {
          options: {
            namespace: "sparql"
          },
          files: {
              "dist/templates.js": ["src/templates/*.handlebars"]
          },
          processName: function(filePath) { // input:  templates/_header.hbs
              var pieces = filePath.split("/");
              return pieces[pieces.length - 1]; // output: _header.hbs
          }
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          keepalive:true,
          base: '.'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'handlebars']);

};