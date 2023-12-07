<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-md-8 col-xs-12">
        <LeftRevenueChart />
      </div>

      <div class="col-md-4 col-xs-12">
        <RightRevenueChart />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import LeftRevenueChart from "./LeftRevenueChart.vue";
import RightRevenueChart from "./RightRevenueChart.vue";
// import { getCssVar } from "quasar";

export default defineComponent({
  name: "RevenueChart",
  data() {
    return {};
  },
  methods: {},
  components: { LeftRevenueChart, RightRevenueChart },
});
</script>
