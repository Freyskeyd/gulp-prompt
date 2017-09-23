'use strict';

var gulpPrompt = require('./index.js');
var source = require('vinyl-source-stream');
var stream = require('stream');

var proxyrequire = require('proxyquire');

var prompt = function( listOptions ){
    return new Promise( (resolve,reject)=>{
        resolve('Got Response');
    });
}
//var gulpPrompt = proxyrequire('./index.js', {'inquirer':{ prompt: prompt}});

var writeStream = new stream.Writable();

writeStream.data = []; // We'll store all the data inside this array
writeStream._write = function (chunk) {
  this.data.push(chunk);
};
writeStream.on('end', function(){
    console.log('Completed Writing');
});

console.log( 'Calling gulpPrompt ');
var cb = function(response ){
    console.log('response', response);
}

let options = {
    message: 'Continue?',
    default: true
};


let srcStream = source('./test/**');

let resp = srcStream.pipe( gulpPrompt.confirm( options ) );
resp.write('./test.txt');
