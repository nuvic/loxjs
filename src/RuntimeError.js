class RuntimeError extends Error {
  constructor(token, message) {
    super();
    this.token = token;
    this.message = message;
  }
}

export { RuntimeError };
