import React from 'react';
import ReactDOM from 'react-dom';
import "./Assets/animated.css";
import '../node_modules/elegant-icons/style.css';
import '../node_modules/et-line/style.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import 'react-toastify/dist/ReactToastify.css';
import './Assets/style.scss';
import './Assets/style_grey.scss';
import './Assets/override.scss'
import App from './App';
import * as serviceWorker from './serviceWorker';

//redux store
import { Provider } from 'react-redux'
import store from './Store/store';

// import Bugsnag from '@bugsnag/js'
// import BugsnagPluginReact from '@bugsnag/plugin-react'

function initSite24x7ErrorLogging(s, r, key) {
	if (!window.performance || !window.performance.timing || !window.performance.navigation || !key) {
		console.warn('Cannot initialize 24x7 error logging');
		return;
	}

	const headScript = document.getElementsByTagName('head')[0];
	const script = document.createElement('script');

	script.async = true;
	script.setAttribute('src', s + key);

	if (!window[r]) {
		window[r] = function () {
			if (window[r].q) {
				window[r].q.push(arguments);
			}
		};
	}

	window.onerror = function (message, source, lineno, colno, error = new Error(message)) {
		if (window[r].q) {
			window[r].q.push([ "captureException", error ]);
		}
	}

	headScript.appendChild(script);
}

initSite24x7ErrorLogging('//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=', 's247r', process.env.REACT_APP_SITE24X7_KEY);


// Bugsnag.start({
// 	apiKey: '2930ae7912b5df1173da9e102e6f91cd',
// 	plugins: [new BugsnagPluginReact()]
// })

// const ErrorBoundary = Bugsnag.getPlugin('react')
// 	.createErrorBoundary(React)

ReactDOM.render(
	<Provider store={store}>
		{/*<ErrorBoundary>*/}
			<App />
		{/*</ErrorBoundary>*/}
	</Provider>, 
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
