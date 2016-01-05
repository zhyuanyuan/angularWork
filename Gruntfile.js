module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/!*! <%= pkg.file %><%= grunt.template.today("yyyy-mm-dd") %> *!/\n'
            },
            buildall: {
                options: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    },
                    report: "gzip" //输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files:{
                    "App/app_min/app.common.min.js":["App/app_min/app.common.js"]
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./App/scripts",
                    mainConfigFile: "./App/scripts/app.js",
                    optimize: "none",
                    generateSourceMaps: false, //生成map文件
                    preserveLicenseComments: false, //要license
                    useSourceUrl: false,
                    name: "app",
                    out: "App/app_min/app.common.js"
                }
            }
        },
        watch: {
            scripts: {
                files: ['App/scripts/**/*.js'],
                tasks: ['minall'],
                options: {
                    spawn: true,
                    interrupt: true
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-watch');

    // 默认被执行的任务列表。
    //grunt.registerTask('minall', ['uglify:buildall']);
    grunt.registerTask('default', ['requirejs']);
};