import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
	return bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string): Promise<string> {
	return bcrypt.hash(plain, SALT_ROUNDS);
}
