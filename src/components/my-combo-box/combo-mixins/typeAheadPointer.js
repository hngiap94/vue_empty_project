export default {
  data() {
    return {
      typeAheadPointer: -1
    };
  },

  watch: {},

  methods: {
    /**
     * Move the typeAheadPointer visually up the list by
     * subtracting the current index by one.
     * @return {void}
     */
    typeAheadUp() {
      let me = this;
      if (me.typeAheadPointer > 0) {
        me.typeAheadPointer--;
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * adding the current index by one.
     * @return {void}
     */
    typeAheadDown() {
      let me = this;
      if (me.typeAheadPointer < me.datax.length - 1) {
        me.typeAheadPointer++;
      }
    },

    /**
     * Select the option at the current typeAheadPointer position.
     * Optionally clear the search input on selection.
     * @return {void}
     */
    typeAheadSelect() {
      let me = this;
      me.select(me.datax[me.typeAheadPointer], false, true);
    }
  }
};
