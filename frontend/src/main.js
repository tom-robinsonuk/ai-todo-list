import { createApp } from "vue";
import App from "./App.vue";

import { createVuetify } from "vuetify";
import "vuetify/styles"; // Import Vuetify styles

const vuetify = createVuetify(); // Create Vuetify instance

const app = createApp(App);

app.use(vuetify);
app.mount("#app");
