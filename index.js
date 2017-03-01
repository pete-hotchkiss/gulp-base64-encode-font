var fs      = require('fs');
var path    = require('path');
var mime    = require('mime');
var gutil   = require('gulp-util');
var through = require('through2');
var rename = require('gulp-rename');

module.exports = function(options) {
  "use strict";

  return through.obj(function(file, enc, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError("gulp-simplefont64", "Stream content is not supported"));
      return callback();
    }

    if (file.isBuffer()) {
      var fontToBase64 = new Buffer(file.contents).toString('base64');
      var fileName = path.basename(file.path, path.extname(file.path));
      var fontAttrs = fileName.split('-');
      var fontFamily = fontAttrs.shift();
      var css = '@font-face { font-family: \'' + fontFamily + '\'; ';
      css += 'src: url(data:\'' + mime.lookup(file.path) + '; base64,' + fontToBase64 + '\');}';

      file.contents = new Buffer(css);
      file.path = ((options.name) ? options.name : file.path) + ".css";
      file.path = gutil.replaceExtension(file.path, (options.type) ? "."+ options.type : ".css");
      file.path = "sass/header-bar/global/" + file.path;

      return callback(null, file);
    }
  });
};
