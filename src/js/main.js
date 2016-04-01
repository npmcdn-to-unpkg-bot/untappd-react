import React from 'react';
import ReactDOM from 'react-dom';
import UntappdApp from './components/UntappdApp';

var config = require('../../config.json');

//var _apiURL = config["api_base_url"] + '?client_id=' + config["client_id"] + '&client_secret=' config["client_secret"];

ReactDOM.render(
    <UntappdApp source={config['dummy-load']}/>,
    document.getElementById('main')
);