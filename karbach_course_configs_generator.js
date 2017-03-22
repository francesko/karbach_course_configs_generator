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

function fillInArray(array, val, maxSize) {
  while(array.length < maxSize) {
    array.push(val);
  }

  array.forEach(function(item, index) {
    if (item == null) {
      console.log(item);
      array[index] = val;
      console.log(array[index]);
    }
  });

  return array;
}

function prepareText(text) {
  return text
    .replace(/\n/g, '<br>')
    .replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', '');
}

function getImagePath(imageFileName) {
  return 'https:\/\/contentimg.s3.amazonaws.com/karbach/mainstudy/' + imageFileName;
}

function getYoutubeId(videoUrl) {
  return videoUrl.replace('https://youtu.be/', '');
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
  
  var previousType = null;
  var sessionIndex = 0; //session - 1;
  var previousExerciseIndex = 0;
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

    if (previousType != null && screenFlow.indexOf(row.type) < screenFlow.indexOf(previousType)) {
      previousExerciseIndex = exerciseIndex;
      exerciseIndex = exerciseIndex + 1;
      previousType = null;
    } else {
      previousType = row.type;
    }

    switch(row.type) {
      case 'IntroVideo': {
        val = [getYoutubeId(row.video1Id)];
      } break;

      case 'PreESVideo':
      case 'PostESVideo': {
        if(!config[rowName][sessionIndex][exerciseIndex]) {
          config[rowName][sessionIndex][exerciseIndex] = [];
        }

        let index = row.type.contains('Pre') ? 0 : 1;

        config[rowName][sessionIndex][exerciseIndex][index] = getYoutubeId(row.video1Id);
      } break;

      case 'StaticScreen':
      case 'StaticScreen2':
      case 'StaticScreen3': {
        val = {
          'image': getImagePath(row.image),
          'text': prepareText(row.mainText)
            ,
          'button': 'Weiter'
        };
      } break;

      case 'PseudoChoice': {
        val = {
          "image": getImagePath(row.image),
          "video": getYoutubeId(row.video1Id),
          "text": prepareText(row.mainText),
          "choices": [
            {
              "buttonText": row.button1Text,
              "video": getYoutubeId(row.video2Id)
            },
            {
              "buttonText": row.button2Text,
              "video": getYoutubeId(row.video3Id)
            }
          ]
        };
      } break;

      case 'PreES':
      case 'PostES': {
        config[rowName][sessionIndex][exerciseIndex] = 1;
      } break;
    }

    if (val) {
      config[rowName][sessionIndex][exerciseIndex] = val;
    }

    // increase exercise index and fill in entries for missing screens
    if (previousExerciseIndex != exerciseIndex) {
      for(let configSection in config) {
        if (config.hasOwnProperty(configSection) && !config[configSection][sessionIndex][exerciseIndex]) {
          let val = [];

          if (configSection.contains('EsScreen')) {
            val = 0;
          }

          config[configSection][sessionIndex][exerciseIndex] = val;
        }
      }
    }
  }

  // ensure that all config sections have an entry for each exercise
  var maxExercises = 4;

  for(let configSection in config) {
    if (config.hasOwnProperty(configSection)) {
      let val = [];

      if (configSection.contains('EsScreen')) {
        val = 0;
      }

      fillInArray(config[configSection][sessionIndex], val, maxExercises);
    }
  }
}