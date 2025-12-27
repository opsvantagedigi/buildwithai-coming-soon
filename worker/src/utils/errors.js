export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class ValidationError extends Error {
  constructor(message = "Invalid input") {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class InternalError extends Error {
  constructor(message = "Internal Error") {
    super(message);
    this.name = "InternalError";
    this.status = 500;
  }
}
