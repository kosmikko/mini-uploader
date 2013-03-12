define(['backbone'
], function(Backbone) {
  'use strict';

  var ImageProcessor = {
    createThumbnail: function(file, callback, options) {
      var self = this;
      var fileReader = new FileReader;
      fileReader.onload = function() {
        var img = new Image;
        img.onload = function() {
          self._processImage(img, callback, options);
        };
        return img.src = fileReader.result;
      };
      return fileReader.readAsDataURL(file);
    },

    _processImage: function(img, callback, options) {
      var canvas = document.createElement("canvas");

      var scale = Math.max(
        (options.minWidth || img.width) / img.width,
        (options.minHeight || img.height) / img.height
      );
      if (scale > 1) {
        img.width = parseInt(img.width * scale, 10);
        img.height = parseInt(img.height * scale, 10);
      }
      scale = Math.min(
        (options.maxWidth || img.width) / img.width,
        (options.maxHeight || img.height) / img.height
      );
      if (scale < 1) {
        img.width = parseInt(img.width * scale, 10);
        img.height = parseInt(img.height * scale, 10);
      }

      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var thumbnail = canvas.toDataURL("image/png");
      callback(thumbnail);
    }
  };

  return ImageProcessor;
});