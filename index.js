var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var gutil   = require('gulp-util');
var through = require('through2');

module.exports = function(options) {
  "use strict";

  function gulpBase64EncodeFont(file, enc, callback) {

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError("gulp-gulp-base64-encode-font", "this plugin doesn't support streams"));
      return callback();
    }

    if (file.isBuffer()) {
      var fBase64 = new Buffer(file.contents).toString('base64');
      var fName = path.basename(file.path, path.extname(file.path));
      var fAtts = fName.split('-');
      var fam = fAtts.shift();
      var css = '@font-face { font-family: \'' + fam + '\'; ';
      css += 'src: url(\'data:' + mime.lookup(file.path) + '; base64,' + fBase64 + '\');}';

      file.contents = new Buffer(css);
      file.path = ((options.name) ? options.name : file.path) + ".css";
      file.path = gutil.replaceExtension(file.path, (options.type) ? "."+ options.type : ".css");
      file.path = "sass/header-bar/global/" + file.path;

      return callback(null, file);
    }
  };

  return through.obj(gulpBase64EncodeFont);
};
