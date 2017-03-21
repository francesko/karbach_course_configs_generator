var fs = require('fs');
var Q = require('q');
var Row = require('./app/Row');
var GoogleAPI = require('./app/GoogleAPI');
var configPath = './output/config.json';

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

var tabs = {
  'motivational_1': 0,
  'motivational_2': 1,
  'motivational_3': 2,
  'unmotivational_1': 3,
  'unmotivational_2': 4,
  'unmotivational_3': 5,
};

GoogleAPI.getScreeFlowData(tabs['motivational_1'])
.then(function(rows){
  console.log(new Row(rows[0]));

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