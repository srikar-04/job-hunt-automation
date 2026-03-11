class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
