var assert = require('assert');
//Gulp uses vinyl source streams
var source = require('vinyl-source-stream');

var proxyrequire = require('proxyquire');
/**
 * The following test spec will design 
 */

 //Tests.  Makes sure you only prompt the user once.

//Tests.  Makes sure that if option is string it converts it to message
//Tests. Makes sure that if default is used, it is used.  If no default then sets
//Tests.  Makes sure that if no options passed.  option is created 
//Tests. That if multiple streams are passed it is only called once.  prompt should be called only once

describe('gulp confirm unit tests', function() {
  describe('verify that confirm function operates correctly', function() {
    it('verify that confirm converts string message to options', function( done ){
        var prompt = function( listOptions ){
            return new Promise( (resolve,reject)=>{
                // 
                if( ( Array.isArray( listOptions) ) && (typeof listOptions[0] !== 'string') ){
                    done();
                }else{
                    done('options is not a string');
                }
                resolve('Test Completed');
            });
        }

        //Mock inquirer to capture response
        gulpPrompt = proxyrequire('../index.js', {'inquirer':{ prompt: prompt}});
        let srcStream = source('../README.md');
        let resp = srcStream.pipe( gulpPrompt.confirm( 'options string' ) );
        resp.write('../test.txt');
    });

    it('verify that confirm leaves object messages as is', function( done ){
        var prompt = function( listOptions ){
            return new Promise( (resolve,reject)=>{
                resolve('Test Completed');
                if( ( Array.isArray( listOptions) ) && (typeof listOptions[0] !== 'string') ){
                    assert.equal( listOptions[0].message, 'Test Message?' );
                    assert.equal( listOptions[0].default, true );
                    done();
                }else{
                    done('options convertion not handled');
                }
                
            });
        }

        //Mock inquirer to capture response
        gulpPrompt = proxyrequire('../index.js', {'inquirer':{ prompt: prompt}});
        let srcStream = source('../README.md');
        let options = {
            type: 'confirm',
            name: 'val',
            message: 'Test Message?',
            default: true
        };
        let resp = srcStream.pipe( gulpPrompt.confirm( options ) );
        resp.write('../test.txt');
    });

  });
});


