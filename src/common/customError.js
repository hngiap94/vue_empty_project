export default class customError extends Error {
  constructor(component, ...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, customError);
    }
    this.component = component;
  }
}
