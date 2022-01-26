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
import { Provider } from 'react-redux'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import * as serviceWorker from './serviceWorker';
import store from './Store/store';
import history from "./history";

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


Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_DSN,
	debug: process.env.NODE_ENV !== 'production',
	enabled: true,
	release: 'main',
	integrations: [
		new Integrations.BrowserTracing({
			routingInstrumentation: Sentry.reactRouterV5Instrumentation(history)
		})
	],
	normalizeDepth: 20,
	tracesSampleRate: 1.0,
});

ReactDOM.render(
	<Provider store={store}>
			<App />
	</Provider>,
	document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
