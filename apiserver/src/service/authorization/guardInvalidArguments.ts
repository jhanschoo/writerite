import { AnyObjectSchema, InferType, ValidationError } from "yup";
import { invalidArgumentsErrorFactory } from "../../error/invalidArgumentsErrorFactory";

export function invalidArguments<S extends AnyObjectSchema>(schema: S, args: unknown): Promise<InferType<S>> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
	return schema.validate(args);
}

export function guardInvalidArguments<S extends AnyObjectSchema, A extends InferType<S>, T, C, V, W>(f: (parent: T, args: A, context: C, info: V) => W) {
	return (schema: S) => (async (parent: T, args: A, context: C, info: V) => {
		let validatedArgs: InferType<S>;
		try {
			validatedArgs = await invalidArguments(schema, args);
		} catch (e) {
			if (e instanceof ValidationError) {
				throw invalidArgumentsErrorFactory(JSON.stringify({
					name: e.name,
					errors: e.errors,
				}));
			}
			throw e;
		}
		return f(parent, validatedArgs, context, info);
	}) as (parent: T, args: A, context: C, info: V) => W extends Promise<infer X> ? Promise<X> : W;
}
