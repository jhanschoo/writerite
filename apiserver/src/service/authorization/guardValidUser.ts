import { LoggedInContext } from "../../context";
import { userNotValidUserErrorFactory } from "../../error";
import { guardLoggedIn } from "./guardLoggedIn";

export async function notValidUser({ prisma, sub }: LoggedInContext) {
  const user = await prisma.user.findUnique({ where: {
    id: sub.id,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    OR: [
      {
        name: null,
      }, {
        name: "",
      },
    ],
  } });
  return Boolean(user);
}

export function guardValidUser<T, U, V, W>(f: (parent: T, args: U, context: LoggedInContext, info: V) => W) {
  return guardLoggedIn<T, U, V, W extends Promise<infer X> ? Promise<X> : W>((async (parent, args, context, info) => {
    if (await notValidUser(context)) {
      throw userNotValidUserErrorFactory();
    }
    const ret = f(parent, args, context, info);
    return ret;
  }) as (parent: T, args: U, context: LoggedInContext, info: V) => W extends Promise<infer X> ? Promise<X> : W);
}
