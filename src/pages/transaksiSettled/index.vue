<template>
  <q-page class="q-pa-xs q-px-md q-gutter-md q-pt-lg">
    <div class="flex items-center q-gutter-x-md">
      <h1 class="text-h5">Transaksi List</h1>
      <div class="text-h5 text-weight-thin">|</div>
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="primary" />
        </template>

        <q-breadcrumbs-el
          label=" Home"
          icon="home"
          :to="{ name: 'homePage' }"
        />
        <q-breadcrumbs-el label="Laporan" icon="widgets" />
        <q-breadcrumbs-el label="Settlement Transaction" icon="navigation" />
      </q-breadcrumbs>
    </div>

    <!-- filter heeader start -->
    <q-card class="q-py-md q-mx-lg">
      <q-card-section>
        <div class="text-subtitle1">Filter Data</div>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="displayDateFrom"
              readonly
              label="Start Date"
              @click="openDateFrom = true"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"> </q-icon>
              </template>
              <q-dialog v-model="openDateFrom" persistent>
                <q-date v-model="dateFrom" mask="YYYY-MM-DD" minimal>
                  <div class="row items-center justify-end">
                    <q-btn
                      label="Submit"
                      color="primary"
                      flat
                      no-caps
                      @click="submitDateFrom(dateFrom)"
                    />
                  </div>
                </q-date>
              </q-dialog>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="displayDateTo"
              readonly
              label="Start Date"
              @click="openDateTo = true"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"> </q-icon>
              </template>
              <q-dialog v-model="openDateTo" persistent>
                <q-date v-model="dateTo" mask="YYYY-MM-DD" minimal>
                  <div class="row items-center justify-end">
                    <q-btn
                      label="Submit"
                      color="primary"
                      flat
                      no-caps
                      @click="submitDateTo(dateTo)"
                    />
                  </div>
                </q-date>
              </q-dialog>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="kategoriPembayaran"
              :options="optionKategoriPembayaran"
              label="Kategori Pembayaran"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="corporate"
              :options="optionCorporate"
              label="Corporate"
            />
          </div>
        </div>

        <div class="q-my-lg">
          <q-btn color="primary" glossy icon="sync" label="Filter" no-caps />
        </div>
      </q-card-section>
    </q-card>
    <!-- filter heeader end -->

    <q-card class="q-py-md q-mx-lg">
      <q-card-section class="flex justify-between">
        <div class="text-subtitle1">
          <div class="row items-center">
            <q-icon name="attach_money" class="q-mr-sm" />
            Summary
          </div>
        </div>
        <div>
          <q-btn
            color="primary"
            glossy
            icon-right="picture_as_pdf"
            label="Export Pdf"
            no-caps
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-scroll-area style="height: 600px">
          <div class="horizontal-table">
            <div
              v-for="(item, index) in dataSummary"
              :key="index"
              class="table-row"
            >
              <div
                class="table-cell table-row"
                v-for="(value, key) in item"
                :key="key"
              >
                <div class="row">
                  <div class="col-2">
                    <strong>{{ key }}:</strong>
                  </div>
                  <div class="col">
                    <span class="q-ml-xl">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>

    <!-- table start -->
    <q-card class="q-py-md q-mx-lg">
      <q-card-section class="flex justify-between">
        <div class="text-subtitle1">
          <div class="row items-center">
            <q-icon name="assignment" class="q-mr-sm" />
            Transaksi
          </div>
        </div>
        <div>
          <q-btn
            color="primary"
            glossy
            icon-right="download_for_offline"
            label="Export Excel"
            no-caps
          />
        </div>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <q-table
          flat
          bordered
          title="Treats"
          :rows="rows"
          :columns="columns"
          :filter="filter"
          row-key="name"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:header-cell="props">
            <q-th :props="props">
              <q-icon name="lock_open" size="1.5em" />
              {{ props.col.label }}
            </q-th>
          </template>

          <template v-slot:body-cell="props">
            <q-td :props="props">
              {{ props.value }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <!-- table end -->
  </q-page>
</template>

<script>
import moment from "moment";
export default {
  name: "TransaksiSettled",
  data() {
    return {
      dateFrom: "",
      dateTo: "",
      openDateFrom: false,
      openDateTo: false,

      filter: "",
      kategoriPembayaran: "",
      corporate: "",

      optionKategoriPembayaran: [
        {
          label: "- Semua Kategori Pembayaran -",
          value: "",
        },
        {
          label: "Tunai",
          value: "tunai",
        },
        {
          label: "Lainnya",
          value: "lainnya",
        },
        {
          label: "Cc",
          value: "cc",
        },
        {
          label: "Debit",
          value: "debit",
        },
        {
          label: "Qris",
          value: "qris",
        },
      ],

      optionCorporate: [
        {
          label: "- Semua Corporate -",
          value: "",
        },
        {
          label: "Cartenz",
          value: "cartenz",
        },
      ],
    };
  },
  computed: {
    displayDateFrom() {
      return this.dateFrom;
    },
    displayDateTo() {
      return this.dateTo;
    },

    columns() {
      return [
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true,
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs" },
        { name: "protein", label: "Protein (g)", field: "protein" },
        { name: "sodium", label: "Sodium (mg)", field: "sodium" },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
      ];
    },
    rows() {
      return [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%",
        },
      ];
    },

    dataSummary() {
      return [
        {
          id: 1,
          periode: "05 Desember 2023-05 Desember 2023",
          corporate: "Semua Corporate",
          pembayaran: "Semua Pembayaran",
          status: "Sukses",
          jumlah_transaksi: 0,
          total_tunai: "Rp0.00",
          total_lainnya: "Rp0.00",
          total_cc: "R00,00",
          total_debit: "Rp0.00",
          total_oris: "R00.00",
          total_brizzi: "Rp0,00",
          "total_e-money": "Ro0,00",
          total_topcash: "Rp0.00",
          total_flazz: "Rp0.00",
          total_jakcord: "Rp0.00",
        },
      ];
    },
    columnSummary() {
      return [
        {
          name: "periode",
          label: "Periode",
          align: "left",
          field: "periode",
        },
        {
          name: "corporate",
          label: "Corporate",
          align: "left",
          field: "corporate",
        },
        {
          name: "pembayaran",
          label: "Pembayaran",
          align: "left",
          field: "pembayaran",
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: "status",
        },
        {
          name: "jumlah_transaksi",
          label: "Jumlah Transaksi",
          align: "left",
          field: "jumlah_transaksi",
        },
        {
          name: "total_tunai",
          label: "Total Tunai",
          align: "left",
          field: "total_tunai",
        },
        {
          name: "total_lainnya",
          label: "Total Lainnya",
          align: "left",
          field: "total_lainnya",
        },
        {
          name: "total_cc",
          label: "Total CC",
          align: "left",
          field: "total_cc",
        },
        {
          name: "total_debit",
          label: "Total Debit",
          align: "left",
          field: "total_debit",
        },
        {
          name: "total_oris",
          label: "Total ORIS",
          align: "left",
          field: "total_oris",
        },
        {
          name: "total_brizzi",
          label: "Total Brizzi",
          align: "left",
          field: "total_brizzi",
        },
        {
          name: "total_e-money",
          label: "Total E-Money",
          align: "left",
          field: "total_e-money",
        },
        {
          name: "total_topcash",
          label: "Total TopCash",
          align: "left",
          field: "total_topcash",
        },
        {
          name: "total_flazz",
          label: "Total Flazz",
          align: "left",
          field: "total_flazz",
        },
        {
          name: "total_jakcord",
          label: "Total Jakcord",
          align: "left",
          field: "total_jakcord",
        },
      ];
    },
  },
  methods: {
    submitDateFrom(date) {
      this.openDateFrom = false;
    },
    submitDateTo(date) {
      this.openDateTo = false;
    },
  },
  beforeMount() {
    this.dateFrom = moment().format("YYYY-MM-DD");
    this.dateTo = moment().format("YYYY-MM-DD");
  },
};
</script>

<style scoped>
.horizontal-table {
  display: flex;
  flex-direction: column;
}

.table-row {
  padding: 8px;
}

.table-cell {
  flex: 1;
}

.table-row:nth-child(odd) {
  background-color: #f0f0f0;
}

.table-row:nth-child(even) {
  background-color: #ffffff;
}
</style>
