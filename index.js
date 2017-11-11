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
   * @param {object} confirmOptions - Must have a chainFunction or will just re-route to 
   * confirm funciton
   * 
   * TODO: 
   * 1. implement example gulp file which will merge this 
   * 2. Complete proper unit testing
   * 3. Merge this functionality back into the confirm function
   */
  confirmChain: function(confirmOptions) {
    var prompted = false;
    let self = this;
    let index = 0;
    return es.map(function(file, cb) {

      if (prompted === true) {
        cb(null,file);
        return;
      }

      let chainFunction;
      if( typeof confirmOptions.chainFunction !== 'undefined' && typeof confirmOptions.chainFunction === "funciton" ){
        chainFunction = confirmOptions.chainFunction;
      }else{
        return self.confirm( confirmOptions );
      }

      /**
       * The following function will call the inquirer prompt function and if successful 
       * it will then call the chainFunction.  If the chain function returns an object
       * it will be passed to the handler which will then pass it o inquirer prompt function
       * If the chain function returns undefined it will stop processing and exit.  
       * The chain function all the user to define  a function that will keep requesting data
       * from the inquirer prompt so long as options are returned from the chain function
       * @param {objects} options 
       */
      var handler = function( options ){

        return new Promise( (resolve,reject)=>{
          //console.log( 'First function', params);
            inq.prompt([options]).then( resp =>{
              let opts = chainFunction( options );
              if( typeof opts === 'undefined'){
                //console.log( 'Rst is undefined.  Stopping');
                return resolve('response');
              }else{
                //console.log( 'rst is not undefined.  Proceeding');
                handler( opts );
              }
            }).catch( err =>{
              console.log('Unexpected error',err);
              reject( 'Unexpected Error');
            });
        });

      }

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
