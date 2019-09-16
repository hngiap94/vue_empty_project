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
      :name="comboName"
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
    <dropdown-menu
      ref="dropdownMenu"
      :comboType="comboType"
      :columnx="columnx"
      :transition="transition"
    >
      <menu-item
        v-for="(item, itemIndex) in dataShow"
        :key="itemIndex"
        :comboType="comboType"
        :item="item"
        :columnx="columnx"
        :loading="loading"
        :class="{
           'dropdown-item--highlight': itemIndex === typeAheadPointer
        }"
        @mouseover.stop="typeAheadPointer = itemIndex"
        @click.prevent.stop="select(item, false, true)"
      ></menu-item>
    </dropdown-menu>
    <!-- #endregion -->
  </div>
</template>

<script>
import BaseComponent from "@/components/base/BaseComponent.vue";
import DropdownMenu from "./DropdownMenu.vue";
import MenuItem from "./MenuItem.vue";

import { ValidationProvider, extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
// import commonValidations from "@/common/commonValidations.js";
// import customError from "@/common/customError.js";

import comboUtils from "@/components/my-combo-box/combo-mixins/comboUtils.js";
import pointerScroll from "@/components/my-combo-box/combo-mixins/pointerScroll.js";
import typeAheadPointer from "@/components/my-combo-box/combo-mixins/typeAheadPointer.js";

extend("required", {
  ...required,
  message: "Trường này không được để trống"
});

export default {
  name: "MyComboEditor",
  extends: BaseComponent,
  mixins: [comboUtils, pointerScroll, typeAheadPointer],
  components: {
    DropdownMenu,
    MenuItem,
    ValidationProvider
  },
  props: {
    /**
     * TODO: Chưa sử dụng
     */
    selectOnTab: {
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
    }
  },
  data() {
    let me = this;
    return {
      /**
       * Thuộc tính edit của combo
       */
      editable: true
    };
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * lấy ra trường hiển thị của combo
     * Nếu không được khai báo trên props, kiểm tra trường valueField
     * - Nếu có giá trị valueField, lúc này hiểu là displayField = valueField
     * - Nếu không có giá trị valueField, lúc này hiểu là dữ liệu nguyên thủy(không sử dụng tới displayField, valueField)
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
     * Nếu không được khai báo trên props, có 2 trường hợp xảy ra:
     * - TH1: Dữ liệu combo là kiểu dữ liệu nguyên thủy (không sử dụng tới displayField, valueField)
     * - TH2: Có giá trị displayField, cần báo lỗi cho DEV vì TH này không thể xảy ra.
     */
    getValueField() {
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
        displayField = me.getDisplayField();
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
        valueField = me.getValueField();
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

    resetCombo() {
      let me = this;

      me.setRawValue("");
      me.setSelected(null);
      me.setSubmitValue(null);
      // me.$emit("selected", null, lastSelected, me);
      me.setLastSelected(null);
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
     * Handle sự kiện `click` ô input
     */
    onInputClick(event) {
      let me = this;
      if (me.isReadOnly && !me.isDisabled) {
        me.onTriggerClick();
      }
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
        // let item = me.checkItemInList();
      }
      // me.validateForceSelection();
    },

    // validateForceSelection() {
    //   let me = this;
    //   // TODO: viết hàm này sau đó sử dụng setErrors của vee validate
    //   if (me.rollbackLastSelected) {
    //     // rollback lai
    //   }
    // },

    onInput() {
      let me = this;
      me.doRawQuery();
    },

    doRawQuery() {},

    doQuery(queryString, expand, highlightSelected) {
      let me = this;
      if (me.queryMode === "remote") {
        me.doRemoteQuery(queryString, expand, highlightSelected);
      } else {
        me.doLocalQuery(queryString, expand, highlightSelected);
      }
    },

    doRemoteQuery() {},
    doLocalQuery(queryString, expand, highlightSelected) {
      let me = this;
      me.store.load();
      me.afterQuery(expand, highlightSelected);
    },

    /**
     *  Xử lý sau khi query
     * @param {Boolean} expand True nếu sau khi query hiện dropdown menu, false nếu không hiện
     * @param {Boolean} highlightSelected True nếu sau khi expand sẽ highlight item đã được chọn trước đó
     *
     */
    afterQuery(expand, highlightSelected) {
      let me = this,
        rawValue = me.getRawValue(),
        selected = me.getSelected();

      if (selected && highlightSelected) {
        let selectedIndex = _.findIndex(me.datax, selected);
        me.typeAheadPointer = selectedIndex;
        me.$nextTick(() => {
          me.maybeAdjustScroll(true);
        });
      } else {
        me.typeAheadPointer = 0;
      }
      if (expand) {
        me.expand();
      }
    },

    /**
     * Tam thoi de trong ham
     * sau nay co the khong dung ham nay
     */
    checkItemInList(rawValue) {
      let me = this;
      return me.getItemByDisplayValue(rawValue);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss">
@import "@/assets/scss/components/myComboBox.scss";
</style>