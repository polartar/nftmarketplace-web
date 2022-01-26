export class Site24x7LoggingService {
    static init() {
        function initSite24x7ErrorLogging(appWindow, appDocument,  s, r, key) {
            if (!appWindow.performance || !appWindow.performance.timing || !appWindow.performance.navigation || !key) {
                console.warn('Cannot initialize 24x7 error logging');
                return;
            }

            const headScript = appDocument.getElementsByTagName('head')[0];
            const script = appDocument.createElement('script');

            script.async = true;
            script.setAttribute('src', s + key);

            if (!appWindow[r]) {
                appWindow[r] = function () {
                    if (appWindow[r].q) {
                        appWindow[r].q.push(arguments);
                    }
                };
            }

            const site24x7ErrorHandler = function (message, source, lineno, colno, error = new Error(message)) {
                if (appWindow[r].q) {
                    appWindow[r].q.push([ "captureException", error ]);
                }
            };

            appWindow.onerror = site24x7ErrorHandler
            headScript.appendChild(script);
        }
        initSite24x7ErrorLogging(window, document, '//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=', 's247r', process.env.REACT_APP_SITE24X7_KEY);
    }
}
