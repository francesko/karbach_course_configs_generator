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
      .replace(/\n/g, '<br>')
      .replace(/\r/g, '<br>')
      .replace('\n\nWenn du die ganze Geschichte noch einmal hören möchtest, klicke auf „nochmal anhören“\nWenn du mit dem Spiel weitermachen möchtest klicke auf „weiter“\n', '');
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
  }

};