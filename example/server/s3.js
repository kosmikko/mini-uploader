var crypto = require('crypto');
var moment = require('moment');
var config = require('./config');

exports.signURL = function(options) {
  var endpoint = options.host || 's3.amazonaws.com',
      protocol = options.protocol || 'http',
      bucket = config.get('amazon_s3_bucket'),
      aws_secret = config.get('amazon_secret'),
      aws_key = config.get('amazon_key'),
      acl = options.acl || 'public-read',
      expiresInMinutes = options.expiresInMinutes || 5,
      filename = options.filename,
      objectName = (options.path || '') + filename,
      contentType = options.contentType,
      bucketUrl = protocol + '://'+ bucket + '.' + endpoint;

  if(!filename) throw new Error("Filename was missing");

  var hmacSha1 = function (message) {
    return crypto.createHmac('sha1', aws_secret)
                 .update(message)
                 .digest('base64');
  };

  var createPolicy = function() {
    // NB: all post fields must be specified in the policy json
    var policyJSON = {
      "expiration": moment().add('minutes', expiresInMinutes).utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
      "conditions": [
        {"bucket": config.get('amazon_s3_bucket')},
        {"acl": acl},
        ["starts-with", "$Content-Type", contentType],
        ["starts-with", "$key", objectName],
      ]
    };
    //       {"success_action_redirect": successRedirect},
    //       {"x-amz-meta-filename": options.filename},
    //          [ 'content-length-range', 0, 10490000 ],
    return new Buffer(JSON.stringify(policyJSON)).toString('base64');
  }
  var expires = new Date();
  expires.setMinutes(expires.getMinutes() + expiresInMinutes);
  var epo = Math.floor(expires.getTime()/1000);

  var policy = createPolicy();
  var signature = hmacSha1(policy);

  return {
    url: bucketUrl,
    publicUrl: bucketUrl + '/' + objectName,
    fields: {
      key: filename,
      AWSAccessKeyId: aws_key,
      acl: acl,
      'Content-Type': contentType,
      policy: policy,
      signature: signature
    }
  };
};

