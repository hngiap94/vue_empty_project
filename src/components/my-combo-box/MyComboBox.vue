<template>
  <div ref="myCombo" class="my-combo my-combo-box" :class="stateClasses">
    <!-- #region: combo title -->
    <div class="combo-title" v-if="title">
      <span class="combo-title__text" :title="tooltip">{{title}}</span>
      <span class="combo-required__text" v-if="required">&nbsp;*</span>
    </div>
    <!-- #endregion -->

    <!-- #region: main container -->
    <validation-provider
      :rules="validateRules"
      :debounce="500"
      v-slot="{invalid, errors}"
      :name="title"
    >
      <p>{{invalid}}</p>
      <p>{{errors}}</p>
      <div class="combo-main-con" :class="{'combo--error': invalid}">
        <div class="select-options">
          <input
            type="text"
            ref="comboInput"
            class="combo-input"
            :placeholder="placeholder"
            :title="errors[0]"
            :readonly="!editable ||isReadOnly"
            :disabled="isDisabled"
            v-on="listeners"
            v-model="queryString"
          />
        </div>
        <div class="combo-actions">
          <div class="btn-search" v-if="hasQuickSearchButton" @click.stop="onBtnQuickSearchClick">
            <div class="icon-search"></div>
          </div>
          <div class="btn-add" v-if="hasAddButton && !btnAddOnMenu" @click="onBtnAddClick">
            <div class="icon-add"></div>
          </div>
          <div class="btn-dropdown" @click="onTriggerClick">
            <div
              class="icon-dropdown"
              :class="isExpanded? `icon-dropdown-up`: `icon-dropdown-down`"
            ></div>
          </div>
        </div>
      </div>
    </validation-provider>
    <!-- #endregion -->

    <!-- #region: dropdown menu -->
    <transition :name="transition">
      <div class="dropdown-menu" v-if="isExpanded">
        <div class="dropdown-menu-header" v-if="comboType !== 1">
          <table class="dropdown-menu-table">
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
          </table>
        </div>
        <div class="dropdown-menu-body">
          <ul class="dropdown-items" v-if="comboType === 1">
            <!-- @mouseover="typeAheadPointer = index" -->
            <li
              class="dropdown-item"
              v-for="(item, index) in datax"
              :key="index"
              :class="{'dropdown-item--selected': isItemSelected(item), 'dropdown-item--highlight': true}"
              @click.prevent.stop="select(item, true)"
            >{{ getItemDisplayField(item) }}</li>
          </ul>

          <div class="dropdown-items" v-else>
            <table class="dropdown-menu-table">
              <tbody>
                <tr
                  class="dropdown-item"
                  v-for="(item, trIndex) in datax"
                  :key="trIndex"
                  :class="{'dropdown-item--selected': isItemSelected(item), 'dropdown-item--highlight': true}"
                  @click.prevent.stop="select(item, true)"
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
          </div>
        </div>
        <!-- TODO: Chưa vẽ -->
        <div class="loading"></div>
        <div class="btn-add-menu"></div>
      </div>
    </transition>
    <!-- #endregion -->
  </div>
</template>

<script>
import MyStore from "@/api/store.js";
import BaseComponent from "@/components/base/BaseComponent.vue";
import _ from "lodash";
import { ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import commonValidations from "@/common/commonValidations.js";

extend("required", {
  ...required,
  message: "Trường này không được để trống"
});

export default {
  name: "MyComboEditor",
  extends: BaseComponent,
  components: {
    ValidationProvider
  },
  props: {
    /**
     * Giá trị của combo
     */
    value: {},

    /**
     * Nội dung title của combo
     */
    title: {
      type: String,
      default: ""
    },

    /**
     * Tooltip cho tittle của combo
     */
    tooltip: {
      type: String,
      default: ""
    },

    /**
     * Combo yêu cầu chọn
     */
    required: {
      type: Boolean,
      default: false
    },

    isForceSelection: {
      type: Boolean,
      default: false
    },

    rules: {
      type: String,
      default: ""
    },

    /**
     * placeholder cho combo
     */
    placeholder: {
      type: String,
      default: ""
    },

    /**
     * Ẩn hiện button "Thêm"
     */
    hasAddButton: {
      type: Boolean,
      default: false
    },

    /**
     * Set vị trí cho button "Thêm"
     */
    btnAddOnMenu: {
      type: Boolean,
      default: false
    },

    /**
     * Ẩn hiện button "Tìm kiếm nhanh"
     */
    hasQuickSearchButton: {
      type: Boolean,
      default: false
    },

    /**
     * Chọn chế độ cho combo
     * dropdown (default): combo cho phép query
     * dropdownlist: combo chỉ chọn
     */
    mode: {
      type: String,
      default: "dropdown"
    },

    /**
     * Lựa chọn combo dạng tree
     */
    isComboTree: {
      type: Boolean,
      default: false
    },

    /**
     * Cấu hình cột cho combo
     */
    columns: {
      type: Array,
      default() {
        return [];
      }
    },

    /**
     * Store load dữ liệu cho combo
     */
    store: {
      type: MyStore
    },

    /**
     * Chế độ query của combo
     */
    queryMode: {
      type: String,
      default: "remote"
    },

    /**
     * Tự động load dữ liệu khi khởi tạo combo
     */
    autoLoad: {
      type: Boolean,
      default: false
    },

    /**
     * Trường hiển thị của combo
     */
    displayField: {
      type: String,
      default: ""
    },

    /**
     * Trường lấy dữ liệu của combo
     */
    valueField: {
      type: String,
      default: ""
    },

    /**
     * giá trị mặc định của combo
     */
    defaultValue: {
      type: String,
      default: ""
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
      /**
       * Loại combo
       */
      comboType: 1,

      /**
       * Dữ liệu của combo
       */
      datax: me.store.data.items,

      /**
       * Thuộc tính ẩn hiện dropdown menu
       */
      isExpanded: false,

      /**
       * Chứa danh sách item được chọn
       */
      selected: null,

      /**
       * Chứa danh sách item được chọn trước đó
       */
      lastSelected: null,

      /**
       * Chứa chuỗi input người dùng nhập vào
       */
      queryString: "",

      /**
       * Thuộc tính edit của combo
       */
      editable: true,

      /**
       * Trạng thái focus của combo
       */
      isFocus: false,

      defaultColumn: {
        title: "",
        tooltip: "",
        field: "",
        width: 150,
        titleAlign: "left",
        columnAlign: "left"
      }
    };
  },
  computed: {
    /**
     * Binding các sự kiện của combo
     */
    listeners() {
      let me = this;
      return {
        ...me.$listeners,
        click: event => me.onInputClick(event),
        keydown: event => me.onInputKeyDown(event),
        keyup: event => me.onInputKeyUp(event),
        focus: event => me.onInputFocus(event),
        blur: event => me.onInputBlur(event),
        input: event => me.onInput(event)
      };
    },

    /**
     * các class trạng thái của combo
     */
    stateClasses() {
      let me = this;
      return {
        "combo--open": me.isExpanded,
        "combo--uneditable": !me.editable,
        "combo--readonly": me.isReadOnly,
        "combo--disabled": me.isDisabled,
        "combo--focus": me.isFocus
      };
    },

    /**
     * Lấy cấu hình column, có default
     */
    comboColumns() {
      let me = this,
        comboColumns = [];
      if (me.columns && me.columns.length !== 0) {
        for (const column of me.columns) {
          comboColumns.push(Object.assign({}, me.defaultColumn, column));
        }
        return comboColumns;
      }
    },

    /**
     * rules validate của combo
     */

    validateRules() {
      let me = this,
        rules = "";
      if (me.required) {
        rules = "required";
      }
      if (me.rules) {
        me.appendRules(rules, me.rules);
      }
      return rules;
    }
  },
  watch: {
    isExpanded(value) {
      let me = this;
      if (value) {
        document.addEventListener("click", me.onDocumentClick);
      } else {
        document.removeEventListener("click", me.onDocumentClick);
      }
    },
    defaultValue: {
      handler: "setDefaultValue"
    },
    value: {
      handler: "doSelectValue"
    }
  },
  methods: {
    /**
     * Hàm khởi tạo combo
     */
    initCombo() {
      let me = this;
      if (me.mode === "dropdownlist") {
        me.editable = false;
      }

      if (me.isComboTree) {
        me.comboType = 3;
      } else if (me.columns && me.columns.length !== 0) {
        me.comboType = 2;
      }
    },

    /**
     * set style cho <td> dropdown menu
     */
    tdStyles(column) {
      let me = this;
      return {
        width: column.width ? `${column.width}px` : null
      };
    },

    /**
     * hàm set giá trị default của combo
     */
    setDefaultValue() {
      let me = this;
      me.queryString = me.defaultValue;
    },

    /**
     * Hàm thực hiện select giá trị khi có sự thay đổi của value
     */
    doSelectValue() {
      let me = this,
        item = me.getItemFromValueField(me.value);
      if (item) {
        me.select(item);
      } else {
        me.queryString = "";
      }
    },

    /**
     * handle sự kiện click button "Tìm kiếm nhanh"
     */
    onBtnQuickSearchClick() {
      let me = this;
      me.collapse();
      me.$emit("clickQuickSearch", event);
    },

    /**
     * handle sự kiện click button "Thêm"
     */
    onBtnAddClick() {
      let me = this;
      me.collapse();
      me.$emit("clickAdd", event);
    },

    /**
     * handle sự kiện click một nơi bất kỳ trên document
     * sử dụng để collapse combo khi click ra ngoài
     */
    onDocumentClick() {
      let me = this,
        target = event.target;
      if (target.closest(".my-combo") !== me.$refs.myCombo) {
        me.collapse();
      }
    },

    /**
     * handle sự kiện khi click vào button dropdown
     */
    onTriggerClick() {
      let me = this;
      me.$refs.comboInput.focus();
      if (me.isExpanded) {
        me.collapse();
      } else {
        me.doQuery("", true);
      }
    },

    /**
     * hiện dropdown menu
     */
    expand() {
      let me = this;
      if (!me.isExpanded) {
        me.isExpanded = true;
      }
    },

    /**
     * Ẩn dropdown menu
     */
    collapse() {
      let me = this;
      if (me.isExpanded) {
        me.isExpanded = false;
      }
    },

    /**
     * Chọn một item
     */
    select(item, collapse) {
      let me = this;
      me.selected = item;
      me.updateValue(item);
      me.afterSelect(item, collapse);
    },

    /**
     * Bỏ chọn một item
     */
    deselect() {
      // TODO: Not use yet
    },

    /**
     * Update giá trị combo sau khi chọn
     */
    updateValue(item) {
      let me = this,
        itemValue = null;
      me.queryString = me.getItemDisplayField(item);
      itemValue = me.getItemValueField(item);
      me.$emit("input", itemValue);
    },

    /**
     * Xử lý sau khi chọn
     */
    afterSelect(item, collapse) {
      let me = this;
      if (collapse) {
        me.collapse();
      }
      me.$emit("selected", item, me);
    },

    /**
     * Xử lý sau khi bỏ chọn
     */
    afterDeselect() {
      // TODO: Not use yet
    },

    /**
     * Kiểm tra item đã được chọn chưa
     */
    isItemSelected(item) {
      let me = this;
      return me.itemsComparator(me.selected, item);
    },

    /**
     * So sánh giữa 2 items
     */
    itemsComparator(val, item) {
      return _.isEqual(val, item);
    },

    /**
     * Lấy trường hiển thị của item
     */
    getItemDisplayField(item) {
      let me = this;
      if (typeof item === "object") {
        return item[me.displayField];
      }
      return item;
    },

    /**
     * Lấy trường giá trị của item
     */
    getItemValueField(item) {
      let me = this;
      if (typeof item === "object") {
        return item[me.valueField];
      }
      return item;
    },

    /**
     * Tìm item khi biết giá trị của displayField
     */
    getItemFromDisplayField() {},

    /**
     * Tìm item khi biết giá trị của valueField
     */
    getItemFromValueField(value) {
      let me = this;
      let item = me.datax.find(itemData => {
        return me.getItemValueField(itemData) === value;
      });
      return item;
    },

    /**
     * Handle sự kiện `click` ô input
     */
    onInputClick(event) {
      let me = this;
      me.onTriggerClick();
    },

    /**
     * Handle sự kiện `keydown` ô input
     */
    onInputKeyDown(event) {
      let me = this;
      switch (event.keycode) {
        case 1:
          break;
      }
    },

    /**
     * handle sự kiện `keyup` ô input
     */
    onInputKeyUp(event) {
      let me = this;
      switch (event.keycode) {
        case 1:
          break;
      }
    },

    /**
     * Handle sự kiện `focus` ô input
     */
    onInputFocus(event) {
      let me = this;
      me.isFocus = true;
    },

    /**
     * Handle sự kiện `blur` ô input
     */
    onInputBlur(event) {
      let me = this;
      me.isFocus = false;
      me.validateForceSelection();
    },

    validateForceSelection() {
      // TODO: viết hàm này sau đó sử dụng setErrors của vee validate
    },

    /**
     * Handle sự kiện `input` ô input
     */
    onInput() {},

    doRawQuery() {},
    doQuery(queryString, expand) {
      let me = this;
      if (me.queryMode === "remote") {
        me.doRemoteQuery(queryString, expand);
      } else {
        me.doLocalQuery(queryString, expand);
      }
    },
    doRemoteQuery(queryString, expand) {},
    doLocalQuery(queryString, expand) {
      let me = this;
      me.store.load();
      me.afterQuery(expand);
    },
    afterQuery(expand) {
      let me = this;
      if (expand) {
        me.expand();
      }
    },
    appendRules(currentRules, appendRules) {
      return currentRules + "|" + appendRules;
    }
  },
  created() {
    let me = this;
    me.initCombo();
  },
  mounted() {
    let me = this;

    if (me.autoLoad) {
      me.doQuery("", false);
    }

    if (me.value && me.datax.length !== 0) {
      me.doSelectValue();
    }

    if (me.defaultValue) {
      me.setDefaultValue();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/myComboBox.scss";
</style>