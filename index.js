var request = require('request');
var when = require('when');

function PushBullet(PB_ACCESS_TOKEN) {
  function AccessHeader() {
    return {
      "Authorization": "Bearer " + PB_ACCESS_TOKEN
    };
  }

  function ListDevice() {
    var Got = when.defer();
    request({
      url: "https://api.pushbullet.com/v2/devices",
      headers: AccessHeader()
    }, function(err, res, body) {
      if (err) {
        Got.reject(err);
      } else {
        var data = JSON.parse(body);
        if (data && data.devices && data.devices.length > 0) {
          Got.resolve(data.devices);
        } else {
          Got.resolve([]);
        }
      }
    });
    return Got.promise;
  }

  return {
    ListDevice: ListDevice
  };
}

module.exports = PushBullet;
