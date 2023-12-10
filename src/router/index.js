import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    // const authen = localStorage.getItem("token");
    const authStore = useAuthStore();
    const { getUser } = storeToRefs(authStore);
    const token = getUser.value?.token;

    // const store = useLoginStore();
    // const { tokenUser } = storeToRefs(store);
    // // console.log(tokenUser._object.tokenUser, "<<<<<");
    // const token = tokenUser._object.tokenUser;

    if (to.name === "loginPage" && token) next({ name: "homePage" });
    else if (to.name === "homePage" && !token) next({ name: "loginPage" });
    else next();
  });

  return Router;
});
