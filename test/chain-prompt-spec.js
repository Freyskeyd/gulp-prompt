var assert = require('assert');
//Gulp uses vinyl source streams
var source = require('vinyl-source-stream');

var proxyrequire = require('proxyquire');
/**
 * The following test spec will verify the operation of the chain prompt function
 */
describe('gulp chain prompt unit tests', function () {
  describe('verify that chain prompt function operates correctly', function () {
    

    it('verify that chain prompt does not convert questions to array if already an array', function ( ){
        var prompt = function ( questions ){
            return new Promise( (resolve,reject) => {
                resolve('completed prompt');
            });
        };

        //Mock inquirer to capture response
        gulpPrompt = proxyrequire('../index.js', {'inquirer':{ prompt: prompt}});
        let srcStream = source('../README.md');
        var func = function (){};
        let resp = srcStream.pipe( gulpPrompt.confirmChain( ['options string'], func ) );
        resp.write('../test.txt');
    });
  });
});


