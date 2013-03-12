/**
  GUI wiring
**/

define([
  'underscore',
  'jquery',
  './upload',
  './s3_upload',
  './imageprocessor',
  './emitter'
], function(_, $, Upload, S3Upload, ImageProcessor, Emitter) {
  'use strict';

  var UploadGUI = function(options) {this.initialize(options)};
  // mixin emitter
  _.extend(UploadGUI.prototype, Emitter.prototype);

  UploadGUI.prototype.defaultOptions = {
    messages: {
      success: 'Uploaded successfully.'
    },
    progressSelector: '.progress',
    progressBarSelector: '.progress .bar',
    progressStatusSelector: '.progress-status',
    createImageThumbnails: true,
    method: 'POST',
    s3SignUrl: '/signurl',
    useS3: true
  };

  UploadGUI.prototype.initialize = function(options) {
    this.options = _.extend(this.defaultOptions, options);
    this.input = document.getElementById(options.inputId);
    this.fileInput = $('#' + options.inputId);
    this.uploadBtn = $(options.uploadButton);

    if(!this.input || !this.uploadBtn.length) {
      throw new Error('Input not found');
    }
    this.previewContainer = $(options.previewContainerSelector);
    this.progressBar = this.previewContainer.find(this.options.progressBarSelector);
    this.progressContainer = this.previewContainer.find(this.options.progressSelector);

    this.uploadOptions = {
      sendPath: this.options.sendPath,
      method: this.options.method,
      s3SignUrl: this.options.s3SignUrl
    };

    this._setupEvents();
  };

  UploadGUI.prototype._setupEvents = function() {
    var self = this;
    this.input.addEventListener('change', function() {
      var file = self.input.files[0];
      self._createThumbnail(file);

      var upload,
          uploadFn;

      if(self.options.useS3) {
        upload = new S3Upload(self.uploadOptions);
        uploadFn = _.bind(upload.uploadToS3, upload);
      } else {
        upload = new Upload(self.uploadOptions);
        uploadFn = _.bind(upload.sendFile, upload)
      }

      uploadFn(file, function(err, res) {
        if(err) {
          return self._setStatusText(err.message);
        }
        self.progressContainer.hide();
        var fileURI = res.fileURI;
        return self._setStatusText(self.options.messages.success + ':' + fileURI);
      });
      self.previewContainer.show('slow');

      upload.on('progress', _.bind(self._updateProgress, self));
      self.on('thumbnail', _.bind(self._showThumbnail, self));
    });

    this.uploadBtn.on('click', function(e) {
      e.preventDefault();
      self.fileInput.click();
    });
  };

  UploadGUI.prototype._createThumbnail = function(file) {
    var self = this;
    if (this.options.createImageThumbnails && file.type.match(/image.*/)) {
      ImageProcessor.createThumbnail(file, function(thumb) {
        self.trigger('thumbnail', thumb);
      }, {thumbnailWidth: 200, thumbnailHeight: 200});
    }
  };

  UploadGUI.prototype._showThumbnail = function(thumb) {
    var img = this.previewContainer.find('img');
    img.attr('src', thumb);
  };

  UploadGUI.prototype._updateProgress = function(e) {
    this.progressBar.css({width: e.percent + "%"}).show();
    this._setStatusText(e.percent + "%");
  };

  UploadGUI.prototype._setStatusText = function(text) {
    var progressStatus = this.previewContainer.find(this.options.progressStatusSelector);
    progressStatus.html(text);
  };

  return UploadGUI;
});