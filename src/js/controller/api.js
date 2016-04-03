"use strict";

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let nyfrbURL ='https://api.untappd.com/v4/beer/checkins/867402?client_id=D61A064777B99988FC78379C3DD54B4DC6D06156&client_secret=DD849EE330F363C397616097FF4487CBE7DFFCCA';
let nyfgaURL ='https://api.untappd.com/v4/beer/checkins/1297475?client_id=D61A064777B99988FC78379C3DD54B4DC6D06156&client_secret=DD849EE330F363C397616097FF4487CBE7DFFCCA';

function getURL(url) {

  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.responseText);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });


}

module.exports.getURL = getURL;

