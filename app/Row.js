var columnMapping = {
  session: 'session',
  type: 'type',
  flowEnd: 'flowend',
  exerciseName: 'exercisename',
  mainText: 'maintext',
  image: 'image',
  button1Text: 'button1text',
  button2Text: 'button2text',
  video1Id: 'video1youtubeid-nameoptionale.g.httpswww.youtube.comwatchvgnebua39mni',
  video2Id: 'video2youtubeid-nameoptionalthisappliestopseudochoicescreenonly',
  video3Id: 'video3youtubeid-nameoptionalthisappliestopseudochoicescreenonly',
  questionnaireId: 'questionnaireidasdefinedinthisspreadsheettabs'
};

function Row(rowData) {
  var self = this;

  for(var key in columnMapping) {
    if (columnMapping.hasOwnProperty(key)) {
      self[key] = rowData[columnMapping[key]];
    }
  }
};

module.exports = Row;