var Q = require('q');
var GoogleAPI = require('./app/GoogleAPI');
var stringPolifylls = require('./app/stringPolyfills');
var generateConfig = require('./app/generateConfig');
var configPath = './output/';

var configs = [
  {
    tab: 0,
    courseId: 60,
    meta: {
      "name": "Study Karbach - Main Group 1 - Arbeitsgedächtnis (Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
  },
  {
    tab: 1,
    courseId: 61,
    meta: {
      "name": "Study Karbach - Main Group 2 - Inhibition (Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
  },
  {
    tab: 2,
    courseId: 62,
    meta: {
      "name": "Study Karbach - Main Group 3 - Kognitive Flexibilität (Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
  },
  {
    tab: 3,
    courseId: 63,
    meta: {
      "name": "Study Karbach - Main Group 4 - Arbeitsgedächtnis (Nicht Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachNonMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
  },
  {
    tab: 4,
    courseId: 64,
    meta: {
      "name": "Study Karbach - Main Group 5 - Inhibition (Nicht Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachNonMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
  },
  {
    tab: 5,
    courseId: 65,
    meta:{
      "name": "Study Karbach - Main Group 6 - Kognitive Flexibilität (Nicht Motivational)",
      "devices": [
        "web"
      ],
      "shuffle": "0",
      "skippable": 0,
      "training_days": 5,
      "screenflow":"karbachNonMotivationalStudy",
      "progressbar": true,
      "showInGamePopups":false,
      "showInGameTutorial":2,
      "trackInputData":3,
      "game_version": 6
    }
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