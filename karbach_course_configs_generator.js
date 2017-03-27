var Q = require('q');
var GoogleAPI = require('./app/GoogleAPI');
var stringPolifylls = require('./app/stringPolyfills');
var generateConfig = require('./app/generateConfig');
var configPath = './output/';

var configs = [
  {
    name: 'Arbeitsgedächtnis (Motivational)',
    tab: 0,
    courseId: 60,
    flow: 'course_karbachMotivationalStudy_0'
  },
  {
    name: 'Inhibition (Motivational)',
    tab: 1,
    courseId: 61,
    flow: 'course_karbachMotivationalStudy_0'
  },
  {
    name: 'Kognitive Flexibilität (Motivational)',
    tab: 2,
    courseId: 62,
    flow: 'course_karbachMotivationalStudy_0'
  },
  {
    name: 'Arbeitsgedächtnis (Nicht Motivational)',
    tab: 3,
    courseId: 63,
    flow: 'course_karbachNonMotivationalStudy_0'
  },
  {
    name: 'Inhibition (Nicht Motivational)',
    tab: 4,
    courseId: 64,
    flow: 'course_karbachNonMotivationalStudy_0'
  },
  {
    name: 'Kognitive Flexibilität (Nicht Motivational)',
    tab: 5,
    courseId: 65,
    flow: 'course_karbachNonMotivationalStudy_0'
  }
];

var promises = configs.map(function(config) {
  return GoogleAPI.getScreeFlowData(config.tab)
    .then(function(rows){
      generateConfig(rows, 21, configPath + '/config_' + config.courseId + '.json', config);
    });
});

Q.all(promises)
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});