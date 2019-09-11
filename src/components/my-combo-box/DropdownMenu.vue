<template>
  <transition :name="transition">
    <div class="dropdown-menu" v-if="isExpanded" :style="menuStyles">
      <div class="dropdown-menu-header" v-if="comboType !== 1">
        <!-- <table class="dropdown-menu-table">
            <thead>
              <tr>
                <td
                  class="table-td"
                  v-for="(column, index) in comboColumns"
                  :key="index"
                  :title="column.tooltip"
                  :style="tdStyles(column)"
                >{{ column.title }}</td>
              </tr>
            </thead>
        </table>-->
      </div>
      <div class="dropdown-menu-body">
        <ul class="dropdown-items" v-if="comboType === 1">
          <!-- @mouseover="typeAheadPointer = index" -->
          <slot></slot>
        </ul>

        <!-- <div class="dropdown-items" v-else>
            <table class="dropdown-menu-table">
              <tbody>
                <tr
                  class="dropdown-item"
                  v-for="(item, trIndex) in datax"
                  :key="trIndex"
                  :class="{'dropdown-item--selected': isItemSelected(item), 'dropdown-item--highlight': true}"
                  @click.prevent.stop="select(item, false, true)"
                >
                  <td
                    class="table-td"
                    v-for="(column, tdIndex) in comboColumns"
                    :key="tdIndex"
                    :style="tdStyles(column)"
                  >{{ item[column.field] }}</td>
                </tr>
              </tbody>
            </table>
        </div>-->
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
      comboType: 1,
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