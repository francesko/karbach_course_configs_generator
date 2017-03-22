var fs = require('fs');
var Q = require('q');
var Row = require('./app/Row');
var RowList = require('./app/RowList');
var GoogleAPI = require('./app/GoogleAPI');
var configPath = './output/config.json';

String.prototype.lowercaseFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

if(!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
  };
}

var tabs = {
  'motivational_1': 0,
  'motivational_2': 1,
  'motivational_3': 2,
  'unmotivational_1': 3,
  'unmotivational_2': 4,
  'unmotivational_3': 5
};
 
var rowList = new RowList();

GoogleAPI.getScreeFlowData(tabs['motivational_1'])
.then(function(rows){
  generateConfig(rows, 1);
})
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});

function generateConfig(rows, totalSessions) {
  rows.forEach(function(rowData) {
    var row = new Row(rowData);
    
    if (row.type !== 'Start Course') {
      rowList.add(row);
    }
  });

  var config = {
    // games_map_names: [],
    // games_map: [],
    // games_plan: [],
    introVideos: [],
    tutorialVideos: [],
    staticScreen: [],
    staticScreen2: [],
    staticScreen3: [],
    pseudoChoice: [],
    preEsScreen: [],
    postEsScreen: []
  };

  // for(var i = 1; i <= totalSessions; i = i + 1) {
  //   generateSession(config, rowList, i);
  // }

  generateSession(config, rowList, 7);

  fs.writeFile(configPath, JSON.stringify(config, null, 4), function (err) {
    if (err) return console.log(err);
  });
}

function fillInArray(array, item, maxSize) {
  while(array.length < maxSize) {
    array.push(item);
  }

  return array;
}

function generateSession(config, rowList, session) {
  var screenFlow = [
    'StaticScreen',
    'IntroVideo',
    'PreES',
    'PseudoChoice',
    'PreESVideo',
    'Exercise',
    'StaticScreen2',
    'PostES',
    'PostESVideo',
    'Questionnaire',
    'StaticScreen3'
  ];

  var rows = rowList.getRowsBySession(session);
  var imageBasePath = 'https:\/\/contentimg.s3.amazonaws.com/karbach/mainstudy/';
  var previousType = null;
  var sessionIndex = 0; //session - 1;
  var exerciseIndex = 0;

  config.introVideos[sessionIndex] = [];
  config.tutorialVideos[sessionIndex] = [];
  config.staticScreen[sessionIndex] = [];
  config.staticScreen2[sessionIndex] = [];
  config.staticScreen3[sessionIndex] = [];
  config.pseudoChoice[sessionIndex] = [];
  config.preEsScreen[sessionIndex] = [];
  config.postEsScreen[sessionIndex] = [];

  var rowTypeToConfigMapping = {
    'StaticScreen': 'staticScreen',
    'IntroVideo': 'introVideos',
    'PreES': 'preEsScreen',
    'PseudoChoice': 'pseudoChoice',
    'PreESVideo': 'tutorialVideos',
    'Exercise': 'game',
    'StaticScreen2': 'staticScreen2',
    'PostES': 'postEsScreen',
    'PostESVideo': 'tutorialVideos',
    'Questionnaire': 'questionnaire',
    'StaticScreen3': 'staticScreen3'
  };

  for(var i = 0; i < rows.length; i = i + 1) {
    let row = rows[i];
    let rowName = rowTypeToConfigMapping[row.type];
    let val = null;

    switch(row.type) {
      case 'StaticScreen':
      case 'StaticScreen2':
      case 'StaticScreen3': {
        val = {
          'image': imageBasePath + row.image,
          'text': row.mainText
            .replace(/\n/g, '<br>')
            .replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', ''),
          'button': 'Weiter'
        };
      } break;

      case 'IntroVideo': {
        val = [row.video1Id.replace('https://youtu.be/', '')];
      } break;
    }

    if (val) {
      config[rowName][sessionIndex][exerciseIndex] = val;
    }

    // increase exercise index and fill in entries for missing screens
    if (previousType != null && screenFlow.indexOf(row.type) < screenFlow.indexOf(previousType)) {
      for(let configSection in config) {
        if (config.hasOwnProperty(configSection) && !config[configSection][sessionIndex][exerciseIndex]) {
          let val = [];

          if (configSection.contains('EsScreen')) {
            val = 0;
          }

          config[configSection][sessionIndex][exerciseIndex] = val;
        }
      }

      exerciseIndex = exerciseIndex + 1;
      previousType = null;
    } else {
      previousType = row.type;
    }
  }

  // ensure that all config sections have an entry for each exercise
  var maxExercises = 4;

  for(let configSection in config) {
    if (config.hasOwnProperty(configSection) && config[configSection][sessionIndex].length < maxExercises) {
      let val = [];

      if (configSection.contains('EsScreen')) {
        val = 0;
      }

      fillInArray(config[configSection][sessionIndex], val, maxExercises);
    }
  }
}