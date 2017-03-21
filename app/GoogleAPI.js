var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var Q = require('q');
var googleApiToken = require('../config/google_api_token');
var spreadsheetId = '1Wnd9uVRYHxmO4XQm-Zl7aMqYjlj_fhTh-othbB6uMxI';

var GoogleAPI = {};

GoogleAPI.getScreeFlowData = function(tabIndex) {
  var deferred = Q.defer();
  var doc = new GoogleSpreadsheet(spreadsheetId);
  var sheet;

  async.series([
    function setAuth(step) {
      doc.useServiceAccountAuth(googleApiToken, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo(function(err, info) {
        if (err) {
          deferred.reject(err);
        }
        sheet = info.worksheets[tabIndex];
        step();
      });
    },
    function workingWithRows(step) {
      sheet.getRows({
        offset: 1,
        limit: 1000
      }, function( err, rows ){
        deferred.resolve(rows);
   
        step();
      });
    }
  ]);

  return deferred.promise;
};

module.exports = GoogleAPI;