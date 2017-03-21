var fs = require('fs');
var Q = require('q');
var Row = require('./app/Row');
var RowList = require('./app/RowList');
var GoogleAPI = require('./app/GoogleAPI');
var configPath = './output/config.json';

String.prototype.lowercaseFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
};

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
    staticScreen4: [],
    pseudoChoice: [],
    preEsScreen: [],
    postEsScreen: []
  };

  for(var i = 1; i <= totalSessions; i = i + 1) {
    generateSession(config, rowList, i)
  }

  fs.writeFile(configPath, JSON.stringify(config, null, 4), function (err) {
    if (err) return console.log(err);
  });
}

function generateSession(config, rowList, session) {
  var screenFlow = [
    'StaticScreen',
    'IntroVideo',
    'PreES',
    'PseudoChoice',
    'PreESVideo',
    'game',
    'StaticScreen2',
    'PostES',
    'PostESVideo',
    'StaticScreen3'
  ];

  var rows = rowList.getRowsBySession(session);
  var imageBasePath = 'https:\/\/contentimg.s3.amazonaws.com/karbach/mainstudy/';
  var previousType = null;
  var sessionIndex = session - 1;
  var exerciseIndex = 0;

  config.introVideos[sessionIndex] = [];
  config.tutorialVideos[sessionIndex] = [];
  config.staticScreen[sessionIndex] = [];
  config.staticScreen2[sessionIndex] = [];
  config.staticScreen3[sessionIndex] = [];
  config.staticScreen4[sessionIndex] = [];
  config.pseudoChoice[sessionIndex] = [];
  config.preEsScreen[sessionIndex] = [];
  config.postEsScreen[sessionIndex] = [];

  for(var i = 0; i < rows.length; i = i + 1) {
    let row = rows[i];

    switch(row.type) {
      case 'StaticScreen':
      case 'StaticScreen2':
      case 'StaticScreen3':
      case 'StaticScreen4': {
        config[row.type.lowercaseFirstLetter()][sessionIndex][exerciseIndex] = {
          'image': imageBasePath + row.image,
          'text': row.mainText.replace(/\n/g, '<br>').replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', ''),
          'button': 'Weiter'
        };
      } break;
    }

    if (previousType != null && screenFlow.indexOf(row.type) < screenFlow.indexOf(previousType)) {
      console.log(row.type, previousType, exerciseIndex);

      if (!config.introVideos[sessionIndex][exerciseIndex]) {
        config.introVideos[sessionIndex][exerciseIndex] = [];
      }
      if (!config.tutorialVideos[sessionIndex][exerciseIndex]) {
        config.tutorialVideos[sessionIndex][exerciseIndex] = [];
      }
      if (!config.staticScreen[sessionIndex][exerciseIndex]) {
        config.staticScreen[sessionIndex][exerciseIndex] = [];
      }
      if (!config.staticScreen2[sessionIndex][exerciseIndex]) {
        config.staticScreen2[sessionIndex][exerciseIndex] = [];
      }
      if (!config.staticScreen3[sessionIndex][exerciseIndex]) {
        config.staticScreen3[sessionIndex][exerciseIndex] = [];
      }
      if (!config.staticScreen4[sessionIndex][exerciseIndex]) {
        config.staticScreen4[sessionIndex][exerciseIndex] = [];
      }
      if (!config.pseudoChoice[sessionIndex][exerciseIndex]) {
        config.pseudoChoice[sessionIndex][exerciseIndex] = [];
      }
      if (!config.preEsScreen[sessionIndex][exerciseIndex]) {
        config.preEsScreen[sessionIndex][exerciseIndex] = 0;
      }
      if (!config.postEsScreen[sessionIndex][exerciseIndex]) {
        config.postEsScreen[sessionIndex][exerciseIndex] = 0;
      }

      exerciseIndex = exerciseIndex + 1;
      previousType = null;
    } else {
      previousType = row.type;
    }
  }
}