import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import history from "../history";

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
        });

    }
}
