var yargs = require('yargs');

var PushBullet = require('../');

var PB_ACCESS_TOKEN = process.env.PB_ACCESS_TOKEN;

function ListDevices() {
  PushBullet(PB_ACCESS_TOKEN).ListDevice()
    .done(function(devices) {
      devices.forEach(function(d, i) {
        console.log("" + (i+1) + ' ' + d.nickname + '\t' + '(' + d.iden + ')');
      });
    }, function(err) {
      console.error(err);
    });
}

if (PB_ACCESS_TOKEN) {
  yargs
    .usage("Usage: $0 <command> <options>")
    .command('list-devices', 'list the available devices', ListDevices)
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .epilogue('Access token is set by PB_ACCESS_TOKEN environment variable')
    .argv;
} else {
  console.error('Please set PB_ACCESS_TOKEN environment variable');
}
