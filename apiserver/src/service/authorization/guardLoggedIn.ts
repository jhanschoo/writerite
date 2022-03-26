import { Context, LoggedInContext } from "../../context";
import { userNotLoggedInErrorFactory } from "../../error/userNotLoggedInErrorFactory";

export function notLoggedIn(context: Context) {
	return !context.sub;
}

export function guardLoggedIn<T, U, V, W>(f: (parent: T, args: U, context: LoggedInContext, info: V) => W) {
	return (parent: T, args: U, context: Context, info: V): W => {
		if (notLoggedIn(context)) {
			throw userNotLoggedInErrorFactory();
		}
		return f(parent, args, context as LoggedInContext, info);
	};
}
