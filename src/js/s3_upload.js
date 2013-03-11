/**
Uploads directly to S3
**/
define([
  'underscore',
  './upload'
], function(_, Upload) {
  'use strict';

  var S3Upload = function(options) {this.initialize(options)};

  _.extend(S3Upload.prototype, Upload.prototype);

  S3Upload.prototype.initialize = function(options) {
    Upload.prototype.initialize.apply(this, [options]);
    this.options.method = 'PUT';
  }

  S3Upload.prototype.getSignUrl = function(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.options.s3SignUrl + '?filename=' + file.name + '&contenttype=' + file.type, true);

    xhr.onreadystatechange = function(e) {
      if (this.readyState == 4 && this.status == 200) {
        callback(null, decodeURIComponent(this.responseText));
      }
      else if(this.readyState == 4 && this.status != 200) {
        callback(new Error('Could sign request. Status: ' + this.status));
      }
    };

    xhr.send();
  };

  S3Upload.prototype.uploadToS3 = function(file, callback) {
    var self = this;
    this.headers['Content-Type'] = file.type;
    this.headers['x-amz-acl'] = 'public-read';
    this.getSignUrl(file, function(err, url) {
      if(err) return callback(err);
      self.sendPath = url;
      self.sendFile(file, callback);
    });
  }

  return S3Upload;
});