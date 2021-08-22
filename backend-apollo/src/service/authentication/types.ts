import type { PrismaClient } from "@prisma/client";

export interface SigninOptions {
	prisma: PrismaClient;
	email: string;
	name?: string;
	token: string;
	identifier: string;
	persist?: boolean;
}

export interface AuthenticationProvider {
	signin(opts: SigninOptions): Promise<string | null>;
	verify(token: string): Promise<string | null>;
}
