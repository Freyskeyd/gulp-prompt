var inq = require('inquirer'),
  es  = require('event-stream'),
  template = require("lodash.template");

module.exports = {

  /**
   * The following method will act as a proxy to the inquirer
   * prompt function.  It will pass the questions object directly to 
   * inqurier's prompt function
   * @param {*} questions
   * @param {*} callback
   */
  prompt: function(questions, callback) {
    var prompted = false;
    return es.map(function(file, cb) {

      /**
       * The following chainHandler was designed to be called recursively so as to allow
       * users the ability to chain multple calls to inquirer together.  It will stop 
       * calls to the chain handler when the chain function returns undefined.
       * @param {objects} options 
       */
      var chainHandler = function( options ){
        
        return new Promise( (resolve,reject)=>{
            inq.prompt([options]).then( resp =>{
              let opts = chainFunction( options, resp );
              if( typeof opts === 'undefined'){
                return resolve('response');
              }else{
                chainHandler( opts );
              }
            }).catch( err =>{
              reject( 'Unexpected Error');
            });
        });
      }

      if (prompted === true) {
        cb(null,file);
        return;
      }

      if (!questions instanceof Array) {
        questions = [questions];
      }

      if (typeof callback !== 'function') {
        callback = function(){};
      }
      if( typeof questions.chainFunction === 'undefined' ){
        inq.prompt(questions).then(function(res) {
          callback(res);
          cb(null, file);
        });

        prompted = true;
      }else{
        chainFunction = questions.chainFunction;
        return chainHandler( questions ).then(function(res) {
          if (res.val) {
            cb(null, file);
          }
        }).catch( err => {
          cb(null, file);
        });
  
        prompted = true;
      }
    });
  },

  confirm: function(options) {
    var prompted = false;
    var chainFunction;
    return es.map(function(file, cb) {

      if (prompted === true) {
        cb(null,file);
        return;
      }

      /**
       * The following chainHandler was designed to be called recursively so as to allow
       * users the ability to chain multple calls to inquirer together.  It will stop 
       * calls to the chain handler when the chain function returns undefined.
       * @param {objects} options 
       */
      var chainHandler = function( options ){
        
        return new Promise( (resolve,reject)=>{
            inq.prompt([options]).then( resp =>{
              var opts = chainFunction( options, resp );
              if( typeof opts === 'undefined'){
                return resolve('response');
              }else{
                chainHandler( opts );
              }
            }).catch( err =>{
              reject( 'Unexpected Error');
            });
        });
      }

      var opts = {
        type: 'confirm',
        name: 'val',
        message: 'Are you sure?',
        default: false
      };

      if (typeof options === 'string') {
        opts.message = options;
      }

      if (typeof options !== 'object') {
        options = {};
      }

      if( typeof options.templateOptions !== 'undefined'){
        var compiled = template( options.message );
        options.message = compiled( options.templateOptions);
      }

      opts.message = options.message || opts.message;
      opts.default = options.default || opts.default;

      if( typeof options.chainFunction === 'undefined'){
        inq.prompt([opts]).then(function(res) {
          
          if (res.val) {
            cb(null, file);
          }
        });
        prompted = true;
      }else{
        chainFunction = options.chainFunction;
        return chainHandler( opts ).then(function(res) {
          if (res.val) {
            cb(null, file);
          }
        }).catch( err => {
          cb(null, file);
        });
  
        prompted = true;
      }
    });
  },
  inq: inq
};
