require(['uploader/upload'], function (Upload) {
  var uploadOpts = {
    sendPath: '/upload',
  };
  var upload = new Upload(uploadOpts);
});
