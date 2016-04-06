import React from 'react';
import ReactDOM from 'react-dom';
import UntappdApp from './components/UntappdApp';

var config = require('../../config.json');

import injectTapEventPlugin from 'react-tap-event-plugin';

/**
 * For Material UI to work for some reason.
 */
/**

	TODO:
	- Look into why I need this now

 */

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

//var _apiURL = config['api_url'];

ReactDOM.render(
    <UntappdApp />,
    document.getElementById('main')
);