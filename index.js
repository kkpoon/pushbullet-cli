var fs = require('fs');
var request = require('request');

function PushBullet(PB_ACCESS_TOKEN) {
  function AccessHeader() {
    return {
      "Authorization": "Bearer " + PB_ACCESS_TOKEN
    };
  }

  function ListDevices(callback) {
    request({
      url: "https://api.pushbullet.com/v2/devices",
      headers: AccessHeader(),
      json: true
    }, function(err, res, body) {
      if (err) {
        callback(err);
      } else {
        callback(null, body);
      }
    });
  }
  
  function ListContacts(callback) {
    request({
      url: "https://api.pushbullet.com/v2/contacts",
      headers: AccessHeader(),
      json: true
    }, function(err, res, body) {
      if (err) {
        callback(err);
      } else {
        callback(null, body);
      }
    });
  }
  
  function Push(params, callback) {
    function DoPush(params, callback) {
      request({
        url: "https://api.pushbullet.com/v2/pushes",
        method: "POST",
        headers: AccessHeader(),
        json: true,
        body: params
      }, function(err, res, body) {
        if (err) {
          callback(err)
        } else {
          callback(null, body);
        }
      });
    }
    
    if (params.type === 'file') {
      UploadFile(params, function(err, fileInfo) {
        params.file_url = fileInfo.file_url;
        delete params.file;
        DoPush(params, callback);
      });
    } else {
      DoPush(params, callback);
    }
  }
  
  function UploadFile(params, callback) {
    request({
      url: "https://api.pushbullet.com/v2/upload-request",
      method: "POST",
      headers: AccessHeader(),
      json: true,
      body: {file_name: params.file_name, file_type: params.file_type}
    }, function(err, res, body) {
      if (err) {
        callback(err);
      } else {
        var awsData = body.data;
        awsData.file = fs.createReadStream(params.file);
        request({
          url: body.upload_url,
          method: "POST",
          formData: awsData
        }, function(err, res) {
          if (err) {
            callback(err);
          } else {
            if (res.statusCode === 204) {
              callback(null, {
                file_type: body.file_type,
                file_name: body.file_name,
                file_url: body.file_url
              });
            } else {
              callback(res);
            }
          }
        });
      }
    });
  }
  
  return {
    ListContacts: ListContacts,
    ListDevices: ListDevices,
    Push: Push
  };
}

module.exports = PushBullet;
