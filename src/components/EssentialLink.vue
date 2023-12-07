<template>
  <q-item
    clickable
    @click="toPage(link)"
    :class="linkActive == link.name ? 'activeItem' : ''"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
  <!-- <q-expansion-item expand-separator :icon="icon" :label="title" v-else>
    <q-card>
      <q-list>
        <q-item
          clickable
          v-for="(item, index) in child"
          :key="index"
          @click="toPagePurpose(item.link)"
          :class="linkActive == item.link.name ? 'activeItem' : ''"
        >
          <q-item-section avatar>
            <q-icon size="xs" :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-expansion-item> -->
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },
    goToPurpose: {
      type: Function,
      required: true,
    },
    linkActive: {
      type: String,
      required: true,
    },

    link: {
      type: Object,
      default(rawProps) {
        return { name: "#" };
      },
    },

    child: {
      type: Array,
      default(rawProps) {
        return [];
      },
    },

    icon: {
      type: String,
      default: "",
    },
  },

  data() {
    return {};
  },
  methods: {
    toPage(page) {
      this.goToPurpose(page);
    },
  },

  created() {
    // this.$watch("linkActive", async (newLink) => {
    //   // ...
    //   this.linkActive = newLink;
    //   // console.log(newLink, "lick aktif");
    // });
  },
});
</script>

<style>
.activeItem {
  /* color: #10be8a; */
  color: #0066cc;
  background-color: rgba(66, 86, 165, 0.5);
}
</style>
