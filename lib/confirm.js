var inq = require('inquirer'),
    es  = require('event-stream'),
    _   = require('lodash');

module.exports = function (message) {
  function _confirm(file, cb) {
    var opt = {
      message: 'Are you sure?',
      name:'val',
      type: 'confirm',
      default: false
    };

    if (_.isObject(message)) {
      _.assign(opt, message);
    }else if (!_.isUndefined(message)) {
      opt.message = message;
    }

    inq.prompt([opt], function (answear) {
      if (answear.val) {
        cb(null, file);
      }
    });
  }
  return es.map(_confirm);
};