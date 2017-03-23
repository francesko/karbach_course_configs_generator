var fs = require('fs');
var Row = require('./Row');
var RowList = require('./RowList');
var generateSession = require('./generateSession');
var configPath = './output/config.json';

module.exports = function(rows, totalSessions) {
  var rowList = new RowList();

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

  for(var i = 1; i <= totalSessions; i = i + 1) {
    generateSession(config, rowList, i);
  }

  fs.writeFile(configPath, JSON.stringify(config, null, 2).replace(/https:\/\//g, 'https:\\/\\/'), function (err) {
    if (err) return console.log(err);
  });
};