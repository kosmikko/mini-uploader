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
    this.options.method = 'POST';
  }

  S3Upload.prototype.getSignUrl = function(file, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.options.s3SignUrl + '?filename=' + file.name + '&contenttype=' + file.type, true);
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.onreadystatechange = function(e) {
      if (this.readyState == 4 && this.status == 200) {
        callback(null, JSON.parse(this.responseText));
      }
      else if(this.readyState == 4 && this.status != 200) {
        callback(new Error('Could sign request. Status: ' + this.status));
      }
    };

    xhr.send();
  };

  S3Upload.prototype.uploadToS3 = function(file, callback) {
    var self = this;
    this.headers['x-amz-acl'] = 'public-read';
    this.getSignUrl(file, function(err, signedData) {
      if(err) return callback(err);
      self.sendPath = signedData.url;
      console.log(signedData);
      self.sendFile(file, signedData.fields, callback);
    });
  }

  return S3Upload;
});