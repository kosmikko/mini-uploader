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
      var canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d");
      canvas.width = 200;
      canvas.height = options.thumbnailHeight;

      var srcWidth = img.width,
          srcHeight = img.height,
          srcX = 0,
          srcY = 0,
          trgX = 0,
          trgY = 0,
          trgWidth = canvas.width,
          trgHeight = canvas.height,
          srcRatio = img.width / img.height,
          trgRatio = canvas.width / canvas.height,
          self = this;

      if (img.height < canvas.height || img.width < canvas.width) {
        trgHeight = srcHeight;
        trgWidth = srcWidth;
      } else {
        if (srcRatio > trgRatio) {
          srcHeight = img.height;
          srcWidth = srcHeight * trgRatio;
        } else {
          srcWidth = img.width;
          srcHeight = srcWidth / trgRatio;
        }
      }
      srcX = (img.width - srcWidth) / 2;
      srcY = (img.height - srcHeight) / 2;
      trgY = (canvas.height - trgHeight) / 2;
      trgX = (canvas.width - trgWidth) / 2;
      ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, trgX, trgY, trgWidth, trgHeight);
      var thumbnail = canvas.toDataURL("image/png");
      callback(thumbnail);
    }
  };

  return ImageProcessor;
});