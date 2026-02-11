export abstract class BaseController {
  protected ok<T>(data: T) {
    return {
      success: true,
      data,
    };
  }
}
