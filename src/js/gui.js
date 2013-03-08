/**
  GUI wiring
**/

define([
  'underscore',
  'jquery',
  './upload',
  './imageprocessor',
  './emitter'
], function(_, $, Upload, ImageProcessor, Emitter) {
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
    createImageThumbnails: true
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
      sendPath: options.sendPath
    };

    this._setupEvents();
  };

  UploadGUI.prototype._setupEvents = function() {
    var self = this;
    this.input.addEventListener('change', function() {
      var file = self.input.files[0];
      self._createThumbnail(file);
      var upload = new Upload(self.uploadOptions);

      upload.sendFile(file, function(err, res) {
        if(err) {
          return self._setStatusText(err.message);
        }
        self.progressContainer.hide();
        return self._setStatusText(self.options.messages.success);
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
  }

  return UploadGUI;
});