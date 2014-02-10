var inq = require('inquirer'),
    es  = require('event-stream'),
    _   = require('lodash');

module.exports = function (message, possibility, callback) {
  function _checkbox(file, cb) {
    var opt = {
      message: 'Are you sure?',
      name:'val',
      type: 'checkbox',
      default: false
    };
    
    if (_.isObject(message)) {
      _.assign(opt, message);
    }else if (!_.isUndefined(message)) {
      opt.message = message;
    }
    
    opt.choices = possibility;

    inq.prompt([opt], function (answear) {
      if (answear.val.length) {
        callback(answear.val, file, cb);
        cb(null, file);
      }
    });
  }
  return es.map(_checkbox);
};
