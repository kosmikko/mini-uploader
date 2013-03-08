// Configure the AMD module loader
requirejs.config({
  // The path where your JavaScripts are located.
  baseUrl: '../src/js/',

  // Specify the paths of vendor libraries
  paths: {
    jquery: '../../example/js/vendor/jquery-1.8.3',
    underscore: '../../example/js/vendor/underscore-1.4.3',
    backbone: '../../example/js/vendor/backbone'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },

  // cache break
  // Of course, this should be removed in a production environment
  urlArgs: 'bust=' +  (new Date()).getTime()
});