var GoogleAPI = require('./app/GoogleAPI');
var stringPolifylls = require('./app/stringPolyfills');
var generateConfig = require('./app/generateConfig');

var tabs = {
  'motivational_1': 0,
  'motivational_2': 1,
  'motivational_3': 2,
  'unmotivational_1': 3,
  'unmotivational_2': 4,
  'unmotivational_3': 5
};

GoogleAPI.getScreeFlowData(tabs['motivational_1'])
.then(function(rows){
  generateConfig(rows, 21);
})
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});