<template>
  <div class="dropdown-item-con" v-on="listeners">
    <li class="dropdown-item" v-if="comboType === 1">{{getItemDisplayValue(item)}}</li>

    <!-- v-for="(item, trIndex) in datax"
      :key="trIndex"
      :class="{'dropdown-item--selected': isItemSelected(item), 'dropdown-item--highlight': true}"
    @click.prevent.stop="select(item, false, true)"-->
    <tr class="dropdown-item" v-else>
      <td
        class="item__td"
        v-for="(column, tdIndex) in columnx"
        :key="tdIndex"
        :style="getTdStyles(column)"
      >{{getItemDisplayValue(item, column)}}</td>
    </tr>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
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
        width: column.width ? `${column.width}px` : null,
        textAlign: column.titleAlign ? column.titleAlign : null
      };
    },
    getItemDisplayValue(item, column) {
      let me = this;
      if (!column) {
        return me.$parent.$parent.getItemDisplayValue(item);
      } else {
        return item[column.field];
      }
    },
    onFoldClick() {}
  }
};
</script>