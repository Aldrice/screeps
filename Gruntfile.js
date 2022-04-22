module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'd739429337@hotmail.com',
                token: '4b7347bb-09eb-4ad0-ac34-23a1cde8e8f1',
                branch: 'default',
                // server: 'season'
            },
            dist: {
                src: ['src/*.js'],
            }
        }
    });
}