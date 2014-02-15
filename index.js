var inq = require('inquirer'),
	es  = require('event-stream');

module.exports = {

	prompt: function(questions, callback){

		return es.map(function(file, cb){

			if(!questions instanceof Array){
				questions = [questions];
			}

			if(typeof callback !== 'function'){
				callback = function(){};
			}

			inq.prompt(questions, function(res){
				callback(res);
				cb(null, file);
			});

		});
	},

	confirm: function(options){

		return es.map(function(file, cb){

			var opts = {
				type: 'confirm',
				name: 'val',
				message: 'Are you sure?'
			};

			if(typeof options === 'string'){
				opts.message = options;
			}

			if(typeof options !== 'object'){
				options = {};
			}

			opts.default = options.default || false;

			inq.prompt([opts], function(res){

				if(res.val){
					cb(null, file);
				}

			});
		});
	}
};