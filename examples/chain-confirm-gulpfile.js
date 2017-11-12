'use strict';

var gulp = require( 'gulp' );
var prompt = require('../index');
var index =0;

var chainFunction = function ( options, resp ){
    console.log( 'Here is the selection ', resp);
    if( index <= 3){
        options.message = `Hello this is iteration ${index}`;
        index++;
        return options;
    }else{
        return;
    }
};

/**
 * The following is a sample gulp file for chaining requests.  It 
 * will pass a chaining function to the confirm function and will 
 * allow the user to chain multiple requests together
 * variables
 * 
 */
gulp.task( 'chainConfirm',  () => {
    return gulp.src( '../package.json' )
        .pipe( prompt.confirm({
            type:'input',
            name:'env',
            message:'Hello First interation, please enter selection?',
            chainFunction:chainFunction
        }, (res) => {
            console.log('Result', res);
        }) );
});

