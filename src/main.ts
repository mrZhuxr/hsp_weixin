import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '../mock'

// eslint-disable-next-line import/prefer-default-export
// import VConsole from 'vconsole'
// const vConsole = new VConsole({ theme: 'dark' })

export function createApp() {
    const app = createSSRApp(App).use(createPinia())
    return {
        app
    }
}
