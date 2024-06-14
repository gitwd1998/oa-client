import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import ui from '@/plugins/ui'
import dict from '@/plugins/dict'
import local from '@/plugins/local'
import sentry from '@/plugins/sentry'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ui)
app.use(dict)
app.use(local)
app.use(sentry)

app.mount('#app')
