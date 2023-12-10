<template>
  <q-page class="q-pa-xs q-px-lg q-gutter-md">
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">No Rek {{ curRek }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="newRek"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="saveNoRek" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-px-md text-h6 text-weight-regular" style="font-size: 22px">
      DASHBOARD ANALISIS
    </div>
    <div class="flex items-center q-gutter-md">
      <!-- filter heeader start -->

      <!-- <div>
        <q-select
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Simple filter"
          :options="options"
          @filter="filterFn"
          style="width: 250px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div> -->

      <!-- filter heeader End -->

      <div>
        <DatePicker></DatePicker>
      </div>
      <div>
        <q-btn
          color="primary"
          icon="sync"
          glossy
          label="Filter"
          @click="filterHandler"
        />
      </div>
    </div>

    <!-- start card status header -->
    <div class="row q-gutter-md q-mb-xl">
      <div
        class="col-md col-xs-12 q-pa-md"
        style="background: linear-gradient(to bottom right, #37d5d6, #36096d)"
        v-for="(item, index) in cardSummaryData"
        :key="index"
      >
        <div class="q-mb-lg">
          <span
            class="text-white rounded bgOpacity q-px-md q-py-xs"
            style="font-size: 16px"
            >{{ item.trx_category }}</span
          >
        </div>

        <div class="text-right q-gutter-sm">
          <div
            class="col-6 text-white text-weight-regular"
            style="font-size: 28px"
          >
            {{ formatRp(item.total_trx) }}
          </div>
          <!-- <div class="">
            <div class="text-white" style="font-size: 14px">
              <q-btn
                @click="
                  curRek = 'DPP';
                  prompt = true;
                  newRek = rekeningDpp;
                "
                rround
                color="white"
                icon="edit"
                flat
                size="sm"
              />
              No Rek : ******{{ rekeningDpp.substring(6) }}
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <!-- end card status header -->

    <RevenueChart v-if="showOtherData" />

    <IncomeCategoryChart v-if="showOtherData" />

    <!-- start table -->
    <div class="q-pa-md" v-if="showOtherData">
      <q-table
        title="Treats"
        :rows="transactionDetail"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="loading"
        :pagination="initialPagination"
      >
        <template v-slot:top>
          <div class="text-h4">Transaksi</div>
          <q-space />
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <ExportExcel v-bind="excelDownloadOptions">
            <q-btn small style="background: #1d6f42; color: white" size="sm">
              <span class="text-capitalize">Unduh Xlsx</span>
            </q-btn>
          </ExportExcel>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>{{ props.row.Id }}</q-td>
            <q-td>{{ props.row.settlementdest }}</q-td>
            <q-td>{{ statusSettle("statusTrx", props.row) }}</q-td>
            <q-td>{{ formatNumber(props.row.pajak) }}</q-td>
            <!-- <q-td :v-html="props.row.statussettlement"></q-td> -->
            <td>
              {{ statusSettle("statusSettlemen", props.row) }}
            </td>
            <q-td>{{ formatNumber(props.row.totalhargajual) }}</q-td>
            <q-td>{{ formatNumber(props.row.subtotal) }}</q-td>
            <q-td>{{ props.row.uraiancorporate }}</q-td>
            <q-td>{{ props.row.cardpan }}</q-td>
            <q-td>{{ props.row.uraiankategoripembayaran }}</q-td>
            <q-td>{{ props.row.uraianacquiring }}</q-td>
            <q-td>{{ props.row.created_at }}</q-td>
          </q-tr>
        </template>

        <template v-slot:bottom="scope">
          <div class="q-mr-sm">Total Dpp : {{ formatRp(subTotal) }}</div>
          <div class="q-mr-sm">Total Pajak : {{ formatRp(totPajak) }}</div>
          <div class="q-mr-sm">
            Total Pembayaran : {{ formatRp(totHargaJual) }}
          </div>
          <div class="absolute-bottom-right q-mb-sm">
            {{ 1 + scope.pagination.rowsPerPage * (scope.pagination.page - 1) }}
            -
            {{
              scope.pagination.page * scope.pagination.rowsPerPage >
              transactionDetail.length
                ? transactionDetail.length
                : scope.pagination.page * scope.pagination.rowsPerPage
            }}
            of
            {{ transactionDetail.length }}
            <q-btn
              v-if="scope.pagesNumber > 2"
              icon="first_page"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isFirstPage"
              @click="scope.firstPage"
            ></q-btn>

            <q-btn
              icon="chevron_left"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isFirstPage"
              @click="scope.prevPage"
            ></q-btn>

            <q-btn
              icon="chevron_right"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isLastPage"
              @click="scope.nextPage"
            ></q-btn>

            <q-btn
              v-if="scope.pagesNumber > 2"
              icon="last_page"
              color="grey-8"
              round
              dense
              flat
              :disable="scope.isLastPage"
              @click="scope.lastPage"
            ></q-btn>
          </div>
        </template>
      </q-table>
    </div>
    <!-- end table -->
  </q-page>
</template>

<script>
import moment from "moment";
import { mapActions, mapState, mapWritableState } from "pinia";
import { useDashboardStore } from "src/stores/dashboard-store";
import { ref, defineComponent } from "vue";
import DatePicker from "./DatePicker.vue";
import { useQuasar } from "quasar";
import { Notify } from "quasar";
import ExportExcel from "../../components/ExportExcel.vue";

import RevenueChart from "./components/revenueChart/index.vue";
import IncomeCategoryChart from "./components/incomeCategoryChart/index.vue";
import { useAuthStore } from "src/stores/auth-store";

const columns = [
  {
    name: "Id",
    required: true,
    label: "Id",
    align: "left",
    field: (row) => row.Id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "settlementdest",
    required: true,
    label: "Settlementdest",
    align: "left",
    field: (row) => row.settlementdest,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "statustrx",
    align: "center",
    label: "Status Transaksi",
    field: "statustrx",
    sortable: true,
  },
  {
    name: "pajak",
    label: "Pajak",
    field: "pajak",
    sortable: true,
    align: "center",
  },
  {
    name: "statussettlement",
    label: "Status Settlement",
    field: "statussettlement",
  },
  {
    name: "totalhargajual",
    label: "Total Pendapatan",
    field: "totalhargajual",
  },
  { name: "subtotal", label: "Total Dpp", field: "subtotal" },
  {
    name: "uraiancorporate",
    label: "Uraian Corporate",
    field: "uraiancorporate",
  },
  {
    name: "cardpan",
    label: "Card Pan",
    field: "cardpan",
    align: "center",
  },
  {
    name: "uraiankategoripembayaran",
    label: "Uraian Kategori Pembayaran",
    field: "uraiankategoripembayaran",
  },
  {
    name: "uraianacquiring",
    label: "Uraian Acquiring",
    field: "uraianacquiring",
  },
  {
    name: "created_at",
    label: "Created At",
    field: "created_at",
  },
];

const originalRows = [
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

const stringOptions = ["Semua Corporate", "Cartenz"];

const $q = useQuasar();

export default defineComponent({
  name: "IndexPage",

  data() {
    const loading = ref(false);
    const filter = ref("");
    const options = ref(stringOptions);
    const rows = ref([...originalRows]);

    return {
      showOtherData: false,
      $q,
      columns,
      rows,
      loading,
      filter,
      model: ref(null),
      options,
      rekeningDpp: "0412318756",
      rekeningPajak: "0928657182",
      prompt: false,
      curRek: "",
      newRek: "",
      filterFn(val, update) {
        if (val === "") {
          update(() => {
            options.value = stringOptions;
            // here you have access to "ref" which
            // is the Vue reference of the QSelect
          });
          return;
        }
        update(() => {
          const needle = val.toLowerCase();
          options.value = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      dateRange: {
        start: moment().startOf("month").toDate(),
        end: moment().endOf("month").toDate(),
      },
    };
  },
  computed: {
    ...mapState(useAuthStore, ["userMkp"]),
    ...mapState(useDashboardStore, ["transactionCategory", "dateStartEnd"]),
    user() {
      return this.userMkp;
    },
    ...mapWritableState(useDashboardStore, ["tglFilter"]),

    excelDownloadOptions() {
      let nameExcelFile = "";
      let date = "";
      if (this.tglFilter) {
        date = `${moment(this.dateStartEnd.from).format("YYYY-MM-DD")}-${moment(
          this.dateStartEnd.to
        ).format("YYYY-MM-DD")}`;
      } else {
        date = `${moment(this.dateRange.start).format("YYYY-MM-DD")}-${moment(
          this.dateRange.end
        ).format("YYYY-MM-DD")}`;
      }

      let resultItem = [];
      for (let currentData of this.transactionDetail) {
        currentData.statusTransaksi = this.statusSettle(
          "statusTrx",
          currentData
        );
        currentData.statusSettlemen = this.statusSettle(
          "statusSettlemen",
          currentData
        );
        resultItem.push(currentData);
      }

      nameExcelFile = `${date}_Analisis-Transaksi.xlsx`;

      return {
        worksheet: "Tabel Transaksi Analisis",
        name: this.dateStartEnd
          ? nameExcelFile
          : "Tabel_Transaksi_Analisis.xlsx",
        fields: {
          Id: "Id",
          "Settlement Dest": "settlementdest",
          "Status Transaksi": "statusTransaksi",
          Pajak: "pajak",
          "Status Settlement": "statusSettlemen",
          "Total Pendapatan": "totalhargajual",
          "Total Dpp": "subtotal",
          "Uraian Corporate": "uraiancorporate",
          Cardpan: "cardpan",
          "Uraian Kategori Pembayaran": "uraiankategoripembayaran",
          "Uraian Acquiring": "uraianacquiring",
          "Tanggal dibuat": "created_at",
        },

        data: resultItem,
      };
    },

    cardSummaryData() {
      const result = this.transactionCategory.filter(
        (el) => el.trx_category != "TUNAI"
      );
      const ifEmptyResult = [
        {
          trx_category: "DEBIT",
          total_trx: 0,
        },
        {
          trx_category: "E-MONEY",
          total_trx: 0,
        },
        {
          trx_category: "QRIS",
          total_trx: 0,
        },
      ];
      if (!this.transactionCategory || this.transactionCategory.length == 0) {
        return ifEmptyResult;
      } else {
        return result;
      }
    },
  },

  methods: {
    ...mapActions(useDashboardStore, ["getDataTrx"]),
    async filterHandler() {
      this.$q.loading.show();
      await this.getDataTrx(this.payloadBody());
      this.$q.loading.hide();
    },

    saveNoRek() {
      if (this.curRek == "DPP") {
        this.rekeningDpp = this.newRek;
      } else if (this.curRek == "Pajak") {
        this.rekeningPajak = this.newRek;
      }
      this.prompt = false;
    },

    dateFormat() {
      const dateStart = moment(this.dateStartEnd.from).format("YYYY-MM-DD");
      const dateEnd = moment(this.dateStartEnd.to).format("YYYY-MM-DD");
      return { from: dateStart, to: dateEnd };
    },

    statusSettle(tipe, val) {
      // let results1 = "";
      // let results2 = "";
      let val1 = val.statussettlement;
      let val2 = val.statustrx;

      if (val1 || val2) {
        // const status1 = val1.split(">");
        // if (status1.length > 1) {
        //   let status2 = status1[1].split("<");
        //   console.log(status2[0], "----");
        //   results = status2[0];
        // }
        if (tipe == "statusTrx") {
          const status1 = val2.split(">");
          if (status1.length > 1) {
            let status2 = status1[1].split("<");
            // console.log(status2[0], "----");
            return status2[0];
          }
        } else {
          const status1 = val1.split(">");
          if (status1.length > 1) {
            let status2 = status1[1].split("<");
            // console.log(status2[0], "----");
            return status2[0];
          }
        }
      }
      // return results;
    },
    formatRp(val) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(val);
    },
    formatNumber(val) {
      return new Intl.NumberFormat("id-ID").format(val);
    },

    payloadBody() {
      // console.log(this.dateStartEnd, "cek date");
      let tgl_awal = "";
      let tgl_akhir = "";
      if (!this.dateStartEnd) {
        //is empty
        tgl_awal = moment(this.dateRange.start).format("YYYY-MM-DD");
        tgl_akhir = moment(this.dateRange.end).format("YYYY-MM-DD");
      } else {
        tgl_awal = this.dateStartEnd.from;
        tgl_akhir = this.dateStartEnd.to;
      }
      const userId = this.user.id,
        startDate = tgl_awal,
        endDate = tgl_akhir;
      return {
        userId,
        startDate,
        endDate,
      };
    },
  },
  async created() {
    this.$q.loading.show();
    await this.getDataTrx(this.payloadBody());
    this.$q.loading.hide();
  },

  components: { DatePicker, ExportExcel, RevenueChart, IncomeCategoryChart },
});
</script>

<style scoped>
.rounded {
  border-radius: 10px;
}
.bgOpacity {
  background-color: rgb(0, 51, 102, 0.5);
}
</style>
