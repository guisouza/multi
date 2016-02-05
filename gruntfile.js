module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

      concat: {
        Abstraction: {
          src: [
            'Abstraction/applicationFramework/*',
            'Abstraction/commom/*',
            'Abstraction/platformFramework/*',
          ],
          dest: 'Abstraction/fw.js'
        },
        Implementation: {
          src: [
            'Implementation/Applications/**/*.js',
            'Implementation/Modules/**/*.js',
            'Implementation/Platform/**/*.js',
          ],
          dest: 'Implementation/app.js'
        }
      },

      babel: {
          options: {
              sourceMap: true,
              presets: ['es2015']
          },
          Abstraction: {
              files: {
                  'Abstraction/fw.dist.js': 'Abstraction/fw.js'
              }
          },
          Implementation: {
              files: {
                  'Implementation/app.dist.js': 'Implementation/app.js'
              }
          },
          Worker: {
              files: {
                  'worker.js': '_worker.js'
              }
          }
      },

      watch: {
        scripts: {
          files: ['Abstraction/**/*.js','Implementation/**/*.js','_worker.js'],
          tasks: ['concat:Abstraction','babel:Abstraction','concat:Implementation','babel:Implementation','babel:Worker'],
          options: {
            spawn: false,
          }
        }

      }


  });


  grunt.registerTask('default', ['concat:Abstraction','babel:Abstraction','concat:Implementation','babel:Implementation','babel:Worker','watch']);
}
