/* eslint-disable @typescript-eslint/naming-convention */
import { z } from "zod";

const keySchema = z.object({
  kty: z.string(),
});

const keyTransform =
  (path: (string | number)[]) => (o: string, ctx: z.RefinementCtx) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(o);
    const validationResult = keySchema.safeParse(parsed);
    if (validationResult.success) {
      /*
       * note: we return `parsed` instead of `validationResult` to preserve fields independent of
       *   the `kty`, etc. in this data.
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsed as z.SafeParseSuccess<{ kty: string }>["data"];
    } else {
      for (const { path: pathSuffix, ...rest } of (
        validationResult as z.SafeParseError<{ kty: string }>
      ).error.issues) {
        ctx.addIssue({ path: [...path, ...pathSuffix], ...rest });
      }
      // we improperly coerce the type here, but it's safe because we've already added issues
      return undefined as unknown as z.SafeParseSuccess<{
        kty: string;
      }>["data"];
    }
  };

const envSchema = z.object({
  DATABASE_URL: z.string(),
  FACEBOOK_APP_ID: z.string(),
  FACEBOOK_APP_SECRET: z.string(),
  GAPI_CLIENT_ID: z.string(),
  GAPI_CLIENT_SECRET: z.string(),
  JWT_PRIVATE_KEY: z.string().transform(keyTransform(["JWT_PRIVATE_KEY"])),
  JWT_PUBLIC_KEY: z.string().transform(keyTransform(["JWT_PUBLIC_KEY"])),
  NODE_ENV: z.enum(["development", "production", "test"]),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  RECAPTCHA_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
