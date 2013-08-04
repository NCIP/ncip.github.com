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

  that.getJSONIfModified = function(uri,successFunction) {

    NCIPGlobal.namespace('repos');
    NCIPGlobal.namespace('cache.date');

    NCIPGlobal.cache.date = window.localStorage.getItem('NCIPDate');

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (xhr.readyState === 4) {

        var result = {};

        result.data = xhr.responseText;
        result.status = xhr.status;
        result.responseHeaders = xhr.getAllResponseHeaders();

        console.log('ncipnamespace xhr result');
        console.log(result);

        successFunction(result);
        }

      }

    xhr.open('get',uri,true);
    xhr.setRequestHeader('If-Modified-Since',NCIPGlobal.cache.date);

    xhr.send(null);

    };

  return that;

}());
