export default class MyStore {
  constructor(options) {
    let me = this;
    if (options) {
      for (let option in options) {
        me[option] = options[option];
      }
    }
  }
  data = {
    items: []
  };

  load() {
    let me = this;
  }
}
