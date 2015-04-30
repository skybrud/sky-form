module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		ts: {
			toTmp: {
				options:{
					sourceMap:true
				},
				out:'.tmp/skyform.js',
				files: [{
					src: [
						'definitions/**/*.d.ts',
						'skyform.d.ts',
						'skyform.module.ts',
						'*.ts'
					]
				}]

			}
		},


		uglify: {
			toDist: {
				options: {
					preserveComments:false
				},
				files: [{
					src: [
						'.tmp/skyform.js'
					],
					dest: 'dist/skyform.min.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['ts:toTmp','uglify:toDist']);
};
