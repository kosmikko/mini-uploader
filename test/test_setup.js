requirejs.config({
  baseUrl: '../src/js/'
});

mocha.setup({ ui: 'bdd', ignoreLeaks: true });
window.expect = SinonExpect.enhance(expect, sinon, 'was');
window.onload = function() {
  var specs = [
    'js/example.test.js',
  ];

  require(specs, function () {
    var runner;
    if (window.mochaPhantomJS) {
      runner = mochaPhantomJS.run();
    } else {
      runner = mocha.run();
      runner.globals(['jQuery*']);
    }

  });
};