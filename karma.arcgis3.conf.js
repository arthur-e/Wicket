// For more details see: https://github.com/tomwayson/esri-karma-tutorial
module.exports = function(config) {
    config.set({
        basePath: '',
        port: 9877,
        colors: true,
        logLevel: 'INFO',
        autoWatch: false,
        browsers: ['PhantomJS'],
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
            exitOnResourceError: false,
            flags: [
                '--web-security=false',
                '--load-images=false',
                '--ignore-ssl-errors=true'
            ]
        },
        singleRun: true,
        frameworks: ['jasmine','dojo'],
        reporters: ['mocha'],
        files: [
           'tests/config-arcgis3.js',
           {pattern: 'wicket.js', included: false},
           {pattern: 'wicket-arcgis-amd.js', included: false},
           {pattern: 'tests/wicket-arcgis3-amd-spec.js', included: false}
        ],
       
    });
};