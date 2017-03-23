var async = require('async');
var Q = require('q');
var GoogleSpreadsheet = require('google-spreadsheet');
var googleApiToken = require('../config/google_api_token');

var GoogleAPI = {};

GoogleAPI.getScreeFlowData = function(tabIndex) {
  var deferred = Q.defer();
  var doc = new GoogleSpreadsheet('1Wnd9uVRYHxmO4XQm-Zl7aMqYjlj_fhTh-othbB6uMxI');
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

GoogleAPI.getExercisesData = function() {
  var deferred = Q.defer();
  var doc = new GoogleSpreadsheet('10BjnDTZxtCzG35tq3s16v6B27KGOsoJvJkMAaxy17RA');
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
        sheet = info.worksheets[0];
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