
<script>
export default {
  name: "Combo",
  mixins: [],
  props: {
    title: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: "fade"
    }
  },
  data() {
    let me = this;
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>