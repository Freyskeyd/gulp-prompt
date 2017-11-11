var inq = require('inquirer'),
  es  = require('event-stream'),
  template = require("lodash.template"),
  pipeline = require('promise-sequence/lib/pipeline');

module.exports = {

  prompt: function(questions, callback) {
    var prompted = false;
    return es.map(function(file, cb) {

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

      inq.prompt(questions).then(function(res) {
        callback(res);
        cb(null, file);
      });

      prompted = true;
    });
  },

  confirm: function(options) {
    var prompted = false;
    return es.map(function(file, cb) {

      if (prompted === true) {
        cb(null,file);
        return;
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

      inq.prompt([opts]).then(function(res) {

        if (res.val) {
          cb(null, file);
        }

      });

      prompted = true;
    });
  },

  /**
   * The following method is used for chaining multiple prompts 
   * together in a list.  The function requires an array of objects
   * which each object 
   */

   //https://github.com/snowyu/promise-sequence.js/blob/master/src/pipeline.js
   //Look at incorporating this behaviour.
   //Need to call at end of each function
   //Ideally pass a function and this function will return a list
  confirmChain: function(confirmOptions) {
    var prompted = false;
    let self = this;
    let index = 0;
    return es.map(function(file, cb) {

      if (prompted === true) {
        cb(null,file);
        return;
      }

      var opts = {
        type: 'confirm',
        name: 'val',
        message: 'Are you sure?',
        default: false
      };

      /**
       * If returns undefined will stop processing the function
       * @param {objects} options 
       * @param {objects} params - parameters from previous call 
       */
      var first = function( options, params ){
        console.log( 'here are parms', params);
        console.log( 'here are options', options);
        if( index++ >= 3){
          console.log( 'Completed ');
          return;
        }
        console.log( 'Not done ', index);
        return options;
      }

      var handler = function( options, params ){

        return new Promise( (resolve,reject)=>{
          console.log( 'First function', params);
            inq.prompt([options]).then( resp =>{
              let opts = first( options, resp );
              if( typeof opts === 'undefined'){
                console.log( 'Rst is undefined.  Stopping');
                return resolve('response');
              }else{
                console.log( 'rst is not undefined.  Proceeding');
                handler( opts, resp );
              }
            }).catch( err =>{
              console.log('Unexpected error',err);
              reject( 'Unexpected Error');
            });
        });

      }

      

      console.log('About to call chain', opts);
      return handler( opts, {} ).then(function(res) {
        console.log('Completed calling', res); 
        if (res.val) {
          cb(null, file);
        }
        
      }).catch( err => {
        console.log('Error in final handler',err);
        cb(null, file);
      });



      prompted = true;
    });
  },

  inq: inq
};
