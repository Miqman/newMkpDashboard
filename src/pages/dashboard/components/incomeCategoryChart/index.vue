<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section class="row justify-between">
        <p class="text-h6">Traffic Gross Transaction</p>
        <div class="">
          <q-input v-model="dateFrom">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dateFrom" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-section>
        <apexchart
          ref="chartTiketTrafik"
          height="300"
          type="area"
          :options="chartTiketTrafik.option"
          :series="chartTiketTrafik.series"
        ></apexchart>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import moment from "moment";
import { dataTrafic } from "./dataTiketTrafik.js";
export default {
  name: "LeftRevenueChart",
  data() {
    return {
      dataTrafic,
      dateFrom: moment().format("YYYY-MM-DD"),

      optionSeriesTrafic: {
        options: {},
        series: {},
      },

      dateModel: {
        start: moment().startOf("month").toDate(),
        end: moment().endOf("month").toDate(),
      },
    };
  },
  computed: {
    chartTiketTrafik() {
      const option = {
        colors: ["#EA3546"],
        chart: {
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          bar: {
            // columnWidth: '45%',
            dataLabels: {
              position: "top", // top, center, bottom
            },
            // distributed: true
          },
        },
        markers: {
          size: 5,
        },
        legend: {
          show: true,
        },
        stroke: {
          show: true,
          width: 3,
          curve: "smooth",
          // colors: ['transparent']
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function () {
                return "";
              },
            },
            formatter: function (value) {
              return value;
              //     return value == 0 ? 0 : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              // }
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: 1,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value;
              // return value == 0 ? 0 : formatRupiah(value);
              // return value == 0 ? 0 : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            },
          },
          title: {
            text: "Jumlah Transaksi",
          },
        },
        xaxis: {
          categories: [],
        },
      };

      option.xaxis.categories = this.optionSeriesTrafic.options;

      let series = [];

      if (this.optionSeriesTrafic.series.length > 0) {
        series = this.optionSeriesTrafic.series;
      } else {
        series = [];
      }

      return { option, series };
    },
  },
  methods: {
    chartPerformFormatter(type, index, val) {
      if (type == "komparasi") {
        if ((val = 0)) return 0;
        return (
          "Rp. " +
          this.currencyFormat(
            this.payloadKomparasiGrafik["seriesAmount"][1]["data"][index]
          ) +
          ", " +
          this.payloadKomparasiGrafik["seriesCount"][0]["data"][index] +
          " Trx "
        );
      }
    },
    submitDate(val) {
      console.log(val);
    },
  },

  mounted() {
    this.optionSeriesTrafic.series = this.dataTrafic.series;
    this.optionSeriesTrafic.options = this.dataTrafic.categories;
  },
};
</script>
