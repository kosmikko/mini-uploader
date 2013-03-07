require(['../../src/js/upload'], function (Upload) {
  var uploadOpts = {
    sendPath: 'http://localhost:4000/upload',
  };

  var input = document.getElementById('file');
  input.addEventListener('change', function() {
    var file = input.files[0];
    var upload = new Upload(uploadOpts);

    upload.sendFile(file, function(err, res) {
      console.log(err, res);
    });

    upload.on('progress', function(e) {
      console.log(e);
    });

  });
});
