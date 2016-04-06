"use strict";

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function getURL(url) {

  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {

      if (req.status == 200) {

        resolve(req.responseText);
      }
      else {

        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });

}

module.exports.getURL = getURL;

