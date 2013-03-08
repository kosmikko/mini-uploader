/**
  GUI wiring
**/

define([
  'underscore',
  'jquery',
  './upload'
], function(_, $, Upload) {
  'use strict';

  var UploadGUI = function(options) {this.initialize(options)};

  UploadGUI.prototype.initialize = function(options) {
    this.input = document.getElementById(options.inputId);
    this.fileInput = $('#' + options.inputId);
    this.uploadBtn = $(options.uploadButton);
    if(!this.input || !this.uploadBtn.length) {
      throw new Error('Input not found');
    }
    this.previewContainer = $(options.previewContainerSelector);

    this.uploadOptions = {
      sendPath: options.sendPath
    };

    this._setupEvents();
  };

  UploadGUI.prototype._setupEvents = function() {
    var self = this;
    this.input.addEventListener('change', function() {
      var file = self.input.files[0];
      var upload = new Upload(self.uploadOptions);

      upload.sendFile(file, function(err, res) {
        console.log(err, res);
      });

      upload.on('progress', _.bind(self._updateProgress, self));

      upload.on('thumbnail', _.bind(self._showThumbnail, self));
    });

    this.uploadBtn.on('click', function() {
      self.fileInput.click();
    });
  };

  UploadGUI.prototype._showThumbnail = function(thumb) {
    var img = this.previewContainer.find('img');
    img.attr('src', thumb);
    this.previewContainer.show('slow');
  };

  UploadGUI.prototype._updateProgress = function(e) {
    var progressBar = this.previewContainer.find('.progress .bar');
    progressBar.css({width: e.percent + "%"});
    var progressStatus = this.previewContainer.find('.progress-status');
    progressStatus.html(e.percent + "%");
  };

  return UploadGUI;
});