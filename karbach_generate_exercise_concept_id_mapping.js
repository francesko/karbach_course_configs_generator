var fs = require('fs');
var Q = require('q');
var GoogleAPI = require('./app/GoogleAPI');
var stringPolifylls = require('./app/stringPolyfills');
var outputPath = './app/exercisesConceptIdMap.js';
var utils = require('./app/utils');

GoogleAPI.getExercisesData()
.then(utils.getExerciseConceptIdMap)
.then(function(exercisesConceptIdMap) {
  var pre = 'module.exports = ';
  var post = ';';

  fs.writeFile(outputPath, pre + JSON.stringify(exercisesConceptIdMap, null, 2) + post, function (err) {
    if (err) return console.log(err);
  });
})
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});