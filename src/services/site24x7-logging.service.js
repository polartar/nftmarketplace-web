export class Site24x7LoggingService {
    static s = '//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=';

    static r = 's247r';

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

            const oldOnError = window.onerror;

            window.onerror = function (b, c, d, f, g) {
                if (oldOnError) {
                    oldOnError(b, c, d, f, g);
                }
                if (!window[Site24x7LoggingService.r].q) {
                    window[Site24x7LoggingService.r].q = [];
                }

                const exception = g || new Error(b);

                window[Site24x7LoggingService.r].q.push([ "captureException", exception ]);
            };

            headScript.appendChild(script);
        }

        initSite24x7ErrorLogging(window, document, Site24x7LoggingService.s, Site24x7LoggingService.r, process.env.REACT_APP_SITE24X7_KEY);
    }

    static site24x7ErrorHandler = function (error) {
        if (window[Site24x7LoggingService.r].q) {
            window[Site24x7LoggingService.r].q.push([ "captureException", error ]);
        } else {
            console.warn(`window.${ Site24x7LoggingService.r }.q is not defined`);
        }
    };

}
