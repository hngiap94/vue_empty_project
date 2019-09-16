/**
 * FIXME: Đang sử dụng nhiều `dropdownItems = me.$refs.dropdownMenu.$refs.dropdownItems`
 * FIXME: Đang sử dụng 2 lần $ref để lấy được dropdownItems
 */

export default {
  watch: {
    typeAheadPointer() {
      let me = this;
      me.maybeAdjustScroll();
    }
  },

  methods: {
    /**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
    maybeAdjustScroll(highlightSelected) {
      let me = this;
      let pixelsToPointerTop = me.pixelsToPointerTop();
      let pointerHeight = me.pointerHeight();
      let pixelsToPointerBottom = pixelsToPointerTop + pointerHeight;
      let viewport = me.viewport();

      if (pixelsToPointerTop < viewport.top) {
        return me.scrollTo(pixelsToPointerTop);
      } else if (pixelsToPointerBottom > viewport.bottom) {
        if (highlightSelected) {
          return me.scrollTo(pixelsToPointerTop);
        }
        return me.scrollTo(viewport.top + pointerHeight);
      }
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the top of the current pointer element.
     * @returns {number}
     */
    pixelsToPointerTop() {
      let me = this,
        pixelsToPointerTop = 0,
        dropdownItems = me.$refs.dropdownMenu.$refs.dropdownItems;
      if (dropdownItems) {
        for (let i = 0; i < me.typeAheadPointer; i++) {
          pixelsToPointerTop += dropdownItems.children[i].offsetHeight;
        }
      }
      return pixelsToPointerTop;
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the bottom of the current pointer element.
     * @returns {*}
     */
    // pixelsToPointerBottom() {
    //   return this.pixelsToPointerTop() + this.pointerHeight();
    // },

    /**
     * The offsetHeight of the current pointer element.
     * @returns {number}
     */
    pointerHeight() {
      let me = this,
        dropdownItems = me.$refs.dropdownMenu.$refs.dropdownItems,
        pointerHeight = 0;
      if (dropdownItems) {
        pointerHeight =
          dropdownItems.children[me.typeAheadPointer].offsetHeight;
      }
      return pointerHeight;
    },

    /**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
    viewport() {
      let me = this,
        dropdownItems = me.$refs.dropdownMenu.$refs.dropdownItems;
      return {
        top: dropdownItems ? dropdownItems.scrollTop : 0,
        bottom: dropdownItems
          ? dropdownItems.scrollTop + dropdownItems.offsetHeight
          : 0
      };
    },

    /**
     * Scroll the dropdownMenu to a given position.
     * @param position
     * @returns {*}
     */
    scrollTo(position) {
      let me = this,
        dropdownItems = me.$refs.dropdownMenu.$refs.dropdownItems;

      return dropdownItems ? (dropdownItems.scrollTop = position) : null;
    }
  }
};
