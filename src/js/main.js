import React from 'react';
import ReactDOM from 'react-dom';
import UntappdApp from './components/UntappdApp';

var config = require('../../config.json');

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

//var _apiURL = config['api_url'];

ReactDOM.render(
    <UntappdApp source={"https://api.untappd.com/v4/beer/checkins/867402?client_id=D61A064777B99988FC78379C3DD54B4DC6D06156&client_secret=DD849EE330F363C397616097FF4487CBE7DFFCCA"}/>,
    document.getElementById('main')
);