<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- <q-input
          dark
          dense
          standout
          v-model="text"
          input-class="text-right"
          class="q-ml-md q-mr-md"
          style="width: 100%"
        >
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="text = ''"
            />
          </template>
        </q-input> -->
        <div
          class="flex items-center justify-end q-gutter-md"
          style="width: 100%"
        >
          <div class="">
            <q-toolbar-title> Admin Cartenz </q-toolbar-title>
          </div>

          <div><q-btn flat round color="white" icon="person" /></div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      bordered
      :width="260"
      :breakpoint="500"
      class=""
    >
      <q-list>
        <q-item-label header class="text-weight-bold text-h6 text-center">
          MPK Mobile
        </q-item-label>

        <EssentialLink
          v-for="link in linkDrawer"
          :key="link.title"
          v-bind="link"
          :goToPurpose="toPagePurpose"
          :linkActive="linkActive"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      text: ref(""),
      miniState: ref(true),
      linkActive: "",

      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  computed: {
    linkDrawer() {
      let linksList = [];

      linksList = [
        {
          title: "Dashboard",
          icon: "home",
          link: { name: "homePage" },
        },
        {
          title: "Laporan",
          icon: "insert_chart_outlined",
          link: { name: "laporanTransaksi" },
          // child: [
          //   {
          //     title: "Succes Transaction",
          //     icon: "radio_button_unchecked",
          //     link: { name: "succesTransaction" },
          //   },
          //   {
          //     title: "Settled Transaction",
          //     icon: "radio_button_unchecked",
          //     link: { name: "settledTransaction" },
          //   },
          //   {
          //     title: "List Transaction",
          //     icon: "radio_button_unchecked",
          //     link: { name: "listTransaction" },
          //   },
          // ],
        },
        {
          title: "Logout",
          icon: "logout",
          link: { name: "loginPage" },
        },
      ];

      return linksList;
    },
  },

  methods: {
    toPagePurpose(page) {
      // console.log(page.name, "cek page to");
      if (page.name == "loginPage") {
        localStorage.clear();
      }
      this.linkActive = page.name;
      this.$router.push(page);
    },
  },

  created() {
    this.linkActive = this.$route.name;
  },
});
</script>
