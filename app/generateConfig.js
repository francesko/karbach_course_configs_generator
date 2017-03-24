var fs = require('fs');
var utils = require('./utils');
var generateSession = require('./generateSession');
var Row = require('./Row');
var RowList = require('./RowList');

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
    games_groups: [],
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

  for(let sessionIndex = 1; sessionIndex <= totalSessions; sessionIndex = sessionIndex + 1) {
    config.games_plan.push(utils.getGamesPlan(config.games_map, sessionIndex));
  }

  config.games_groups = utils.getGamesGroups(config.games_map);

  fs.writeFile(outputPath, JSON.stringify(config, null, 2).replace(/https:\/\//g, 'https:\\/\\/'), function (err) {
    if (err) return console.log(err);
  });
};