var crypto = require('crypto');
var config = require('./config');

exports.signURL = function(options) {
  var acl = 'public-read';
  var successRedirect = '/';
  var s3_url = 'http://' + config.get('amazon_s3_bucket') + '.s3.amazonaws.com/';
  var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).getTime();

  var policyJSON = {
    "expiration": expiration,
    "conditions": [
      {"bucket": config.get('amazon_s3_bucket')},
      {"acl": acl},
      {"success_action_status": "200"}
    ]
  };
  //       {"success_action_redirect": successRedirect},
  //      ["starts-with", "$Content-Type", options.contentType]
  //       ["starts-with", "$key", "key/"],
  //       {"x-amz-meta-filename": options.filename},
  var secret = config.get('amazon_secret');
  var policyBase64 = new Buffer(JSON.stringify(policyJSON)).toString('base64');
  var shasum = crypto.createHash('sha1', secret);
  shasum.update(policyBase64);
  var signature = shasum.digest('base64');

  return s3_url +
      '?AWSAccessKeyId=' + config.get('amazon_key') +
      '&expires=' + expiration +
      '&key=' + options.objectName +
      '&signature=' + signature;
};