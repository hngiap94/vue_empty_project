<template>
  <div class="item-container" v-on="listeners">
    <li class="menu-item" v-if="comboType === 1">{{ getItemDisplayText(item) }}</li>

    <tr class="menu-item" v-else>
      <td
        class="item__td"
        v-for="(column, tdIndex) in columnx"
        :key="tdIndex"
        :style="getTdStyles(column)"
      >{{ getItemDisplayText(item, column) }}</td>
    </tr>
  </div>
</template>

<script>
export default {
  name: "ComboMenuItem",
  props: {
    comboType: {
      type: Number,
      default: 1
    },

    item: {},

    columnx: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    listeners() {
      let me = this;
      return {
        ...me.$listeners
      };
    }
  },
  methods: {
    getTdStyles(column) {
      let me = this;
      return {
        width: column.isResize ? null : `${column.width}px`,
        textAlign: column.columnAlign
      };
    },
    getItemDisplayText(item, column) {
      let me = this;
      if (!column) {
        return me.$parent.$parent.getItemDisplayValue(item);
      } else {
        return item[column.field];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-item {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  white-space: nowrap;
  cursor: pointer;
}
</style>