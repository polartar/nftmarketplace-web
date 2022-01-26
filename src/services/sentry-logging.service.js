import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import history from "../history";
import { Site24x7LoggingService } from "./site24x7-logging.service";

export class SentryLoggingService {

    static init() {
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
            beforeSend: (event, hint) => {
                event.exception.values.forEach(exception => {
                    Site24x7LoggingService.site24x7ErrorHandler(exception);
                });
            }
        });

    }
}
