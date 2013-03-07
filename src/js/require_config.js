// Configure the AMD module loader
requirejs.config({
  // The path where your JavaScripts are located.
  baseUrl: '/js/',

  // Specify the paths of vendor libraries
  paths: {
    jquery: 'vendor/jquery-1.8.3',
    underscore: 'vendor/underscore-1.4.3'
  },

  shim: {
    underscore: {
      exports: '_'
    }
  },

  // cache break
  // Of course, this should be removed in a production environment
  urlArgs: 'bust=' +  (new Date()).getTime()
});