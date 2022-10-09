class RuntimeError extends Error {
  constructor(token, message) {
    this.token = token;
    this.message = message;
  }
}

export { RuntimeError };
