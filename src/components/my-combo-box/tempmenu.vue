<template>
  <transition :name="transition">
    <div class="combo-dropdown-menu">
      <!-- Dropdown menu header -->
      <div class="dropdown-menu-header-con" v-if="comboType !== 1">
        <table class="dropdown-menu-table">
          <thead class="dropdown-menu-header">
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
      <!-- END: Dropdown menu header -->

      <div ref="itemsContainer" class="dropdown-menu-body-con" v-if="!loading">
        <ul ref="dropdownItems" class="dropdown-items" v-if="comboType === 1">
          <slot></slot>
        </ul>

        <table class="dropdown-menu-table" v-else>
          <tbody ref="dropdownItems" class="dropdown-items">
            <slot></slot>
          </tbody>
        </table>
      </div>
      <!-- TODO: Chưa vẽ -->
      <div class="loading"></div>
      <div class="no-data-display"></div>
      <div class="btn-add-menu"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DropdownMenu",
  props: {
    // comboType: {
    //   type: Number,
    //   default: 1
    // },
    // hasAddButton: {
    //   type: Boolean,
    //   default: false
    // },
    // btnAddOnMenu: {
    //   type: Boolean,
    //   default: false
    // },
    // columnx: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    // noDataShow: {
    //   type: Boolean,
    //   default: false
    // },
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    /**
     * Hiệu ứng dropdown menu của combo
     */
    transition: {
      type: String,
      default: "fade"
    }
  },
  data() {
    let me = this;
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    getThStyles(column) {
      let me = this;
      return {
        width: column.width ? `${column.width}px` : null,
        textAlign: column.titleAlign ? column.titleAlign : null
      };
    },

    /**
     * handle sự kiện click một nơi bất kỳ trên document
     * sử dụng để collapse combo khi click ra ngoài
     */
    onDocumentClick() {
      let me = this,
        target = event.target;
      if (target.closest(".my-combo") !== me.$parent.$el) {
        me.$parent.collapse();
      }
    }
  },
  mounted() {
    let me = this;
    document.addEventListener("click", me.onDocumentClick);
    // TODO: Thêm sự kiện scroll
  },
  beforeDestroy() {
    let me = this;
    document.removeEventListener("click", me.onDocumentClick);
    this.$el.parentNode.removeChild(this.$el);
  }
};
</script>