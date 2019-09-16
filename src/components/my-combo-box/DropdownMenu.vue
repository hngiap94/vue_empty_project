<template>
  <transition :name="transition">
    <div class="dropdown-menu" v-if="isExpanded" :style="menuStyles">
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
      <div class="dropdown-menu-body-con">
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
      <div class="btn-add-menu"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DropdownMenu",
  props: {
    comboType: {
      type: Number,
      default: 1
    },
    hasAddButton: {
      type: Boolean,
      default: false
    },
    btnAddOnMenu: {
      type: Boolean,
      default: false
    },
    columnx: {
      type: Array,
      default() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
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
    return {
      isExpanded: false,
      topx: 0,
      leftx: 0,
      minWidthx: 0
    };
  },
  computed: {
    menuStyles() {
      let me = this;
      return {
        left: me.leftx + "px",
        top: me.topx + "px",
        minWidth: me.minWidthx + "px"
      };
    }
  },
  watch: {
    isExpanded(newVal) {
      let me = this;
      if (newVal) {
        me.setMenuPosition();
      }
    }
  },
  methods: {
    getThStyles(column) {
      let me = this;
      return {
        width: column.width ? `${column.width}px` : null,
        textAlign: column.titleAlign ? column.titleAlign : null
      };
    },
    appendBody() {
      let me = this,
        elm = me.$el;
      document.body.insertBefore(elm, document.body.firstChild);
    },
    setMenuPosition() {
      let me = this;
      let dropdownEl = me.$parent.$el;
      let dropdownElRect = dropdownEl.getBoundingClientRect();
      // let scrollTopx = window.pageYOffset || document.documentElement.scrollTop;
      me.minWidthx = dropdownEl.offsetWidth;
      me.leftx = dropdownElRect.left;
      me.topx = dropdownElRect.top + dropdownEl.offsetHeight + 2;
      me.$nextTick(() => {
        let dropdownMenuEl = me.$el;
        let windowWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        let windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
        if (dropdownElRect.left + dropdownMenuEl.offsetWidth > windowWidth) {
          me.leftx = dropdownElRect.right - dropdownMenuEl.offsetWidth;
        }
        if (dropdownMenuEl.getBoundingClientRect().bottom > windowHeight) {
          me.topx = dropdownElRect.bottom - 34 - dropdownMenuEl.offsetHeight;
        }
      });
    }
  },
  mounted() {
    let me = this;
    me.appendBody();
  }
};
</script>