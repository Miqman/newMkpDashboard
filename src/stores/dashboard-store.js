import { defineStore } from "pinia";
// import axios from "axios";
import { api } from "src/boot/axios";
import { useAuthStore } from "src/stores/auth-store";
export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    //dateafterclickbtn
    dateStartEnd: "",

    //dataTrx
    transactionCategory: [],
    listTransaction: [],

    // displayDateStatusCard
    dateStatusCard: "",

    //defaultDate
    defaultDate: "",
  }),
  getters: {},
  actions: {
    async getDataTrx(dataBody) {
      const authStore = useAuthStore();
      // console.log(dataBody, "cek payload");
      const { userId, startDate, endDate } = dataBody;
      const url = `dashboard-data/${userId}/${startDate}/${endDate}`;
      try {
        const { data } = await api({
          url: url,
          method: "get",
        });

        // console.log(data, "respon api dashboard");

        this.transactionCategory = data.data;
      } catch (error) {
        console.log(error);
        console.log(error.response);
        if (
          error.response.data.message == "jwt expired" ||
          error.response.data.status == 400
        ) {
          authStore.logout("loginPage");
        }
      }
    },
    async getListTrx(dataBody) {
      const authStore = useAuthStore();
      // console.log(dataBody, "cek payload");
      const { userId, startDate, endDate } = dataBody;
      const url = `list-transactions/${userId}/${startDate}/${endDate}`;
      try {
        const { data } = await api({
          url: url,
          method: "get",
        });

        // console.log(data, "respon api dashboard");

        this.listTransaction = data.data;
      } catch (error) {
        console.log(error);
        console.log(error.response);
        if (
          error.response.data.message == "jwt expired" ||
          error.response.data.status == 400
        ) {
          authStore.logout("loginPage");
        }
      }
    },
  },
});
