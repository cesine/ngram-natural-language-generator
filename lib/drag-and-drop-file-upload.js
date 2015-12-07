/* globals document, FileReader, escape */
'use strict';

var readBlob = function(files, opt_startByte, opt_stopByte) {
  files = files || document.getElementById('files').files;
  if (!files.length) {
    console.warn('file list is empty');
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState === FileReader.DONE) { // DONE == 2
        document.getElementById('text').textContent = document.getElementById('text').textContent + evt.target.result;
        document.getElementById('byte_range').textContent = document.getElementById('byte_range').textContent +
        ['Read bytes: ', start + 1, ' - ', stop + 1,
        ' of ', file.size, ' byte file'
        ].join('');
      }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  }
};

var handleFileSelect = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
      f.size, ' bytes, last modified: ',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  readBlob(files);
};

var handleDragOver = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};

var dragAndDropFifleUtils = {
  addListeners: function() {
    // Setup file choose listeners
    document.getElementById('files').addEventListener('change', function(evt) {
      readBlob(evt.target.files);
    }, false);

    // Setup the drag and drop listeners.
    var dropZone = document.getElementById('text');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  }
};
