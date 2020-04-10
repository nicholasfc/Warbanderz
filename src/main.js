import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "./data/firebaseInit";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

let app;

firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
