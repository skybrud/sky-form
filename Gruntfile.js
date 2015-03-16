module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			toDist: {
				options: {
					preserveComments:false
				},
				files: [{
					src: [
						'*.module.js',
						'*.provider.js',
						'*.config.js',
						'*.js',
						'!Gruntfile.js'
					],
					dest: 'dist/skyform.min.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify:toDist']);
};
