/// ncipnamespace
///
/// Copyright 2013 Kitware Inc.
/// Apache 2.0 License
///
/// Writen after example from "JavaScript Patterns", pages 89-90.
///

window.NCIPGlobal = (function () {

  var that = {};

  that.namespace = function(ns_string) {

    var parts = ns_string.split('.'),
        parent = NCIPGlobal,
        i;

    // strip redundant leading global
    if (parts[0] === "NCIPGlobal" ) {
      parts = parts.slice(1);
      }

    for (i = 0; i < parts.length; i += 1) {
      // create a property if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
        }
      // insert the property in a nested pattern
      parent = parent[parts[i]];
      }

    return parent;

    };

  that.getJSONIfModified = function(uri,sinceDate,successFunction) {

    function clientSideUpdate() {

        if (xhr.readyState === 4) {

          var result = {};

          if (xhr.status===200) {
            result.data = JSON.parse(xhr.responseText);
            }

          result.status = xhr.status;
          result.lastModified = xhr.getResponseHeader('Last-Modified');

          successFunction(result);
          }

        }

    NCIPGlobal.namespace('cache.repos');
    NCIPGlobal.namespace('cache.reposDate');
    NCIPGlobal.namespace('cache.members');
    NCIPGlobal.namespace('cache.membersDate');

    var xhr = new XMLHttpRequest();

    xhr.open('get',uri,true);

    xhr.onreadystatechange = clientSideUpdate;

    if (sinceDate) {
      xhr.setRequestHeader('If-Modified-Since',sinceDate);
      }

    xhr.send(null);

    };

  that.getCachedRepositories = function() {
    var cachedRepos = window.localStorage.getItem('NCIPrepos');
    if (cachedRepos) {
      NCIPGlobal.cache.repos = JSON.parse(cachedRepos);
      var repos = NCIPGlobal.cache.repos;
      return repos;
      }
    return null;
    };

  that.getCachedMembers = function() {
    var cachedMembers = window.localStorage.getItem('NCIPmembers');
    if (cachedMembers) {
      NCIPGlobal.cache.members = JSON.parse(cachedMembers);
      var members = NCIPGlobal.cache.members;
      return members;
      }
    return null;
    };

  return that;

}());
