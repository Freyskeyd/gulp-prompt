var assert = require('assert');
//Gulp uses vinyl source streams
var source = require('vinyl-source-stream');

var proxyrequire = require('proxyquire');
/**
 * The following test spec will verify the operation of the chain prompt function
 */
describe('gulp chain confirm unit tests', function () {
  describe('verify that chain prompt function operates correctly', function () {
    

    it('verify that chain confirm does not convert questions to array if already an array', function ( ){
        var prompt = function ( questions ){
            return new Promise( (resolve,reject) => {
                resolve('completed prompt');
            });
        };

        //Mock inquirer to capture response
        gulpPrompt = proxyrequire('../index.js', {'inquirer':{ prompt: prompt}});
        let srcStream = source('../README.md');
        let resp = srcStream.pipe( gulpPrompt.confirm( ['options string'] ) );
        resp.write('../test.txt');
    });

    it('verify that chain function gets called correctly', function ( ){
        var prompt = function ( questions ){
            return new Promise( (resolve,reject) => {
                resolve('completed prompt');
            });
        };

        var chainFunction = function ( opts, resp ){
            console.log('Chain Function called');
            console.log( 'Response', resp);
            assert.equal( opts, options );
        };
        let index = 0;
        let options = {
            type: 'confirm',
            name: 'val',
            message: 'Test Message?',
            default: true,
            chainFunction: chainFunction
        };


        //Mock inquirer to capture response
        gulpPrompt = proxyrequire('../index.js', {'inquirer':{ prompt: prompt}});
        let srcStream = source('../README.md');
        
        let resp = srcStream.pipe( gulpPrompt.confirm( options ) );
        resp.write('../test.txt');
    });
  });
});


