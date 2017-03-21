var fs = require('fs');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var Q = require('q');

var configPath = './output/config.json';

var columnMapping = {
  session: 'session',
  type: 'type',
  exerciseName: 'exercisename',
  mainText: 'maintext',
  image: 'image',
  button1Text: 'button1text',
  button2Text: 'button2text',
  video1Id: 'video1youtubeid-nameoptionale.g.httpswww.youtube.comwatchvgnebua39mni',
  video2Id: 'video2youtubeid-nameoptionalthisappliestopseudochoicescreenonly',
  questionnaireId: 'questionnaireidasdefinedinthisspreadsheettabs',
};

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

function Row(rowData) {
  var self = this;

  for(var key in columnMapping) {
    if (columnMapping.hasOwnProperty(key)) {
      self[key] = rowData[columnMapping[key]];
    }
  }
};

function getScreeFlowData() {
  var deferred = Q.defer();
  var doc = new GoogleSpreadsheet('1Wnd9uVRYHxmO4XQm-Zl7aMqYjlj_fhTh-othbB6uMxI');
  var sheet;

  async.series([
    function setAuth(step) {
      var creds = require('./config/google_api_token');
      doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        if (err) {
          deferred.reject(err);
        }
        sheet = info.worksheets[0];
        step();
      });
    },
    function workingWithRows(step) {
      // google provides some query options 
      sheet.getRows({
        offset: 1,
        limit: 1
      }, function( err, rows ){
        console.log('Read '+rows.length+' rows');

        rows.forEach(function(rowData) {
          var row = new Row(rowData);
          console.log(row);
        });
   
        step();
      });
    }
  ]);

  return deferred.promise;
};

getScreeFlowData()
.then(function(urls){
  // fs.writeFile(configPath, JSON.stringify(urls), function (err) {
  //   if (err) return console.log(err);
  // });
})
.catch(function(err){
  console.log('error', err);
})
.done(function(){
  console.log('done');
});