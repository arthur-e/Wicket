module.exports = function (config) {
  config.set({
    basePath: '',
    port: 9877,
    colors: true,
    logLevel: 'INFO',
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['jasmine'],
    reporters: ['mocha'],
    files: [
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry',
      'wicket.js',
      'wicket-gmap3.js',
      'tests/wicket-gmap3-spec.js'
    ]
  });
};
