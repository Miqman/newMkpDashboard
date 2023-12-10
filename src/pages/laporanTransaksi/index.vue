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
        <!-- <q-breadcrumbs-el label="Laporan" icon="widgets" /> -->
        <q-breadcrumbs-el label="List Transaksi" icon="navigation" />
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
              label="End Date"
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
        <div class="row q-col-gutter-md" v-if="isAnotherFilter">
          <div class="col-12 col-md-6">
            <q-select
              v-model="statusTrx"
              :options="optionStatusTrx"
              label="Status Transaksi"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="kategoriPembayaran"
              :options="optionKategoriPembayaran"
              label="Kategori Pembayaran"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md" v-if="isAnotherFilter">
          <div class="col-12 col-md-6">
            <q-select
              v-model="corporate"
              :options="optionCorporate"
              label="Corporate"
            />
          </div>
        </div>

        <div class="q-my-lg">
          <q-btn
            color="primary"
            glossy
            icon="sync"
            label="Filter"
            no-caps
            @click="submitFilter(dateFrom, dateTo)"
          />
        </div>
      </q-card-section>
    </q-card>
    <!-- filter heeader end -->

    <!-- table start -->
    <q-card class="q-py-md q-mx-lg">
      <q-card-section class="flex justify-between">
        <div class="text-subtitle1">
          <div class="row items-center">
            <q-icon name="assignment" class="q-mr-sm" />
            Transaksi
          </div>
        </div>
        <ExportExcel v-bind="excelDownloadOptions">
          <q-btn
            color="primary"
            glossy
            icon-right="download_for_offline"
            label="Export Excel"
            no-caps
          />
        </ExportExcel>
      </q-card-section>

      <q-card-section class="q-px-lg">
        <q-table
          flat
          bordered
          title="List Transaksi"
          :rows="rowTableListTrx"
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
              <!-- <q-icon name="lock_open" size="1.5em" /> -->
              {{ props.col.label }}
            </q-th>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td>
                {{ props.row.trx_id }}
              </q-td>
              <q-td>
                {{ props.row.trx_date }}
              </q-td>
              <q-td>
                {{ props.row.trx_category }}
              </q-td>
              <q-td>
                {{ props.row.trx_total }}
              </q-td>
              <q-td>
                {{ props.row.trx_status }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <!-- table end -->
  </q-page>
</template>

<script>
import moment from "moment";
import { useAuthStore } from "src/stores/auth-store";
import { mapState, mapActions } from "pinia";
import { useDashboardStore } from "src/stores/dashboard-store";
import ExportExcel from "../../components/ExportExcel.vue";

export default {
  name: "LaporanTransaksi",
  data() {
    return {
      isAnotherFilter: false,
      dateFrom: "",
      dateTo: "",
      openDateFrom: false,
      openDateTo: false,
      dateRange: {
        start: moment().startOf("month").toDate(),
        end: moment().endOf("month").toDate(),
      },

      filter: "",
      statusTrx: "",
      kategoriPembayaran: "",
      corporate: "",

      optionStatusTrx: [
        {
          label: "- Semua Status -",
          value: "",
        },
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Sukses",
          value: "sukses",
        },
        {
          label: "Gagal",
          value: "gagal",
        },
      ],

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
    ...mapState(useAuthStore, ["userMkp"]),
    ...mapState(useDashboardStore, ["listTransaction"]),
    user() {
      return this.userMkp;
    },
    displayDateFrom() {
      return this.dateFrom;
    },
    displayDateTo() {
      return this.dateTo;
    },

    columns() {
      return [
        {
          name: "trx_id",
          label: "id",
          align: "left",
          field: (row) => row.trx_id,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: "trx_date",
          label: "Tanggal",
          align: "left",
          field: (row) => row.trx_date,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: "trx_category",
          label: "Kategori",
          align: "left",
          field: (row) => row.trx_category,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: "trx_total",
          label: "Total",
          align: "left",
          field: (row) => row.trx_total,
          format: (val) => `${val}`,
          sortable: false,
        },
        {
          name: "trx_status",
          label: "Status",
          align: "left",
          field: (row) => row.trx_status,
          format: (val) => `${val}`,
          sortable: false,
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
    rowTableListTrx() {
      return this.listTransaction;
    },

    excelDownloadOptions() {
      let nameExcelFile = "";
      let date = `${this.dateFrom}-${this.dateTo}`;

      nameExcelFile = `${date}_List-Transaksi.xlsx`;

      return {
        worksheet: "Tabel List Transaksi",
        name: nameExcelFile,
        fields: {
          Id: "trx_id",
          Tanggal: "trx_date",
          Kategori: "trx_category",
          Total: "trx_total",
          Status: "trx_status",
        },

        data: this.rowTableListTrx,
      };
    },
  },
  methods: {
    ...mapActions(useDashboardStore, ["getListTrx"]),
    submitDateFrom(date) {
      this.openDateFrom = false;
    },
    submitDateTo(date) {
      this.openDateTo = false;
    },

    async submitFilter(from, to) {
      this.$q.loading.show();
      await this.getListTrx(this.payloadBody());
      this.$q.loading.hide();
    },
    payloadBody() {
      // console.log(this.dateStartEnd, "cek date");
      const userId = this.user.id,
        startDate = this.dateFrom,
        endDate = this.dateTo;
      return {
        userId,
        startDate,
        endDate,
      };
    },
  },
  async mounted() {
    this.$q.loading.show();
    await this.getListTrx(this.payloadBody());
    this.$q.loading.hide();
  },
  beforeMount() {
    this.dateFrom = moment(this.dateRange.start).format("YYYY-MM-DD");
    this.dateTo = moment(this.dateRange.end).format("YYYY-MM-DD");
  },

  components: {
    ExportExcel,
  },
};
</script>
