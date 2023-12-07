<template>
  <q-card>
    <div class="bg-blue-4">
      <h4 class="text-white q-ml-sm">Revenue</h4>
      <p class="text-white q-ml-sm">
        Grafis Revenue <span v-text="'2023'"></span>
      </p>

      <div class="row">
        <div class="col">
          <apexchart
            ref="chartIncome"
            height="165"
            type="area"
            :options="chartIncomeOptions"
            :series="chartIncomeSeries"
          ></apexchart>
        </div>
      </div>
    </div>
    <div class="bg-blue-10">
      <div class="row">
        <div class="col">
          <apexchart
            ref="chartTrx"
            height="165"
            type="area"
            :options="chartTrxOptions"
            :series="chartTrxSeries"
          ></apexchart>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { dataChartIncome } from "./dataChartIncome.js";
export default {
  name: "RightRevenueChart",

  data() {
    return {
      dataChartIncome,
      test: "",
      chartIncomeData: {
        option: "",
        series: "",
      },
      chartTrxData: {
        option: "",
        series: "",
      },
    };
  },

  computed: {
    chartIncomeOptions() {
      const chartOptions = {
        colors: ["#ffffff"],
        chart: {
          toolbar: {
            show: false,
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
              // return value == 0
              //   ? 0
              //   : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
            },
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "Jumlah Omset (Rp)",
            style: {
              color: "#ffffff",
            },
          },
        },
        xaxis: {
          labels: {
            rotate: 0,
            hideOverlappingLabels: true,
            style: {
              colors: "#ffffff",
            },
          },
          categories: [],
        },
      };

      chartOptions.xaxis.categories = this.chartIncomeData.option;
      return chartOptions;
    },
    chartIncomeSeries() {
      const chartSeries = [];
      if (this.chartIncomeData.series.length > 0)
        return this.chartIncomeData.series;
      return chartSeries;
    },
    chartTrxOptions() {
      const chartOptions = {
        colors: ["#ffffff"],
        chart: {
          toolbar: {
            show: false,
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
              // return value == 0 ? 0 : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
            style: {
              colors: "#ffffff",
            },
          },
          title: {
            text: "Jumlah Transaksi (Trx)",
            style: {
              color: "#ffffff",
            },
          },
        },
        xaxis: {
          labels: {
            rotate: 0,
            hideOverlappingLabels: true,
            style: {
              colors: "#ffffff",
            },
          },
          categories: [],
        },
      };

      chartOptions.xaxis.categories = this.chartTrxData.option;
      return chartOptions;
    },
    chartTrxSeries() {
      const chartSeries = [];
      if (this.chartTrxData.series.length > 0) return this.chartTrxData.series;
      return chartSeries;
    },
  },

  mounted() {
    this.chartIncomeData.option = this.dataChartIncome["categories"];
    this.chartIncomeData.series = this.dataChartIncome["seriesAmount"];
    this.chartTrxData.option = this.dataChartIncome["categories"];
    this.chartTrxData.series = this.dataChartIncome["seriesCount"];
  },
};
</script>
