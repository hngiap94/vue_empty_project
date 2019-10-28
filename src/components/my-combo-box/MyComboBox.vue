<template>
  <div ref="myCombo" class="my-combo my-combo-box" :class="stateClasses">
    <!-- #region: combo title -->
    <div class="combo-title" v-if="title" @click.stop="clickTitle">
      <span class="combo-title__text" :title="tooltip">{{ title }}</span>
      <span
        class="combo-required__text"
        v-if="required && requiredVisible"
      >&nbsp; {{ requiredText }}</span>
    </div>
    <!-- #endregion -->

    <!-- #region: main container -->
    <validation-provider
      ref="provider"
      :name="comboName"
      :rules="validateRules"
      :debounce="500"
      v-slot="{flags, invalid, errors}"
    >
      <span v-if="debug">
        <p>{{ flags }}</p>
        <p>{{ invalid }}</p>
        <p>{{ errors }}</p>
      </span>
      <!-- :class="{'combo--error': invalid}" -->
      <div class="combo-main-con">
        <div class="select-options">
          <div class="selected-items" v-if="multiple">
            <div class="selected-item" v-for="(item, index) in selected" :key="index">
              <div class="selected-item__text">{{ getItemDisplayValue(item) }}</div>
              <div class="deselect-btn" @click="deselect(item)">x</div>
            </div>
          </div>
          <!-- 
            :title="errors[0]"
            v-on="listeners"
          -->
          <input
            type="text"
            ref="comboInput"
            class="combo-input"
            :placeholder="placeholder"
            :readonly="!editable || isReadOnly"
            :disabled="isDisabled"
            v-model="queryString"
          />
        </div>
        <div class="combo-actions">
          <div class="btn-quick-search" v-if="hasQuickSearchButton" @click="onBtnQuickSearchClick">
            <div class="icon-quick-search"></div>
          </div>

          <div
            class="btn-quick-add"
            v-if="hasQuickAddButton && !btnQuickAddOnMenu"
            @click="onBtnQuickAddClick"
          >
            <div class="icon-quick-add"></div>
          </div>
          <div class="btn-arrow-dropdown" @click="onTriggerClick">
            <div
              class="icon-arrow-dropdown"
              :class="isExpanded? `icon-dropdown-up`: `icon-dropdown-down`"
            ></div>
          </div>
        </div>
      </div>
    </validation-provider>
    <!-- #endregion -->

    <!-- #region: dropdown menu -->
    <combo-menu
      ref="comboMenu"
      v-if="isExpanded"
      :comboType="comboType"
      :columnx="columnx"
      :hasQuickAddButton="hasQuickAddButton"
      :btnQuickAddOnMenu="btnQuickAddOnMenu"
      :noDataxShow="noDataxShow"
      :loading="loading"
    >
      <combo-menu-item
        v-for="(item, itemIndex) in dataxShow"
        :key="itemIndex"
        :comboType="comboType"
        :item="item"
        :columnx="columnx"
        :class="{
           'dropdown-item--highlight': itemIndex === typeAheadPointer
        }"
        @mouseover="typeAheadPointer = itemIndex"
        @click.stop="onClickSelect(item)"
      ></combo-menu-item>
    </combo-menu>
    <!-- #endregion -->
  </div>
</template>

<script>
import MyStore from "@/api/store.js";
import BaseComponent from "@/components/base/BaseComponent.vue";
import ComboMenu from "./ComboMenu.vue";
import ComboMenuItem from "./ComboMenuItem.vue";

import { ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import _ from "lodash";

import pointerScroll from "@/components/my-combo-box/combo-mixins/pointerScroll.js";
import typeAheadPointer from "@/components/my-combo-box/combo-mixins/typeAheadPointer.js";

extend("required", {
  ...required,
  message: "Trường này không được để trống"
});

export default {
  name: "MyComboBox",
  extends: BaseComponent,
  mixins: [pointerScroll, typeAheadPointer],
  components: {
    ComboMenu,
    ComboMenuItem,
    ValidationProvider
  },
  props: {
    /**
     * Sử dụng để debug
     */
    debug: {
      type: Boolean,
      default: false
    },

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
     * Combo yêu cầu chọn
     */
    required: {
      type: Boolean,
      default: false
    },

    /**
     * text hiển thị khi required
     */
    requiredText: {
      type: String,
      default: "*"
    },

    /**
     * Trạng thái ẩn hiện text required
     */
    requiredVisible: {
      type: Boolean,
      default: false
    },

    /**
     * Tooltip cho tittle của combo
     */
    tooltip: {
      type: String,
      default: ""
    },

    /**
     * Tên của combo
     */
    name: {
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
     * Ẩn hiện button "Tìm kiếm nhanh"
     */
    hasQuickSearchButton: {
      type: Boolean,
      default: false
    },

    /**
     * Ẩn hiện button "Thêm"
     */
    hasQuickAddButton: {
      type: Boolean,
      default: false
    },

    /**
     * Set vị trí cho button "Thêm"
     */
    btnQuickAddOnMenu: {
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

    multiple: {
      type: Boolean,
      default: false
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
     * Các rules validate
     */
    rules: {
      type: String,
      default: ""
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
       * Trạng thái có thể edit của combo
       */
      editable: true,

      /**
       * Tên default của combo
       */
      comboNameDefault: "ComboBox",

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
      selected: [],

      /**
       * Chứa danh sách item được chọn trước đó
       */
      lastSelected: null,

      /**
       * Chứa chuỗi input người dùng nhập vào
       */
      queryString: null,

      /**
       * Chứa chuỗi input người dùng nhập vào trước đó
       */
      lastQueryString: null,

      /**
       * Trạng thái focus của combo
       */
      isFocus: false,

      /**
       * Trạng thái load dữ liệu của combo
       */
      loading: false,

      /**
       * Cấu hình cột mặc đinh của combo
       */
      columnDefault: {
        title: "",
        tooltip: "",
        field: "",
        width: 120,
        titleAlign: "left",
        columnAlign: "left"
      }
    };
  },
  computed: {
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
     * Tên của combo phục vụ message validate
     */
    comboName() {
      let me = this;
      if (!me.name) {
        if (!me.title) {
          return me.comboNameDefault;
        }
        return me.title;
      }
      return me.name;
    },

    /**
     * Lấy cấu hình column, có default
     */
    columnx() {
      let me = this,
        columnx = [];
      if (me.columns && me.columns.length !== 0) {
        for (const column of me.columns) {
          columnx.push(Object.assign({}, me.defaultColumn, column));
        }
        return columnx;
      }
    },

    /**
     * Lấy danh sách các cột hiển thị
     */
    dataxShow() {
      let me = this;
      if (me.comboType === 3) {
        // TODO: isHide
        return null;
      } else {
        return me.datax;
      }
    },

    /**
     * Trạng thái `Không có dữ liệu hiển thị`
     */
    noDataxShow() {
      let me = this;
      return me.dataxShow.length === 0;
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
  watch: {},
  methods: {
    /**
     * Hàm khởi tạo combo
     */
    initCombo() {
      let me = this;
      if (me.mode.toLowerCase() === "dropdownlist") {
        me.editable = false;
      }

      if (me.isComboTree) {
        me.comboType = 3;
      } else if (me.columns && me.columns.length !== 0) {
        me.comboType = 2;
      } else {
        me.comboType = 1;
      }
    },

    /**
     * Kiểm tra tính hợp lệ của giá trị(value) hoặc item của combo
     */
    isValid(val) {
      // typeof {} = object
      // typeof null = object
      // typeof [] = object
      if (typeof val === "object") {
        return !_.isEmpty(val);
      }
      // kiểm tra dữ liệu nguyên thủy
      return val !== undefined;
    },

    /**
     * Kiểm tra nếu store rỗng
     */
    isStoreEmpty() {
      let me = this;
      return me.datax.length === 0;
      // return me.store.getCount() === 0;
    },

    /**
     * Xử lý sự kiện click vào title của combo
     * Focus vào ô input
     */
    clickTitle() {
      let me = this;
      me.$refs.comboInput.focus();
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
    onBtnQuickAddClick() {
      let me = this;
      me.collapse();
      me.$emit("clickAdd", event);
    },

    /**
     * lấy ra trường hiển thị của combo
     */
    getDisplayField() {
      let me = this,
        valueField;
      if (!me.displayField) {
        valueField = me.getValueField();
        if (valueField) {
          return valueField;
        }
        return "";
      }
      return me.displayField;
    },

    /**
     * lấy ra trường giá trị của combo
     */
    getValueField() {
      let me = this;
      if (!me.valueField) {
        let displayField = me.displayField;
        if (displayField) {
          throw new Error(
            "DEV: có khai báo displayField nhưng không khai báo valueField?"
          );
        }
        return "";
      }
      return me.valueField;
    },

    /**
     * Tìm item khi biết giá trị của displayField
     */
    getItemByDisplayValue(displayVal) {
      let me = this;
      let item = me.datax.find(itemData => {
        return _.isEqual(
          me.getItemDisplayValue(itemData).toLowerCase(),
          displayVal.toLowerCase()
        );
      });

      if (item) {
        return item;
      }
      return null;
    },

    /**
     * Tìm item khi biết giá trị của valueField
     */
    getItemByValue(value) {
      let me = this;
      if (me.isValid(value)) {
        let item = me.datax.find(itemData => {
          return _.isEqual(me.getItemValue(itemData), value);
        });

        if (item) {
          return item;
        }
      }
      return null;
    },

    /**
     * Lấy ra giá trị người dùng nhập ở ô input
     */
    getRawValue() {
      let me = this;
      return me.queryString || null;
    },

    /**
     * Set giá trị hiển thị của ô input
     */
    setRawValue(rawValue) {
      let me = this;
      if (rawValue) {
        me.queryString = rawValue;
      } else {
        me.queryString = "";
      }
    },

    /**
     * Lấy trường hiển thị của item
     */
    getItemDisplayValue(item) {
      let me = this;

      if (typeof item === "object") {
        let displayField = me.getDisplayField();
        if (!displayField) {
          throw new Error(
            "DEV: Không phải kiểu dữ liệu nguyên thủy, chưa khai báo displayField hoặc valueField"
          );
        }
        return item[displayField];
      }
      return item;
    },

    /**
     * Lấy giá trị(value) của combo
     */
    getComboValue() {
      let me = this;
      return me.value || null;
    },

    /**
     * lấy ra giá trị của item dựa vào valueField
     * TODO: valueField is array
     */
    getItemValue(item) {
      let me = this;
      if (typeof item === "object") {
        let valueField = me.getValueField();
        if (!valueField) {
          throw new Error(
            "DEV: Không phải kiểu dữ liệu nguyên thủy, valueField là bắt buộc."
          );
        }
        return item[me.valueField];
      }
      return item;
    },

    /**
     * Lấy giá trị submit của item
     */
    getSubmitValue(item) {
      let me = this,
        submitValue = me.getItemValue(item);
      return submitValue;
    },

    /**
     * set giá trị submit cho combo
     */
    setSubmitValue(value) {
      let me = this;
      if (me.multiple) {
        let comboValue = me.getComboValue();
        if (me.isValid(comboValue)) {
          value = comboValue.concat(value);
        } else {
          value = [].concat(value);
        }
      }
      me.$emit("input", value);
    },

    /**
     * Lấy ra các item đang được chọn
     */
    getSelected() {
      let me = this;
      return me.selected || [];
    },

    /**
     * Lấy ra vị trí của item đang được chọn trong datax
     */
    getSelectedIndex() {
      // let me = this,
      //   selected = me.getSelected();
      // return _.findIndex(me.datax, selected);
    },

    /**
     * Lưu item được chọn
     */
    setSelected(item) {
      let me = this,
        itemSelected = null;
      if (typeof item === "object") {
        itemSelected = Object.assign({}, item);
      } else {
        itemSelected = item;
      }

      if (me.multiple) {
        me.selected = me.selected.concat(itemSelected);
      } else {
        me.selected = [].concat(itemSelected);
      }
    },

    /**
     * Lấy ra item được chọn trước đó
     */
    getLastSelected() {
      let me = this;
      return me.lastSelected || null;
    },

    /**
     * Lưu item được chọn trước đó
     */
    setLastSelected(item) {
      let me = this;
      if (typeof item === "object") {
        me.lastSelected = Object.assign({}, item);
      } else {
        me.lastSelected = item;
      }
    },

    /**
     * Kiểm tra item đã được chọn chưa
     */
    isItemSelected(item) {
      let me = this;
      return false;
      // return me.itemsComparator(me.selected, item);
    },

    /**
     * So sánh giữa 2 items
     */
    // itemsComparator(firstItem, secondItem) {
    //   return _.isEqual(firstItem, secondItem);
    // },

    onClickSelect(item) {
      debugger;

      let me = this;
      me.select(item, false, true);
      me.$refs.comboInput.focus();
    },

    select(item, silent, collapse) {
      let me = this;
      debugger;
      if (me.multiple) {
        me.setSelected(item);
        let submitValue = me.getSubmitValue(item);
        me.setSubmitValue(submitValue);
        let lastSelected = me.getLastSelected();
        if (!silent) {
          me.$emit("selected", item, lastSelected, me);
        }
        me.setLastSelected(item);
      } else {
        // set raw value tránh trường hợp người dùng xóa đi chọn lại item đã chọn
        let displayValue = me.getItemDisplayValue(item);
        me.setRawValue(displayValue);

        // Nếu item đã được chọn trước đó không tiến hành chọn lại
        if (!me.isItemSelected(item)) {
          me.setSelected(item);
          let submitValue = me.getSubmitValue(item);
          me.setSubmitValue(submitValue);
          let lastSelected = me.getLastSelected();
          if (!silent) {
            me.$emit("selected", item, lastSelected, me);
          }
          me.setLastSelected(item);
        }
      }
    },
    deselect(item) {
      let me = this;
      let itemIndex = _.findIndex(me.selected, item);
      me.selected.splice(itemIndex, 1);
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
     * handle sự kiện khi click vào button dropdown
     */
    onTriggerClick() {
      let me = this;
      me.$refs.comboInput.focus();
      if (!me.isReadOnly && !me.isDisabled) {
        if (me.isExpanded) {
          me.collapse();
        } else {
          me.doQuery("", true, true);
        }
      }
    },

    /**
     * Thực hiện query khi người dùng gõ
     */
    // TODO: _.debounce
    doRawQuery() {},

    /**
     * Thực hiện query
     */
    doQuery(queryString, expand, highlightSelected) {
      let me = this;
      try {
        if (queryString === me.lastQueryString) {
          me.expand();
          // me.afterQuery(true);
        }

        me.loading = true;

        if (expand) {
          me.expand();
        } else {
          me.collapse();
        }

        if (me.queryMode === "remote") {
          me.doRemoteQuery(queryString, expand, highlightSelected);
        } else {
          me.doLocalQuery(queryString, expand, highlightSelected);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Thực hiện query server
     */
    doRemoteQuery() {},

    /**
     * Thực hiện query local
     * @param {*} queryString
     * @param {*} expand
     */
    doLocalQuery(queryString, expand, highlightSelected) {
      let me = this;
      me.store.load();
      me.loading = false;
      me.afterQuery(highlightSelected);
    },

    /**
     * Xử lý sau khi query
     * @virtual
     */
    afterQuery() {}
  },
  created() {
    let me = this;
    me.initCombo();
  },
  mounted() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/myComboBox.scss";
</style>