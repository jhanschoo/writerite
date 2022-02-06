import { Readable } from "stream";

export enum AuthorizerType {
	GOOGLE = "GOOGLE",
	FACEBOOK = "FACEBOOK",
	LOCAL = "LOCAL",
	DEVELOPMENT = "DEVELOPMENT",
}

export enum Roles {
	user = "user",
	admin = "admin",
	wright = "wright",
}

export interface FileUpload {
	filename: string;
	mimetype: string;
	encoding: string;
	createReadStream: () => Readable;
}

export type Upload = Promise<FileUpload>;

export interface CurrentUser {
	id: string;
	roles: Roles[];
}

export enum UpdateType {
	CREATED = "CREATED",
	EDITED = "EDITED",
	DELETED = "DELETED",
}

export interface Update<T> {
	type: UpdateType;
	data: T | null;
}

export type SubscriptionIterator<T> = AsyncIterator<Update<T>>;
