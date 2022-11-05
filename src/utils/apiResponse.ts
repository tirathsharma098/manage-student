export default class APIResponse {
  private readonly data: Object;
  private readonly message: string;
  private readonly success: boolean;

  constructor(
    data: Object = null,
    message: string = "",
    success: boolean = false
  ) {

    if (data) {
      this.data = data;
    }
    this.success = success;
    if (message) {
      this.message = message;
    }
  }
}




