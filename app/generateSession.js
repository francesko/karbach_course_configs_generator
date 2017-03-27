var utils = require('./utils');
var exercisesConceptIdMap = require('./exercisesConceptIdMap');

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
  var sessionIndex = session - 1;
  var exerciseIndex = 0;

  config.introVideos[sessionIndex] = [];
  config.tutorialVideos[sessionIndex] = [];
  config.staticScreen[sessionIndex] = [];
  config.staticScreen2[sessionIndex] = [];
  config.staticScreen3[sessionIndex] = [];
  config.pseudoChoice[sessionIndex] = [];
  config.preEsScreen[sessionIndex] = [];
  config.postEsScreen[sessionIndex] = [];

  var exercises = [];

  for(var i = 0; i < rows.length; i = i + 1) {
    let row = rows[i];
    let rowName = rowTypeToConfigMapping[row.type];
    let val = null;

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
          'text': utils.prepareText(row.mainText),
          'button': 'Weiter'
        };

        if (row.image) {
          val.image = utils.getImagePath(row.image);
        }
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

      case 'Exercise': {
        if (exercises.indexOf(row.exerciseName) === -1) {
          config.games_map_names.push(row.exerciseName);
          config.games_map.push(exercisesConceptIdMap[row.exerciseName]);
          exercises.push(row.exerciseName);
        }
      } break;
    }

    if (val) {
      config[rowName][sessionIndex][exerciseIndex] = val;
    }

    if (row.flowEnd) {
      exerciseIndex = exerciseIndex + 1;
    }
  }

  // ensure that all config sections have an entry for each exercise
  var maxExercises = 4;

  for(let configSection in config) {
    if (config.hasOwnProperty(configSection) && config[configSection][sessionIndex]) {
      let val = [];

      if (configSection.contains('EsScreen')) {
        val = 0;
      }

      utils.fillInArray(config[configSection][sessionIndex], val, maxExercises);
    }
  }
}