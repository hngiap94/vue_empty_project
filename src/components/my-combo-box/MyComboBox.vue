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
              @click.prevent.stop="select(item, false, true)"
            >{{ getItemDisplayValue(item) }}</li>
          </ul>

          <div class="dropdown-items" v-else>
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
import customError from "@/common/customError.js";

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

    selectOnTab: {
      type: Boolean,
      default: false
    },

    forceSelection: {
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
    comboTree: {
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

      if (me.comboTree) {
        me.comboType = 3;
      } else if (me.columns && me.columns.length !== 0) {
        me.comboType = 2;
      }
    },

    /**
     * Kiểm tra tính hợp lệ của giá trị(value) hoặc item của combo
     * TODO: Trường hợp string rỗng ('')?
     */
    isValid(val) {
      // Kiểm tra object rỗng
      if (typeof val === "object") {
        return !_.isEmpty(val);
      }
      // kiểm tra dữ liệu nguyên thủy
      return val !== undefined;
    },

    isStoreEmpty() {
      let me = this;
      return me.datax.length === 0;
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
    setDefaultValue(defaultVal) {
      let me = this;
      me.setRawValue(defaultVal);
    },

    /**
     * Hàm thực hiện select giá trị khi có sự thay đổi của value
     * value: null, dữ liệu kiểu nguyên thủy, Object
     * TODO: Chỉnh lại
     */
    doSelectValue(value) {
      let me = this,
        item = me.getItemByValue(value);

      me.select(item, false, true);
      // if (item) {
      //   me.select(item);
      // } else {
      //   me.queryString = "";
      // }
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
     * lấy ra trường hiển thị của combo
     * Nếu không được khai báo trên props, kiểm tra trường valueField
     * - Nếu có giá trị valueField, lúc này hiểu là displayField = valueField
     * - Nếu không có giá trị valueField, lúc này hiểu là dữ liệu nguyên thủy(không sử dụng tới displayField, valueField)
     */
    getItemDisplayField() {
      let me = this,
        valueField;
      if (!me.displayField) {
        valueField = me.getItemValueField();
        if (valueField) {
          return valueField;
        }
        return "";
      }
      return me.displayField;
    },

    /**
     * lấy ra trường giá trị của combo
     * Nếu không được khai báo trên props, có 2 trường hợp xảy ra:
     * - TH1: Dữ liệu combo là kiểu dữ liệu nguyên thủy (không sử dụng tới displayField, valueField)
     * - TH2: Có giá trị displayField, cần báo lỗi cho DEV vì TH này không thể xảy ra.
     */
    getItemValueField() {
      let me = this,
        displayField;
      if (!me.valueField) {
        displayField = me.displayField;
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
     * Lấy ra giá trị người dùng nhập ở ô input
     */
    getRawValue() {
      let me = this;
      return me.queryString || null;
    },

    /**
     * Set giá trị hiển thị của ô input
     * Trường hợp item là object rỗng, rawValue undefined
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
      let me = this,
        displayField;

      if (typeof item === "object") {
        displayField = me.getItemDisplayField();
        if (!displayField) {
          // throw new Error(
          //   "DEV: Không phải kiểu dữ liệu nguyên thủy, chưa khai báo displayField hoặc valueField"
          // );
          let error = new customError(
            me,
            "DEV: Không phải kiểu dữ liệu nguyên thủy, chưa khai báo displayField hoặc valueField"
          );
          console.log(error.component);
          throw error;
        }
        return item[displayField];
      }
      return item;
    },

    /**
     * Tìm item khi biết giá trị của displayField
     */
    getItemByDisplayValue(value) {
      let me = this;
      let item = me.datax.find(itemData => {
        return _.isEqual(
          me.getItemDisplayValue(itemData).toLowerCase(),
          value.toLowerCase()
        );
      });

      if (item) {
        return item;
      }
      return null;
    },

    /**
     * Tìm item khi biết giá trị của valueField
     * return: null neu khong co item nao match
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
     * Lấy giá trị(value) của combo
     */
    getComboValue() {
      let me = this;
      return me.value || null;
    },

    /**
     * lấy ra giá trị của item dựa vào valueField
     */
    getItemValue(item) {
      let me = this,
        valueField;
      if (typeof item === "object") {
        valueField = me.getItemValueField();
        if (!valueField) {
          // throw new Error(
          //   "DEV: Không phải kiểu dữ liệu nguyên thủy, valueField là bắt buộc."
          // );
          let error = new customError(
            me,
            "DEV: Không phải kiểu dữ liệu nguyên thủy, valueField là bắt buộc."
          );
          console.log(error.component);
          throw error;
        }
        return item[me.valueField];
      }
      return item;
    },

    /**
     * Lấy giá trị submit của item
     * Nếu không có trả về chuỗi rỗng
     */
    getSubmitValue(item) {
      let me = this,
        submitValue;
      submitValue = me.getItemValue(item);
      if (!me.isValid(submitValue)) {
        return "";
      }
      return submitValue;
    },

    /**
     * set giá trị submit cho combo
     * emit sự kiện thay đổi v-model
     */
    setSubmitValue(value) {
      let me = this;
      if (value) {
        me.$emit("input", value);
      } else {
        me.$emit("input", "");
      }
    },

    getSelected() {
      let me = this;
      return me.selected || null;
    },
    setSelected(item) {
      let me = this;
      if (typeof item === "object") {
        me.selected = Object.assign({}, item);
      } else {
        me.selected = item;
      }
    },
    getLastSelected() {
      let me = this;
      return me.lastSelected || null;
    },
    setLastSelected(item) {
      let me = this;
      if (typeof item === "object") {
        me.lastSelected = Object.assign({}, item);
      } else {
        me.lastSelected = item;
      }
    },

    /**
     * handle sự kiện khi click vào button dropdown
     */
    //TODO: trường hợp readOnly, disabled
    onTriggerClick() {
      let me = this;
      me.$refs.comboInput.focus();
      if (me.isExpanded) {
        me.collapse();
      } else {
        me.doQuery("", true);
      }
    },

    /**t
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
     * item có 2 kiểu dữ liệu: Kiểu nguyên thủy, Object
     * Cho phép null
     * TODO: Chưa gặp trường hợp item là Object rỗng {}, nếu gặp sẽ phải xử lý ở đây (ex: isValidItem)
     */
    select(item, silent, collapse) {
      let me = this,
        displayValue;
      if (me.isValid(item)) {
        displayValue = me.getItemDisplayValue(item);
        me.setRawValue(displayValue);
        if (!me.isItemSelected(item)) {
          me.doSelect(item, silent);
        }
      } else {
        // Trường hợp null, undefined, {}
        // reset combo
        me.resetCombo();
      }

      // xu ly sau khi chon
      me.afterSelect(item, collapse);
    },

    resetCombo() {
      let me = this,
        lastSelected = me.getLastSelected();

      me.setRawValue("");
      me.setSelected(null);
      me.setSubmitValue(null);
      me.$emit("selected", null, lastSelected, me);
      me.setLastSelected(null);
    },

    doSelect(item, silent) {
      let me = this,
        submitValue = me.getSubmitValue(item),
        lastSelected = me.getLastSelected();

      me.setSelected(item);
      if (!silent) {
        me.setSubmitValue(submitValue);
        me.$emit("selected", item, lastSelected, me);
      }

      me.setLastSelected(item);
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
      let me = this;
    },

    /**
     * Xử lý sau khi chọn
     */
    afterSelect(item, collapse) {
      let me = this;
      if (collapse) {
        me.collapse();
      }
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
    itemsComparator(firstItem, secondItem) {
      return _.isEqual(firstItem, secondItem);
    },

    /**
     * Handle sự kiện `click` ô input
     */
    onInputClick(event) {
      let me = this;
      if (me.isReadOnly && !me.isDisabled) {
        me.onTriggerClick();
      }
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
      if (me.forceSelection) {
        // Trường hợp người dùng gõ xong tab ra luôn
        // Dữ liệu query từ server về chậm, 2 TH xảy ra
        // - TH1: chưa load dữ liệu lần nào, datax rỗng
        // - TH2: có datax nhưng là dữ liệu cũ, không sử dụng được
        if (!me.isStoreEmpty()) {
          me.validateForceSelection();
        }
      } else {
        // Kiem tra item co trong danh sach hay khong
        me.checkItemInList();
      }
      // me.validateForceSelection();
    },

    validateForceSelection() {
      let me = this;
      // TODO: viết hàm này sau đó sử dụng setErrors của vee validate
      if (me.rollbackLastSelected) {
        // rollback lai
      }
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
      let me = this,
        rawValue = me.getRawValue();
      if (expand) {
        me.expand();
      }

      //TODO: Neu co item trung voi queryString thi select
      if (rawValue) {
        let item = me.checkItemInList();
        if (item) {
          me.select(item, false, false);
        }
      }
    },

    /**
     * Tam thoi de trong ham
     * sau nay co the khong dung ham nay
     */
    checkItemInList(rawValue) {
      let me = this;
      return me.getItemByDisplayValue(rawValue);
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
    let me = this,
      value = me.getComboValue();

    if (me.autoLoad) {
      me.doQuery("", false);
    }

    if (me.isValid(value) && !me.isStoreEmpty()) {
      me.doSelectValue(value);
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