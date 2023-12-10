<template>
  <div class="q-py-md" style="max-width: 300px; width: 250px">
    <q-input filled v-model="displayDate" readonly @click="openDatePick = true">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer"> </q-icon>
      </template>
    </q-input>
  </div>

  <q-dialog v-model="openDatePick" width="50%">
    <q-card style="width: 350px; max-width: 80vw" class="">
      <q-card-section class="flex justify-between">
        <div class="text-overline">Periode</div>
        <q-btn flat round icon="close" size="sm" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section
        style="max-height: 100vh"
        class="row scroll justify-center"
      >
        <q-date range v-model="dateModelDefault" mask="YYYY-MM-DD"></q-date>
      </q-card-section>

      <q-separator />

      <q-card-actions align="around">
        <q-btn flat label="Reset" color="black" @click="resetValDate" />
        <q-btn label="Submit" color="primary" @click="submitDate" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import moment from "moment/min/moment-with-locales";
import { mapWritableState } from "pinia";
import { useDashboardStore } from "src/stores/dashboard-store";
moment.locale("id");

export default {
  name: "DatePicker",
  props: {
    dateModel: {
      type: Object,
      default: () => {
        return {
          start: moment().startOf("month").toDate(),
          end: moment().endOf("month").toDate(),
        };
      },
    },
    dateSeparator: {
      type: String,
      default: "-",
    },
    dateFormat: {
      type: String,
      // default: "YYYY-MM-DD HH:mm",
      default: "YYYY-MM-DD",
    },
  },
  data() {
    return {
      openDatePick: ref(false),
      model: ref(""),
      // dateModel: ref({ from: "2022/07/01", to: "2022/07/30" }),
      dateModelDefault: ref({
        from: moment(this.dateModel.start).format(this.dateFormat),
        to: moment(this.dateModel.end).format(this.dateFormat),
      }),
    };
  },
  methods: {
    resetValDate() {
      this.dateModelDefault = "";
    },
    submitDate() {
      if (typeof this.dateModelDefault === "string") {
        this.dateStartEnd = {
          from: this.dateModelDefault,
          to: this.dateModelDefault,
        };
      } else {
        this.dateStartEnd = this.dateModelDefault;
      }
      //   this.getTransaction();

      // console.log(this.dateStartEnd, "<<<<");

      this.openDatePick = false;
    },
  },
  computed: {
    //   ...mapWritableState(useExampleStore, ["dateStartEnd"]),
    ...mapWritableState(useDashboardStore, ["dateStartEnd", "defaultDate"]),
    displayDate() {
      if (this.dateModelDefault) {
        if (typeof this.dateModelDefault === "string") {
          return this.dateModelDefault;
        } else {
          return `${this.dateModelDefault.from} - ${this.dateModelDefault.to}`;
        }
      } else {
        return moment(this.dateModel.start).format(this.dateFormat);
      }
    },
  },

  created() {
    console.log(this.dateStartEnd, "<<<<");
    this.dateStartEnd = this.dateModelDefault;
    // this.defaultDate = this.dateModelDefault;
    // console.log(this.dateStartEnd, "<<<<");
  },
};
</script>

<style></style>
