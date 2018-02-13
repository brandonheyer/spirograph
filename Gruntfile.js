module.exports = function (grunt) {
  var config = {
    browserify: {
      dist: {
        src: [
          './src/**/*.js'
        ],
        dest: './dist/js/main.js',
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            [
              'babelify',
              {
                'presets': [
                  'env'
                ]
              }
            ]
          ]
        }
      }
    },

    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/styles.css': 'src/scss/main.scss'
            }
        }
    },

    watch: {
      dist: {
        files: ['src/**/*.js'],
        tasks: ['browserify:dist'],
      },

      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      }
    }
  };

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.initConfig(config);

  grunt.registerTask('default', ['browserify', 'sass']);
  grunt.registerTask('w', ['browserify', 'watch']);
};
