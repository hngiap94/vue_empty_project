export default {
  item_in_list: {
    params: ["list", "displayField"],
    validate(value, { list, displayField }) {
      return list.some(item => {
        if (typeof item === "object") {
          item = item[displayField];
        }
        return item.toLowerCase() === value.toLowerCase();
      });
    },
    message: "Dữ liệu không có trong danh sách"
  }
};
