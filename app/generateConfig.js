var fs = require('fs');
var Row = require('./Row');
var RowList = require('./RowList');
var generateSession = require('./generateSession');

module.exports = function(rows, totalSessions, outputPath) {
  var rowList = new RowList();

  rows.forEach(function(rowData) {
    var row = new Row(rowData);
    
    if (row.type !== 'Start Course') {
      rowList.add(row);
    }
  });

  var config = {
    games_map_names: [],
    games_map: [],
    games_plan: [],
    introVideos: [],
    tutorialVideos: [],
    staticScreen: [],
    staticScreen2: [],
    staticScreen3: [],
    pseudoChoice: [],
    preEsScreen: [],
    postEsScreen: []
  };

  for(let sessionIndex = 1; sessionIndex <= totalSessions; sessionIndex = sessionIndex + 1) {
    generateSession(config, rowList, sessionIndex);
  }

  var gameIndex1 = 0;
  var gameIndex2 = 1;

  for(let sessionIndex = 1; sessionIndex <= totalSessions; sessionIndex = sessionIndex + 1) {
    config.games_plan[sessionIndex - 1] = Array.apply(null, new Array(config.games_map.length)).map(Number.prototype.valueOf, 0);
    config.games_plan[sessionIndex - 1][gameIndex1] = 2;
    config.games_plan[sessionIndex - 1][gameIndex2] = 2;
    gameIndex1 = gameIndex1 + 2;
    gameIndex2 = gameIndex2 + 2;
  }

  fs.writeFile(outputPath, JSON.stringify(config, null, 2).replace(/https:\/\//g, 'https:\\/\\/'), function (err) {
    if (err) return console.log(err);
  });
};