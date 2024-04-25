import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/config/element.config'

import VueDataDict from 'vue3-data-dict'
import dict from '@/plugins/dict'

import * as Sentry from '@sentry/vue'

import MyPagination from '@/components/MyPagination'
import IconSelect from '@/components/IconSelect'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component(MyPagination.__name, MyPagination)
app.component(IconSelect.__name, IconSelect)

Sentry.setTag('env', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    app,
    dsn: 'https://9b26310b0d0e5e3ec2bfe0927a85d696@o4505568238632960.ingest.us.sentry.io/4507142274285568',
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    // tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    tracePropagationTargets: ['localhost', 'gitwd.com'],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(VueDataDict, dict)

app.mount('#app')
