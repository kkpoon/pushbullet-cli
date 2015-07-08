var path = require('path');

var yargs = require('yargs');

var mime = require('mime-types');

var PushBullet = require('../');

var PB_ACCESS_TOKEN = process.env.PB_ACCESS_TOKEN;

function ListDevices() {
  PushBullet(PB_ACCESS_TOKEN).ListDevice(function(err, res) {
    if (err) {
      console.error(err);
    } else {
      if (res && res.devices && res.devices.length > 0) {
        res.devices.forEach(function(d, i) {
          console.log((i+1) + ' ' + d.nickname + '\t' + '(' + d.iden + ')');
        });
      }
    }
  });
}

function Push(yargs) {
  yargs
    .string('t')
    .alias('t', 'target')
    .describe('t', 'the target to push to, in format: type=target');
}

function PushNote(yargs) {
  var argv = yargs
    .string('title')
    .describe('title', 'title of message')
    .string('body')
    .describe('body', 'body of message')
    .demand(['body'])
    .help('h')
    .alias('h', 'help')
    .argv;
  PushBullet(PB_ACCESS_TOKEN).Push({
    type: 'note',
    title: argv.title,
    body: argv.body
  }, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}

function PushLink(yargs) {
  var argv = yargs
    .string('title')
    .describe('title', 'title of message')
    .string('body')
    .describe('body', 'body of message')
    .string('url')
    .describe('url', 'the url')
    .demand(['url'])
    .help('h')
    .alias('h', 'help')
    .argv;
  PushBullet(PB_ACCESS_TOKEN).Push({
    type: 'link',
    title: argv.title,
    body: argv.body,
    url: argv.url
  }, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}

function PushFile(yargs) {
  var argv = yargs
    .string('file')
    .describe('file', 'the file to upload')
    .string('body')
    .describe('body', 'body of message')
    .demand(['file'])
    .help('h')
    .alias('h', 'help')
    .argv;
    path.basename
  PushBullet(PB_ACCESS_TOKEN).Push({
    type: 'file',
    file_name: path.basename(argv.file),
    file_type: mime.lookup(argv.file) || 'application/octet-stream',
    body: argv.body,
    file: argv.file
  }, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });
}

if (PB_ACCESS_TOKEN) {
  yargs
    .usage("Usage: $0 <command> <options>")
    .command('list-devices', 'list the available devices', ListDevices)
    .command('push', 'push something to target', function(yargs) {
      yargs
        .command('note', 'push a note', PushNote)
        .command('link', 'push a link', PushLink)
        .command('file', 'push a file', PushFile)
        .demand(2)
        .help('h')
        .alias('h', 'help')
        .argv;
    })
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .epilogue('Access token is set by PB_ACCESS_TOKEN environment variable')
    .argv;
} else {
  console.error('Please set PB_ACCESS_TOKEN environment variable');
}
