var inq = require('inquirer'),
    es  = require('event-stream'),
    _   = require('lodash');

module.exports = function (message, callback) {
  function _input(file, cb) {
    var opt = {
      message: 'input',
      name:'value',
      type: 'input'
    };

    if (_.isObject(message)) {
      _.assign(opt, message);
    }else if (!_.isUndefined(message)) {
      opt.message = message;
    }

    inq.prompt([opt], function (answear) {

      if (_.isFunction(callback)) {
        callback(answear, file, cb);
      }else{
        cb(null, file);
      }
    });
  }
  return es.map(_input);
};
