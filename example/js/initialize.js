require(['../../src/js/gui'], function (UploadGUI) {
  var uploadOpts = {
    inputId: 'file',
    uploadButton: '#upload-btn',
    previewContainerSelector: '#preview',
    sendPath: 'http://localhost:4000/upload',
  };

  var uploadGUI = new UploadGUI(uploadOpts);
});
