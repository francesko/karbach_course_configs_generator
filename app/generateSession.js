var utils = require('./utils');

const screenFlow = [
  'StaticScreen',
  'IntroVideo',
  'PreES',
  'PseudoChoice',
  'PreESVideo',
  'Exercise',
  'StaticScreen2',
  'PostES',
  'PostESVideo',
  'Questionnaire',
  'StaticScreen3'
];

const rowTypeToConfigMapping = {
  'StaticScreen': 'staticScreen',
  'IntroVideo': 'introVideos',
  'PreES': 'preEsScreen',
  'PseudoChoice': 'pseudoChoice',
  'PreESVideo': 'tutorialVideos',
  'Exercise': 'game',
  'StaticScreen2': 'staticScreen2',
  'PostES': 'postEsScreen',
  'PostESVideo': 'tutorialVideos',
  'Questionnaire': 'questionnaire',
  'StaticScreen3': 'staticScreen3'
};

module.exports = function(config, rowList, session) {
  var rows = rowList.getRowsBySession(session);
  var previousType = null;
  var sessionIndex = session - 1;
  var previousExerciseIndex = 0;
  var exerciseIndex = 0;

  config.introVideos[sessionIndex] = [];
  config.tutorialVideos[sessionIndex] = [];
  config.staticScreen[sessionIndex] = [];
  config.staticScreen2[sessionIndex] = [];
  config.staticScreen3[sessionIndex] = [];
  config.pseudoChoice[sessionIndex] = [];
  config.preEsScreen[sessionIndex] = [];
  config.postEsScreen[sessionIndex] = [];

  for(var i = 0; i < rows.length; i = i + 1) {
    let row = rows[i];
    let rowName = rowTypeToConfigMapping[row.type];
    let val = null;

    if (previousType != null && screenFlow.indexOf(row.type) < screenFlow.indexOf(previousType)) {
      previousExerciseIndex = exerciseIndex;
      exerciseIndex = exerciseIndex + 1;
      previousType = null;
    } else {
      previousType = row.type;
    }

    switch(row.type) {
      case 'IntroVideo': {
        val = [utils.getYoutubeId(row.video1Id)];
      } break;

      case 'PreESVideo':
      case 'PostESVideo': {
        if(!config[rowName][sessionIndex][exerciseIndex]) {
          config[rowName][sessionIndex][exerciseIndex] = [];
        }

        let index = row.type.contains('Pre') ? 0 : 1;

        config[rowName][sessionIndex][exerciseIndex][index] = utils.getYoutubeId(row.video1Id);

        if (index === 1 && config[rowName][sessionIndex][exerciseIndex][0] == null) {
          config[rowName][sessionIndex][exerciseIndex][0] = '';
        }
      } break;

      case 'StaticScreen':
      case 'StaticScreen2':
      case 'StaticScreen3': {
        val = {
          'image': utils.getImagePath(row.image),
          'text': utils.prepareText(row.mainText)
            ,
          'button': 'Weiter'
        };
      } break;

      case 'PseudoChoice': {
        val = {
          "image": utils.getImagePath(row.image),
          "video": utils.getYoutubeId(row.video1Id),
          "text": utils.prepareText(row.mainText),
          "choices": [
            {
              "buttonText": row.button1Text,
              "video": utils.getYoutubeId(row.video2Id)
            },
            {
              "buttonText": row.button2Text,
              "video": utils.getYoutubeId(row.video3Id)
            }
          ]
        };
      } break;

      case 'PreES':
      case 'PostES': {
        config[rowName][sessionIndex][exerciseIndex] = 1;
      } break;
    }

    if (val) {
      config[rowName][sessionIndex][exerciseIndex] = val;
    }

    // increase exercise index and fill in entries for missing screens
    if (previousExerciseIndex != exerciseIndex) {
      for(let configSection in config) {
        if (config.hasOwnProperty(configSection) && !config[configSection][sessionIndex][exerciseIndex]) {
          let val = [];

          if (configSection.contains('EsScreen')) {
            val = 0;
          }

          config[configSection][sessionIndex][exerciseIndex] = val;
        }
      }
    }
  }

  // ensure that all config sections have an entry for each exercise
  var maxExercises = 4;

  for(let configSection in config) {
    if (config.hasOwnProperty(configSection)) {
      let val = [];

      if (configSection.contains('EsScreen')) {
        val = 0;
      }

      utils.fillInArray(config[configSection][sessionIndex], val, maxExercises);
    }
  }
}