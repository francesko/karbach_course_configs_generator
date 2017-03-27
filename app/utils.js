module.exports = {
  fillInArray: function(array, val, maxSize) {
    while(array.length < maxSize) {
      array.push(val);
    }

    for(var i = 0, len = array.length; i < len; i = i + 1) {
      let item = array[i];

      if (item == null) {
        array[i] = val;
      }
    }

    return array;
  },

  prepareText: function(text) {
    return text
      .replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', '')
      .replace(/\n/g, '<br>')
      .replace(/\r/g, '<br>');
  },

  getImagePath: function(imageFileName) {
    return 'https:\/\/contentimg.s3.amazonaws.com/karbach/mainstudy/' + imageFileName;
  },

  getYoutubeId: function(videoUrl) {
    return videoUrl.replace('https://youtu.be/', '');
  },

  getExerciseConceptIdMap: function(rows) {
    return rows.reduce(function(memo, row) {
      memo[row.name] = row.conceptid;

      return memo;
    }, {});
  },

  getGamesPlan: function(gamesMap, sessionIndex) {
    var sessionGamesPlan = Array.apply(null, new Array(gamesMap.length)).map(Number.prototype.valueOf, 0);

    sessionIndex = sessionIndex - 1;

    var gameIndex1 = (sessionIndex === 0) ? 0 : (sessionIndex * 2);
    var gameIndex2 = (sessionIndex === 0) ? 1 : (sessionIndex * 2 + 1);

    sessionGamesPlan[gameIndex1] = 2;
    sessionGamesPlan[gameIndex2] = 2;

    return sessionGamesPlan;
  },

  getGamesGroups: function(gamesMap) {
    var gamesGroups = gamesMap.reduce(function(memo, conceptId) {
      var groupName = conceptId.replace(/[0-9]?_ID/, '');

      if (!memo[groupName]) {
        memo[groupName] = [];
      }

      if (memo[groupName].indexOf(conceptId) === -1) {
        memo[groupName].push(conceptId);
      }

      memo[groupName].sort();

      return memo;
    }, {});

    return Object.keys(gamesGroups).map(function (key) { 
      return gamesGroups[key]; 
    });
  }

};
