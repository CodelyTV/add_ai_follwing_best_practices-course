export class RetentionPostDoesNotExist extends Error {
	constructor(id: string) {
		super(`The retention post ${id} does not exist`);
	}
}
