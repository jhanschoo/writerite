import { LocalAuthService } from "./LocalAuthService";

export class DevelopmentAuthService extends LocalAuthService {

  protected verify(_token: string): Promise<string | null> {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "testing") {
      return Promise.resolve("dev");
    }
    return Promise.resolve(null);
  }
}
