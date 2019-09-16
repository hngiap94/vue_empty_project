<template>
  <div class="home">
    <div class="test-area" style="width: 300px;">
      <my-combo-box
        title="combobox dropdown"
        tooltip="combobox tooltip"
        debug
        required
        hasAddButton
        hasQuickSearchButton
        :store="comboBoxStore"
        queryMode="local"
        displayField="customer_name"
        valueField="customer_id"
        v-model="currentItem.customer_id_1"
      ></my-combo-box>
      <p>v-model: {{ currentItem.customer_id_1 }}</p>
    </div>

    <div class="test-area" style="width: 300px;">
      <my-combo-box
        title="combobox dropdownlist"
        tooltip="combobox tooltip"
        required
        hasAddButton
        hasQuickSearchButton
        :store="comboBoxStore"
        mode="dropdownlist"
        queryMode="local"
        displayField="customer_name"
        valueField="customer_id"
        v-model="currentItem.customer_id"
      ></my-combo-box>
      <p>v-model: {{ currentItem.customer_id }}</p>
    </div>

    <div class="test-area" style="width: 300px;">
      <my-combo-box
        title="combobox columns"
        required
        hasAddButton
        hasQuickSearchButton
        :columns="comboboxColumns"
        :store="comboBoxStore"
        mode="dropdownlist"
        queryMode="local"
        displayField="customer_name"
        valueField="customer_id"
        v-model="currentItem.customer_id"
      ></my-combo-box>
      <p>v-model: {{ currentItem.customer_id }}</p>
    </div>

    <div class="test-area">
      <validation-provider :rules="'required'" v-slot="{ errors }">
        <input v-model="value" name="myinput" type="text" />
        <span>{{ errors[0] }}</span>
      </validation-provider>
    </div>

    <div class="test-area">
      <button @click="testFnc">Test</button>
    </div>
  </div>
</template>

<script>
import MyComboBox from "@/components/my-combo-box/MyComboBox.vue";
import MyStore from "@/api/store.js";
import { ValidationProvider, extend } from "vee-validate";

export default {
  name: "home",
  components: {
    MyComboBox,
    ValidationProvider
  },
  data() {
    return {
      value: "",
      currentItem: {
        customer_id: 1,
        customer_name: "hihi"
      },
      comboboxColumns: [
        {
          title: "Mã KH",
          tooltip: "Mã khách hàng",
          field: "customer_code"
        },
        {
          title: "Tên khách hàng",
          field: "customer_name",
          width: 250
        }
      ]
    };
  },
  computed: {
    comboBoxStore() {
      return new MyStore({
        data: {
          items: [
            {
              customer_id: 1,
              customer_code: "KH01",
              customer_name: "Nguyễn Văn A"
            },
            {
              customer_id: 2,
              customer_code: "KH02",
              customer_name: "Nguyễn Văn B"
            },
            {
              customer_id: 3,
              customer_code: "KH03",
              customer_name: "Nguyễn Văn C"
            },
            {
              customer_id: 4,
              customer_code: "KH04",
              customer_name: "Nguyễn Văn D"
            },
            {
              customer_id: 5,
              customer_code: "KH05",
              customer_name: "Nguyễn Văn E"
            },
            {
              customer_id: 6,
              customer_code: "KH06",
              customer_name: "Nguyễn Văn F"
            },
            {
              customer_id: 7,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 8,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 9,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 10,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 11,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 12,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 13,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 14,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            },
            {
              customer_id: 15,
              customer_code: "KH07",
              customer_name: "Nguyễn Văn G"
            }
          ]
        }
      });
    }
  },
  methods: {
    testFnc() {
      debugger;
    }
  },
  mounted() {
    let me = this;
  }
};
</script>

<style lang="scss" scoped>
.test-area {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}
</style>
