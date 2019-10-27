<template>
  <div class="combo-menu" :style="menuStyles">
    <!-- menu header -->
    <div class="menu-header-container" v-if="comboType !== 1">
      <table class="menu-table">
        <thead class="menu-header">
          <tr>
            <th
              class="menu-header__th"
              v-for="(column, index) in columnx"
              :key="index"
              :title="column.tooltip"
              :style="getThStyles(column)"
            >
              <span>{{ column.title }}</span>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <!-- END: menu header -->

    <div class="menu-body-container" v-if="!loading">
      <ul ref="menuItems" class="menu-items" v-if="comboType === 1">
        <slot></slot>
      </ul>

      <table class="menu-table" v-else>
        <tbody ref="menuItems" class="menu-items">
          <slot></slot>
        </tbody>
      </table>
    </div>
    <!-- TODO: Chưa vẽ -->
    <div class="loading" v-if="loading"></div>
    <div class="no-data-display" v-if="noDataxShow"></div>
    <div class="btn-add-menu" v-if="hasQuickAddButton && btnQuickAddOnMenu"></div>
  </div>
</template>

<script>
export default {
  name: "ComboMenu",
  props: {
    /**
     * Loại combo
     */
    comboType: {
      type: Number,
      default: 1
    },

    /**
     * Trạng thái ẩn hiện btn `Thêm nhanh`
     */
    hasQuickAddButton: {
      type: Boolean,
      default: false
    },

    /**
     * Vị trí của btn `Thêm nhanh`
     */
    btnQuickAddOnMenu: {
      type: Boolean,
      default: false
    },

    /**
     * Cấu hình cột của combo
     */
    columnx: {
      type: Array,
      default() {
        return [];
      }
    },

    /**
     * Trạng thái `không có dữ liệu hiển thị`
     */
    noDataxShow: {
      type: Boolean,
      default: false
    },

    /**
     * Trạng thái loading
     */
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      topx: null,
      leftx: null,
      minWidthx: null
    };
  },
  computed: {
    menuStyles() {
      let me = this;
      return {
        top: `${me.topx}px`,
        left: `${me.leftx}px`,
        minWidth: `${me.minWidthx}px`
      };
    }
  },
  watch: {},
  methods: {
    getThStyles(column) {
      let me = this;
      return {
        width: column.isResize ? null : `${column.width}px`,
        textAlign: column.titleAlign
      };
    },
    getMenuPosition() {
      let me = this,
        comboEl = me.$parent.$el,
        comboElRect = comboEl.getBoundingClientRect(),
        comboMenuEl = me.$el;

      let windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      let windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      me.minWidthx = comboElRect.width;
      // TODO: adjust position
    }
  },
  mounted() {
    let me = this;
    // TODO: append body
    // TODO: add document click
    // TODO: add scroll event
    me.getMenuPosition();
  }
};
</script>

<style lang="scss" scoped>
.combo-menu {
  z-index: 999;
  position: absolute;
  border: 1px solid #b4b4b4;
  border-radius: 3px;
  overflow: hidden;
  background-color: #fff;
  white-space: nowrap;

  .menu-table {
    border-collapse: collapse;
  }

  .menu-header-container {
    background-color: #ddd;
  }

  .menu-body-container {
    max-height: 160px;
    overflow-y: overlay;
    .menu-items {
      padding: 0;
      margin: 0;
    }
  }
}
</style>