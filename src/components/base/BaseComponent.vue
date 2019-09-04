<script>
export default {
  name: "BaseComponent",
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    isReadOnly() {
      let me = this;
      return me.readOnly;
    },
    isDisabled() {
      let me = this;
      return me.disabled;
    }
  }
};
</script>