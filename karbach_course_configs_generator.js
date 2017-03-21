var fs = require('fs');
var Q = require('q');
var Row = require('./app/Row');
var RowList = require('./app/RowList');
var GoogleAPI = require('./app/GoogleAPI');
var configPath = './output/config.json';

var tabs = {
  'motivational_1': 0,
  'motivational_2': 1,
  'motivational_3': 2,
  'unmotivational_1': 3,
  'unmotivational_2': 4,
  'unmotivational_3': 5,
};
 
var rowList = new RowList();

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

function generateSession(config, rowList, session) {
  var rows = rowList.getRowsBySession(session);
  var imageBasePath = "https:\/\/contentimg.s3.amazonaws.com/karbach/mainstudy/";

  for(var i = 0; i < rows.length; i = i + 1) {
    let row = rows[i];

    switch(row.type) {
      case 'Welcome':
      case 'Text':  {
        if (i == 0) {
          config.staticScreen[session - 1] = [
            {
              "image": imageBasePath + row.image,
              "text": row.mainText.replace(/\n/g, '<br>').replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', ''),
              "button": 'Weiter'
            },
            [],
            [],
            []
          ];
        }
      } break;

      case 'Video': {

      } break;

      case 'Points': {

      } break;
    }
  }
}

function generateConfig(rows, totalSessions) {
  var config = {
    games_map_names: [],
    games_map: [],
    games_plan: [],
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

  rows.forEach(function(rowData) {
    var row = new Row(rowData);
    
    if (row.type !== 'Start Course') {
      rowList.add(row);
    }
  });

  for(var i = 1; i <= totalSessions; i = i + 1) {
    generateSession(config, rowList, i)
  }

  fs.writeFile(configPath, JSON.stringify(config, null, 4), function (err) {
    if (err) return console.log(err);
  });
}