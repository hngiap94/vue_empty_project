<template>
  <div class="combo combo-editor">
      <div class="combo-title" v-if="title">
          <span class="combo-title__text">{{title}}</span>
          <span class="combo-required__text">&nbsp;*</span>
      </div>
      <div class="combo-main-con">
          <div class="select-options">
              <div class="selected-items" v-if="multiple">
                  <div class="selected-item">
                      <span class="selected-item__text"></span>
                      <span class="deselect-icon"></span>
                  </div>
              </div>
              <input type="text" class="combo-input">
          </div>
          <div class="combo-actions">
              <div class="btn-search"></div>
              <div class="btn-add"></div>
              <div class="btn-dropdown"></div>
          </div>
      </div>
      <transition :name="transition">
          <div class="dropdown-menu">

          </div>
      </transition>
  </div>
</template>

<script>
import Combo from "@/components/combo/Combo.vue";
export default {
  name: "ComboEditor",
  extends: Combo,
  props: {},
  data() {
    let me = this;
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/components/combo.scss';
</style>