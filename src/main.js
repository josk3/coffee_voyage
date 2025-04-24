import {
	createSSRApp
} from "vue";
import { createPinia } from 'pinia';
import store from './store';

import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();
	app.use(pinia);
	app.use(store);
	return {
		app,
		pinia,
	};
}