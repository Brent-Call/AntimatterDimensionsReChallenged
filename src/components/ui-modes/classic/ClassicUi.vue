<script>
import BigCrunchButton from "../BigCrunchButton";
import GameHeader from "../GameHeader";


import ClassicSubtabBar from "./ClassicSubtabBar";
import ClassicTabBar from "./ClassicTabBar";
import EternityPointsHeader from "@/components/EternityPointsHeader";
import InfinityPointsHeader from "@/components/InfinityPointsHeader";

export default {
  name: "ClassicUi",
  components: {
    GameHeader,
    ClassicSubtabBar,
    ClassicTabBar,
    InfinityPointsHeader,
    EternityPointsHeader,
    BigCrunchButton
  },
  data() {
    return {
      bigCrunch: false,
      smallCrunch: false,
      newGameKey: "",
    };
  },
  computed: {
    tab: () => Tabs.current,
  },
  methods: {
    update() {
      const crunchButtonVisible = !player.break && Player.canCrunch;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes > 1;
      // This only exists to force a key-swap after pressing the button to start a new game
      this.newGameKey = Pelle.isDoomed;
    }
  },
};
</script>

<template>
  <div
    id="container"
    :key="newGameKey"
    class="container c-old-ui l-old-ui"
  >
    <link
      rel="stylesheet"
      type="text/css"
      href="stylesheets/old-ui.css"
    >
    <BigCrunchButton />
    <template v-if="!bigCrunch">
      <GameHeader class="l-old-ui__header" />
      <ClassicTabBar />
      <component
        :is="tab.config.before"
        v-if="tab.config.before"
      />
      <ClassicSubtabBar />
      <div class="l-old-ui__page">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
