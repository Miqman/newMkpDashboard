<template>
  <q-card>
    <q-card-section>
      <p class="text-h5">REVENUE</p>
      <p class="text-body2 text-grey-6 q-mt-none">
        Grafis Revenue (Nominal dan Jumlah trx)
      </p>
      <div class="column text-center q-mt-sm">
        <p class="text-h6 text-grey-8">Komparasi Summary Omset - Transaksi</p>
        <p class="" style="font-size: 14px" v-text="'2023'"></p>
      </div>
    </q-card-section>

    <q-card-section>
      <apexchart
        height="300"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "LeftRevenueChart",
  data() {
    return {
      options: {
        chart: {
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        colors: ["#fe4661"],
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        legend: {
          show: false,
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
            formatter: function (
              val,
              { series, seriesIndex, dataPointIndex, w }
            ) {
              return val;
              // return app.chartPerformFormatter('komparasi', dataPointIndex, val)
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value;
              //   return value == 0 ? 0 : formatRupiah(value);
            },
          },
          title: {
            text: "Jumlah Omset (Rp)",
          },
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
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
  },
};
</script>
