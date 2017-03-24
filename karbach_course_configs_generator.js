var Q = require('q');
var GoogleAPI = require('./app/GoogleAPI');
var stringPolifylls = require('./app/stringPolyfills');
var generateConfig = require('./app/generateConfig');
var configPath = './output/';

var configs = [
  {
    name: 'Arbeitsgedächtnis (motivational)',
    tab: 0,
    courseId: 60
  },
  {
    name: 'Inhibition (motivational)',
    tab: 1,
    courseId: 61
  },
  {
    name: 'Kognitive Flexibilität (motivational)',
    tab: 2,
    courseId: 62
  },
  // {
  //   name: 'Arbeitsgedächtnis (nicht motivational)',
  //   tab: 3,
  //   courseId: 63
  // },
  // {
  //   name: 'Inhibition (nicht motivational)',
  //   tab: 4,
  //   courseId: 64
  // },
  // {
  //   name: 'Kognitive Flexibilität (nicht motivational)',
  //   tab: 5,
  //   courseId: 65
  // }
];

var promises = configs.map(function(config) {
  return GoogleAPI.getScreeFlowData(config.tab)
    .then(function(rows){
      generateConfig(rows, 21, configPath + '/config_' + config.courseId + '.json');
    });
});

Q.all(promises)
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});