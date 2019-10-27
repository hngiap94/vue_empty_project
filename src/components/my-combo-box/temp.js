import MyStore from "@/api/store.js";
import _ from "lodash";

export default {
  props: {
    /**
     * Giá trị của combo
     */
    // value: {},

    /**
     * Nội dung title của combo
     */
    // title: {
    //   type: String,
    //   default: ""
    // },

    /**
     * Tooltip cho tittle của combo
     */
    // tooltip: {
    //   type: String,
    //   default: ""
    // },

    /**
     * Tên của combo
     */
    // name: {
    //   type: String,
    //   default: ""
    // },

    /**
     * Combo yêu cầu chọn
     */
    // required: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Quy định combo bắt buộc chọn
     */
    forceSelection: {
      type: Boolean,
      default: false
    },

    // rules: {
    //   type: String,
    //   default: ""
    // },

    /**
     * placeholder cho combo
     */
    // placeholder: {
    //   type: String,
    //   default: ""
    // },

    /**
     * Ẩn hiện button "Thêm"
     */
    // hasAddButton: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Set vị trí cho button "Thêm"
     */
    // btnAddOnMenu: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Ẩn hiện button "Tìm kiếm nhanh"
     */
    // hasQuickSearchButton: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Lựa chọn combo dạng tree
     */
    // comboTree: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Cấu hình cột cho combo
     */
    // columns: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },

    /**
     * Store load dữ liệu cho combo
     */
    // store: {
    //   type: MyStore
    // },

    /**
     * Chế độ query của combo
     */
    // queryMode: {
    //   type: String,
    //   default: "remote"
    // },

    /**
     * Tự động load dữ liệu khi khởi tạo combo
     */
    // autoLoad: {
    //   type: Boolean,
    //   default: false
    // },

    /**
     * Trường hiển thị của combo
     */
    // displayField: {
    //   type: String,
    //   default: ""
    // },

    /**
     * Trường lấy dữ liệu của combo
     */
    // valueField: {
    //   type: String,
    //   default: ""
    // },

    /**
     * giá trị mặc định của combo
     */
    // defaultValue: {
    //   type: String,
    //   default: ""
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
    return {
      /**
       * Loại combo
       */
      // comboType: 1,

      /**
       * Tên default của combo
       */
      // comboNameDefault: "ComboBox",

      /**
       * Dữ liệu của combo
       */
      // datax: me.store.data.items,

      /**
       * Thuộc tính ẩn hiện dropdown menu
       */
      // isExpanded: false,

      /**
       * Chứa danh sách item được chọn
       */
      // selected: null,

      /**
       * Chứa danh sách item được chọn trước đó
       */
      // lastSelected: null,

      /**
       * Chứa chuỗi input người dùng nhập vào
       */
      // queryString: null,

      /**
       * Chứa chuỗi input người dùng nhập vào trước đó
       */
      // lastQueryString: null,

      /**
       * Trạng thái focus của combo
       *isFocus: false,
      // loading: false,

      // defaultColumn: {
      //   title: "",
      //   tooltip: "",
      //   field: "",
      //   width: 120,
      //   titleAlign: "left",
      //   columnAlign: "left"
      // },
      //isFocus: false,
      // loading: false,

      // defaultColumn: {
      //   title: "",
      //   tooltip: "",
      //   field: "",
      //   width: 120,
      //   titleAlign: "left",
      //   columnAlign: "left"
      // }, false,
      // loading: false,

      // defaultColumn: {
      //   title: "",
      //   tooltip: "",
      //   field: "",
      //   width: 120,
      //   titleAlign: "left",
      //   columnAlign: "left"
      // },
      menuPos: {}
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
    // stateClasses() {
    //   let me = this;
    //   return {
    //     "combo--open": me.isExpanded,
    //     "combo--uneditable": !me.editable,
    //     "combo--readonly": me.isReadOnly,
    //     "combo--disabled": me.isDisabled,
    //     "combo--focus": me.isFocus
    //   };
    // },

    /**
     * Lấy cấu hình column, có default
     */
    // columnx() {
    //   let me = this,
    //     columnx = [];
    //   if (me.columns && me.columns.length !== 0) {
    //     for (const column of me.columns) {
    //       columnx.push(Object.assign({}, me.defaultColumn, column));
    //     }
    //     return columnx;
    //   }
    // },
    // dataShow() {
    //   let me = this;
    //   return me.datax;
    // },

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

    // comboName() {
    //   let me = this;
    //   if (!me.name) {
    //     if (!me.title) {
    //       return me.comboNameDefault;
    //     }
    //     return me.title;
    //   }
    //   return me.name;
    // }
  },
  watch: {
    /**
     * Theo dõi sự ẩn hiện của menu
     * - Nếu hiện menu thì thêm menu vào thẻ <body>, set position cho menu
     * @param {Boolean} newVal
     * @param {Boolean} oldVal
     */
    isExpanded(newVal) {
      let me = this;
      if (newVal) {
        me.$nextTick(() => {
          me.insertMenuIntoBody();
          me.menuPos = me.getMenuPosition();
        });
      }
    },

    /**
     * Theo dõi sự thay đổi v-model
     * - Nếu ban đầu có v-model và combo có dữ liệu (local) thì load lên item
     * - Nếu trong quá trình sử dụng có thay đổi v-model thì load lên item
     */
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        this.doSelectValue(newVal, oldVal);
      }
    },

    /**
     * Theo dõi giá trị default value
     * - Nếu set defaultValue từ đầu thì binding ra luôn
     * - Trường hợp defaultValue load từ server về thì cần binding khi có thay đổi
     */
    defaultValue: {
      immediate: true,
      handler(newVal, oldVal) {
        this.setDefaultValue(newVal, oldVal);
      }
    }
  },
  methods: {
    /**
     * Hàm khởi tạo combo
     */
    // initCombo() {
    //   let me = this;
    //   if (me.mode === "dropdownlist") {
    //     me.editable = false;
    //   }

    //   if (me.comboTree) {
    //     me.comboType = 3;
    //   } else if (me.columns && me.columns.length !== 0) {
    //     me.comboType = 2;
    //   }
    // },

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
      return val !== undefined && val !== "";
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
     * Hàm thực hiện select giá trị khi có sự thay đổi của value
     * @virtual
     */
    doSelectValue() {},

    /**
     * hàm set giá trị default của combo
     * @virtual
     */
    setDefaultValue() {},

    /**
     * Xử lý sự kiện click vào title của combo
     * Focus vào ô input
     * @private
     */
    // clickTitle() {
    //   let me = this;
    //   me.$refs.comboInput.focus();
    // },

    /**
     * handle sự kiện click button "Tìm kiếm nhanh"
     */
    // onBtnQuickSearchClick() {
    //   let me = this;
    //   me.collapse();
    //   me.$emit("clickQuickSearch", event);
    // },

    /**
     * handle sự kiện click button "Thêm"
     */
    // onBtnAddClick() {
    //   let me = this;
    //   me.collapse();
    //   me.$emit("clickAdd", event);
    // },

    /**
     * lấy ra trường hiển thị của combo
     * @virtual
     */
    // getDisplayField() {},

    /**
     * lấy ra trường giá trị của combo
     * @virtual
     */
    // getValueField() {},

    /**
     * Tìm item khi biết giá trị của displayField
     * @virtual
     */
    // getItemByDisplayValue() {},

    /**
     * Tìm item khi biết giá trị của valueField
     * @virtual
     */
    // getItemByValue() {},

    /**
     * Lấy ra giá trị người dùng nhập ở ô input
     * @virtual
     */
    // getRawValue() {},

    /**
     * Set giá trị hiển thị của ô input
     * @virtual
     */
    // setRawValue() {},

    /**
     * Lấy giá trị(value) của combo
     * @virtual
     */
    // getComboValue() {},

    /**
     * lấy ra giá trị của item dựa vào valueField
     * @virtual
     */
    // getItemValue() {},

    /**
     * Lấy giá trị submit của item
     * @virtual
     */
    // getSubmitValue() {},

    /**
     * set giá trị submit cho combo
     * @virtual
     */
    // setSubmitValue() {},

    /**
     * Lấy trường hiển thị của item
     * @virtual
     */
    // getItemDisplayValue() {},

    /**
     * Lấy ra các item đang được chọn
     * @virtual
     */
    // getSelected() {},

    /**
     * Lưu item được chọn
     * @virtual
     */
    // setSelected() {},

    /**
     * Lấy ra item được chọn trước đó
     * @virtual
     */
    // getLastSelected() {},

    /**
     * Lưu item được chọn trước đó
     * @virtual
     */
    // setLastSelected() {},

    /**
     * hiện dropdown menu
     */
    // expand() {
    //   let me = this;
    //   if (!me.isExpanded) {
    //     me.isExpanded = true;
    //   }
    // },

    /**
     * Ẩn dropdown menu
     */
    // collapse() {
    //   let me = this;
    //   if (me.isExpanded) {
    //     me.isExpanded = false;
    //   }
    // },

    /**
     * handle sự kiện khi click vào button dropdown
     */
    // onTriggerClick() {
    //   let me = this;
    //   me.$refs.comboInput.focus();
    //   if (!me.isReadOnly && !me.isDisabled) {
    //     if (me.isExpanded) {
    //       me.collapse();
    //     } else {
    //       me.doQuery("", true, true);
    //     }
    //   }
    // },

    /**
     * Xử lý sự kiện người dùng click chọn một item
     * @virtual
     */
    onClickSelect() {},

    /**
     * Xử lý chọn một item
     * @virtual
     */
    select() {},

    /**
     * Chọn một item
     * @virtual
     */
    doSelect() {},

    /**
     * reset lại combo
     * @virtual
     */
    resetCombo() {},

    /**
     * Bỏ chọn một item
     * @virtual
     */
    deselect() {},

    /**
     * Xử lý sau khi chọn
     * @virtual
     */
    afterSelect() {},

    /**
     * Xử lý sau khi bỏ chọn
     * @virtual
     */
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

    /**
     * Handle sự kiện `click` ô input
     * @virtual
     */
    onInputClick() {},

    /**
     * Handle sự kiện `keydown` ô input
     */
    onInputKeyDown(event) {
      let me = this;
      switch (event.keyCode) {
        case 8:
          //  delete
          break;
        case 9:
          //  tab
          me.onTab();
          break;
        case 38:
          //  up.prevent
          event.preventDefault();
          if (me.isExpanded) {
            me.typeAheadUp();
          }
          break;
        case 40:
          //  down.prevent
          event.preventDefault();
          if (!me.isExpanded) {
            me.doQuery("", true, true);
          } else {
            me.typeAheadDown();
          }
          break;
        case 13:
          //  enter.prevent
          event.preventDefault();
          if (me.isExpanded) {
            me.typeAheadSelect();
          }
          break;
      }
    },

    /**
     * Xử lý sự kiện `tab`
     */
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

    /**
     * Xử lý sự kiện `Esc`
     */
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

    /**
     * Thực hiện query khi người dùng gõ
     */
    // doRawQuery() {},

    /**
     * Thực hiện query
     */
    // doQuery(queryString, expand, highlightSelected) {
    //   let me = this;
    //   try {
    //     if (queryString === me.lastQueryString) {
    //       me.expand();
    //       // me.afterQuery(true);
    //     }

    //     if (me.queryMode === "remote") {
    //       me.doRemoteQuery(queryString, expand, highlightSelected);
    //     } else {
    //       me.doLocalQuery(queryString, expand, highlightSelected);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    /**
     * Thực hiện query server
     */
    // doRemoteQuery() {},

    /**
     * Thực hiện query local
     * @param {*} queryString
     * @param {*} expand
     */
    // doLocalQuery(queryString, expand, highlightSelected) {
    //   let me = this;
    //   me.store.load();
    //   me.afterQuery(expand, highlightSelected);
    // },

    /**
     * Xử lý sau khi query
     * @virtual
     */
    // afterQuery() {},

    /**
     * Thêm rule validate choc combo
     * @param {*} currentRules
     * @param {*} appendRules
     */
    appendRules(currentRules, appendRules) {
      return currentRules + "|" + appendRules;
    },

    /**
     * Hiển thị lỗi combo
     * @param {[String]}} messages
     */
    setComboErrors(messages) {
      let me = this;
      me.$refs.provider.setErrors(messages);
    },

    /**
     * Thêm dropdown menu vào thẻ <body>
     * @private
     */
    insertMenuIntoBody() {
      let me = this,
        dropdownMenu = me.$refs.dropdownMenu;
      if (dropdownMenu) {
        document.body.insertBefore(dropdownMenu.$el, document.body.firstChild);
      }
    },

    /**
     * Xóa dropdown menu khỏi thẻ <body>
     * @private
     */
    removeMenuFromBody() {
      let me = this,
        dropdownMenu = me.$refs.dropdownMenu;
      if (dropdownMenu) {
        document.body.removeChild(dropdownMenu.$el);
      }
    },

    /**
     * Lấy vị trí của dropdown menu dựa theo vị trí của combo
     * @private
     */
    getMenuPosition() {
      let me = this,
        topx = 0,
        leftx = 0,
        minWidthx = 0,
        comboEl = me.$el,
        comboRect = comboEl.getBoundingClientRect(),
        dropdownMenuEl = me.$refs.dropdownMenu.$el;

      let windowWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      let windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;

      if (comboRect.left + dropdownMenuEl.offsetWidth > windowWidth) {
        leftx = comboRect.right - dropdownMenuEl.offsetWidth;
      } else {
        leftx = comboRect.left;
      }

      if (comboRect.bottom + dropdownMenuEl.offsetHeight > windowHeight) {
        topx = comboRect.bottom - 34 - dropdownMenuEl.offsetHeight;
      } else {
        topx = comboRect.bottom + 2;
      }

      minWidthx = comboRect.width;

      let menuPos = {
        left: `${leftx}px`,
        top: `${topx}px`,
        minWidth: `${minWidthx}px`
      };

      return menuPos;
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
  },
  beforeDestroy() {
    let me = this;
    me.removeMenuFromBody();
  }
};
