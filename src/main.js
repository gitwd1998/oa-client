import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueDataDict from 'vue3-data-dict'
// import * as Sentry from '@sentry/vue'
// import SentryRRWeb from '@sentry/rrweb'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import '@/config/element.config'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import MyPagination from '@/components/MyPagination'
import IconSelect from '@/components/IconSelect'
import { dictOptionList } from '@/apis/dict'

export const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component(MyPagination.__name, MyPagination)
app.component(IconSelect.__name, IconSelect)

app.use(VueDataDict, {
  metas: {
    '*': {
      request({ type: dictKey }) {
        return new Promise((resolve) => {
          dictOptionList({ dictKey }).then((res) => {
            if (res.code === '000000') resolve(res.data || [])
            else resolve([])
          }).catch((err) => {
            console.error(err)
          })
        })
      },
      labelField: 'dictOptionLabel',
      valueField: 'dictOptionValue',
      lazy: false,
      lookup: false,
    }
  }
})

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     app,
//     dsn: 'https://713cc4968fa14de5a3821aca1ae4598e@o4505568238632960.ingest.sentry.io/4505573305745408',
//     integrations: [
//       new Sentry.BrowserTracing({
//         // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//         tracePropagationTargets: ['localhost'],
//         routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       }),
//       new Sentry.Replay({
//         // Additional SDK configuration goes in here, for example:
//         maskAllText: true,
//         blockAllMedia: true,
//       }),
//       // new SentryRRWeb({
//       //   checkoutEveryNms: 10 * 1000, // 每10秒重新制作快照
//       //   checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
//       //   maskAllInputs: false, // 将所有输入内容记录为 *
//       // }),
//     ],
//     // Performance Monitoring
//     tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
//     // Session Replay
//     replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//     replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//   })
// }

app.use(store)
app.use(router)
app.use(ElementPlus)


app.mount('#app')
