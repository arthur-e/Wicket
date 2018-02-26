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
        frameworks: ['jasmine'],
        reporters: ['mocha'],
        files: [
            'https://maps.googleapis.com/maps/api/js?v=3.31&libraries=geometry',
            'wicket.js',
            'wicket-gmap3.js',
            'tests/wicket-gmap3-spec.js'
        ]
    });
};