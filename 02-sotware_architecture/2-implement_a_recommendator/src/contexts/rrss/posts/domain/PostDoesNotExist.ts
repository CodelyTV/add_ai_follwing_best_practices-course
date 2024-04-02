export class PostDoesNotExist extends Error {
	constructor(id: string) {
		super(`The post ${id} does not exist`);
	}
}
