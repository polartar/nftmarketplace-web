export class Site24x7LoggingService {
    static s = '//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=';

    static r = 's247r';

    static init() {
        function initSite24x7ErrorLogging(appWindow, appDocument,  s, r, key) {

            (function(appWindow,appDocument,url,s247r,k,h,m){
                if(appWindow.performance && appWindow.performance.timing && appWindow.performance.navigation) {
                    appWindow[s247r] = appWindow[s247r] || function(){(appWindow[s247r].q = appWindow[s247r].q || []).push(arguments)};
                    h=appDocument.createElement('script');h.async=true;h.setAttribute('src',url+k);
                    appDocument.getElementsByTagName('head')[0].appendChild(h);
                    (m = window.onerror);
                    (window.onerror = function (b, c, d, f, g) {
                        m && m(b, c, d, f, g);
                        g || (g = new Error(b));
                        (appWindow[s247r].q = appWindow[s247r].q || []).push(["captureException",g]);})
                }
            })(window,document,'//static.site24x7rum.com/beacon/site24x7rum-min.js?appKey=','s247r',key);

            // if (!appWindow.performance || !appWindow.performance.timing || !appWindow.performance.navigation || !key) {
            //     console.warn('Cannot initialize 24x7 error logging');
            //     return;
            // }
            //
            // const headScript = appDocument.getElementsByTagName('head')[0];
            // const script = appDocument.createElement('script');
            //
            // script.async = true;
            // script.setAttribute('src', s + key);
            //
            // if (!appWindow[r]) {
            //     appWindow[r] = function () {
            //         if (appWindow[r].q) {
            //             appWindow[r].q.push(arguments);
            //         }
            //     };
            // }
            //
            // headScript.appendChild(script);
        }

        initSite24x7ErrorLogging(window, document, Site24x7LoggingService.s, Site24x7LoggingService.r, process.env.REACT_APP_SITE24X7_KEY);
    }

    static site24x7ErrorHandler = function (error) {
        if (window.s247r) {
            window.s247r('captureException',error);
        }
        // if (window[Site24x7LoggingService.r].q) {
        //     window[Site24x7LoggingService.r].q.push([ "captureException", error ]);
        // } else {
        //     console.warn(`window.${ Site24x7LoggingService.r }.q is not defined`);
        // }
    };

}
