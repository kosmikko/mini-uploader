define([
  'upload',
], function(Upload) {
  "use strict";

  var input = document.getElementById('file');

  describe('Test Upload', function() {
    var upload;

    beforeEach(function() {
      var uploadOpts = {
        sendPath: '/upload',
        headers: {'Authorization': 'foo-auth'},
      };
      upload = new Upload(uploadOpts);
    });

    it('should trigger an event', function(done){
      upload.on('error', done);
      upload.onerror();
    });

    it('should err', function() {
      function checkError() {console.log('err');}
      upload.on('error', checkError);
      upload.sendFile(input.files[0]);
    });

    it('should update progress', function(done) {
      done();
    });


  });

});