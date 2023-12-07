import { defineStore } from "pinia";
// import axios from "axios";
import { api } from "src/boot/axios";
export const useTransaksiStore = defineStore("counter", {
  state: () => ({
    //dateafterclickbtn
    dateStartEnd: "",

    //dataTrx
    transactionDetail: [],
    recordsTotal: 0,

    //dataStatusCard
    totHargaJual: 0,
    subTotal: 0,
    totPajak: 0,

    // displayDateStatusCard
    dateStatusCard: "",

    //defaultDate
    defaultDate: "",

    //defaultDateFilter
    tglFilter: "",
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async getDataTrx(dataBody) {
      try {
        const { data } = await api({
          url: "/api/req-trx",
          method: "post",
          data: {
            pos: "mkppos",
            username: "admincartenz",
            password: "admincartenz",
            additional1: "10",
            startDate: dataBody.from,
            endDate: dataBody.to,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        let result = data.data;

        if (result) {
          result.forEach(
            (el) => (
              (this.transactionDetail = el.transactionDetails),
              (this.recordsTotal = el.recordsTotal)
            )
          );

          const resultTrx = this.transactionDetail;
          if (resultTrx) {
            this.totHargaJual = 0;
            this.subTotal = 0;
            this.totPajak = 0;
            for (let i = 0; i < resultTrx.length; i++) {
              const e = resultTrx[i];
              this.totHargaJual += +e.totalhargajual;
              this.subTotal += e.subtotal;
              this.totPajak += e.pajak;
            }
          }
        }
      } catch (error) {
        console.log(error);
        console.log(error.response);
      }
    },
  },
});
