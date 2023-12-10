import { defineStore } from "pinia";
import { LocalStorage, Notify } from "quasar";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      userMkp: null,
      tokenMkp: "",
    };
  },
  getters: {
    getUser: (state) => state.userMkp,
    getToken: (state) => state.tokenMkp,
  },
  actions: {
    async login(user) {
      // console.log(user, "payload");
      try {
        const { data } = await api({
          method: "post",
          url: "login-user",
          data: user,
        });

        // console.log(data);
        this.userMkp = data.data;
      } catch (error) {
        console.log(error);
        console.log(error.response);
        if (error.response) {
          Notify.create({
            position: "top",
            type: "warning",
            message: error.response.data.message,
            timeout: 2000,
          });
        } else {
          Notify.create({
            position: "top",
            type: "warning",
            message: error.message,
            timeout: 2000,
          });
        }
      } finally {
        if (this.userMkp) {
          Notify.create({
            position: "top-right",
            type: "positive",
            message: "Login Berhasil",
            timeout: 1500,
          });
          this.router.push({ name: "homePage" });
        }
      }
    },

    logout(typeLogout) {
      this.userMkp = null;
      this.tokenMkp = null;
      localStorage.clear();
      LocalStorage.clear();
      this.router.push({ name: typeLogout });
    },
  },
  persist: { paths: ["userMkp", "tokenMkp"] },
});
