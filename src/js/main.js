import React from 'react';
import ReactDOM from 'react-dom';
import UntappdApp from './components/UntappdApp';

var config = require('../../config.json');

//var _apiURL = config['api_url'];

ReactDOM.render(
    <UntappdApp source={config['api_url']}/>,
    document.getElementById('main')
);