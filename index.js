var fs = require('fs');
var request = require('request');
var axios = require('axios');

function PushBullet(PB_ACCESS_TOKEN) {

  function RequestAPI(path, options) {
    options = options || {};
    var opt = {
      url: "https://api.pushbullet.com/v2" + path,
      headers: Object.assign({
        "Access-Token": PB_ACCESS_TOKEN
      }, options.headers || {})
    };
    return axios(Object.assign({}, options, opt));
  }

  function AccessHeader() {
    return {
      "Access-Token": PB_ACCESS_TOKEN
    };
  }

  function ListDevices(callback) {
    RequestAPI("/devices")
      .then(function(response) {
        callback(null, response.data);
      })
      .catch(function(err) {
        console.error(err);
        callback(err);
      });
  }

  function ListContacts(callback) {
    RequestAPI("/contacts")
      .then(function(response) {
        callback(null, response.data);
      })
      .catch(function(err) {
        console.error(err);
        callback(err);
      });
  }

  function ListPushes(callback) {
    RequestAPI("/pushes", { params: { active: true } })
      .then(function(response) {
        callback(null, response.data);
      })
      .catch(function(err) {
        console.error(err);
        callback(err);
      });
  }

  function Push(params, callback) {
    function DoPush(params, callback) {
      RequestAPI("/pushes", { method: "POST", data: params })
        .then(function(response) {
          callback(null, response.data);
        })
        .catch(function(err) {
          console.error(err);
          callback(err);
        });
    }

    if (params.type === 'file') {
      UploadFile(params, function(err, fileInfo) {
        if (err) {
          return callback(err);
        }
        params.file_url = fileInfo.file_url;
        delete params.file;
        DoPush(params, callback);
      });
    } else {
      DoPush(params, callback);
    }
  }

  function UploadFile(params, callback) {
    var uploadParams = {
      file_name: params.file_name,
      file_type: params.file_type
    };
    RequestAPI("/upload-request", { method: "POST", data: uploadParams })
      .then(function(response) {
        var body = response.data;
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
      })
      .catch(function(err) {
        console.error(err);
        callback(err);
      });
  }

  return {
    ListContacts: ListContacts,
    ListDevices: ListDevices,
    ListPushes: ListPushes,
    Push: Push
  };
}

module.exports = PushBullet;
