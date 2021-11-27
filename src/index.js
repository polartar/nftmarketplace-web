import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './Store/store'
import { Provider } from 'react-redux'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: '2930ae7912b5df1173da9e102e6f91cd',
  plugins: [new BugsnagPluginReact()]
})

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

ReactDOM.render(
  <Provider store={store}>
     <ErrorBoundary>
    <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
