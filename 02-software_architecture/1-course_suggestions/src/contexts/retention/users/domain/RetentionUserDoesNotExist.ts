export class RetentionUserDoesNotExist extends Error {
	constructor(id: string) {
		super(`The retention user ${id} does not exist`);
	}
}
