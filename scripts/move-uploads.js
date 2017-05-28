var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

// Script to move upload files into their own directories
var uploadPath = './uploads';
var archivePath = './archive';

var moveFile = function moveFile(dirname, fname) {
  if (fname.endsWith('jpg')) {
    var iStart = fname.indexOf('-') + 1;
    var iEnd = fname.lastIndexOf('.');
    var ts = moment(parseInt(fname.substring(iStart, iEnd)));
    var newDirname = archivePath + '/' + ts.format('YYYY-MM-DD') + '/' + ts.format('HH');
    
    // Make the directory if it doesn't exist
    mkdirp(newDirname, function(err) {
      // Move the file there
      var oldPath = dirname + '/' + fname;
      var newPath = newDirname + '/' + fname;
      fs.renameSync(oldPath, newPath);
    });
  }
}

var moveDir = function moveDir(dirname) {
  // Get the list of files from a directory
  fs.readdir(dirname, function(err, items) {
    fileCount = items.length;
    console.log('Moving ' + fileCount + ' files from ' + dirname);
    for(var i=0; i < items.length; i++) {
      var fullName = dirname + '/' + items[i];
      if(fs.lstatSync(fullName).isDirectory()) {
        moveDir(fullName);
      } else {
        moveFile(dirname, items[i]);
      }
    }
  });
}

moveDir(uploadPath);
