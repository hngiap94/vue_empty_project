import MyStore from "@/api/store.js";
import _ from "lodash";

export default {
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
     * Tên của combo
     */
    name: {
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
     * Quy định combo bắt buộc chọn
     */
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
      selected: null,

      /**
       * Chứa danh sách item được chọn trước đó
       */
      lastSelected: null,

      /**
       * Chứa chuỗi input người dùng nhập vào
       */
      queryString: "",

      lastQueryString: "",

      /**
       * Trạng thái focus của combo
       */
      isFocus: false,
      loading: false,

      defaultColumn: {
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
    dataShow() {
      let me = this;
      return me.datax;
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
    },

    comboName() {
      let me = this;
      if (!me.name) {
        if (!me.title) {
          return me.comboNameDefault;
        }
        return me.title;
      }
      return me.name;
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
      let me = this;
      if (!me.isStoreEmpty()) {
        let item = me.getItemByValue(value);
        me.select(item, false, true);
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

    getDisplayField() {},
    getValueField() {},
    getItemByDisplayValue() {},
    getItemByValue() {},
    getRawValue() {},
    setRawValue() {},
    getItemDisplayValue() {},
    getComboValue() {},
    getItemValue() {},
    getSubmitValue() {},
    setSubmitValue() {},
    getSelected() {},
    setSelected() {},
    getLastSelected() {},
    setLastSelected() {},

    /**
     * hiện dropdown menu
     */
    expand() {
      let me = this,
        dropdownMenu = me.$refs.dropdownMenu;
      if (!me.isExpanded) {
        me.isExpanded = dropdownMenu.isExpanded = true;
      }
    },

    /**
     * Ẩn dropdown menu
     */
    collapse() {
      let me = this,
        dropdownMenu = me.$refs.dropdownMenu;
      if (me.isExpanded) {
        me.isExpanded = dropdownMenu.isExpanded = false;
      }
    },

    /**
     * handle sự kiện khi click vào button dropdown
     */
    //TODO: trường hợp readOnly, disabled
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

    select() {},
    doSelect() {},
    resetCombo() {},
    deselect() {},
    afterSelect() {},
    afterDeselect() {},
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

    onInputClick() {},

    /**
     * Handle sự kiện `keydown` ô input
     */
    onInputKeyDown(event) {
      let me = this;
      switch (event.keyCode) {
        case 8:
          //  delete
          return;
        case 9:
          //  tab
          return me.onTab();
        case 38:
          //  up.prevent
          event.preventDefault();
          return me.typeAheadUp();
        case 40:
          //  down.prevent
          event.preventDefault();
          if (!me.isExpanded) {
            return me.doQuery("", true, true);
          } else {
            return me.typeAheadDown();
          }
        case 13:
          //  enter.prevent
          event.preventDefault();
          return me.typeAheadSelect();
      }
    },

    onTab() {},

    /**
     * handle sự kiện `keyup` ô input
     */
    onInputKeyUp(event) {
      let me = this;
      switch (event.keyCode) {
        case 27:
          //  esc
          return me.onEscape();
      }
    },

    onEscape() {},

    /**
     * Handle sự kiện `focus` ô input
     */
    onInputFocus(event) {
      let me = this;
      me.$emit("focus", event);
      me.isFocus = true;
    },

    /**
     * Handle sự kiện `blur` ô input
     */
    onInputBlur(event) {
      let me = this;
      me.$emit("blur", event);
      me.isFocus = false;
    },
    /**
     * Handle sự kiện `input` ô input
     */
    onInput() {},
    doRawQuery() {},

    doQuery() {},

    doRemoteQuery() {},
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
