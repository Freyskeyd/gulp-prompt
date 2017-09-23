var assert = require('assert');

var proxyrequire = require('proxyquire');
var gulpPrompt = proxyrequire('../index.js', {'inquirer':{}, 'event-stream':{}});
/**
 * 
 */
describe('gulp prompt unit tests', function() {
  describe('verify that the gulp prompt exists', function() {
    it('Should verify that the package exists', function(){
      assert.notEqual(gulpPrompt, undefined);
    });
    it('Should verify that the package contains a function prompt', function(){
        assert.notEqual(gulpPrompt.prompt, undefined);
    });
    it('Should verify that the package contains a function confirm', function(){
        assert.notEqual(gulpPrompt.confirm, undefined);
    });
  });
});


//Tests.  Makes sure you only prompt the user once.

//Tests.  Makes sure that if option is string it converts it to message
//Tests. Makes sure that if default is used, it is used.  If no default then sets
//Tests.  Makes sure that if no options passed.  option is created 
//Tests. That if multiple streams are passed it is only called once.  prompt should be called only once
