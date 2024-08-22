import Vuex, { Store } from "vuex";
import Vue from "vue";

import appInfo from "@/store/modules/appInfo";
import login from "@/store/modules/login";
import errors from "@/store/modules/errors";

Vue.use(Vuex);

export default new Store({
  modules: {
    appInfo,
    login,
    errors,
  },
  strict: process.env.NODE_ENV !== "production",
});
