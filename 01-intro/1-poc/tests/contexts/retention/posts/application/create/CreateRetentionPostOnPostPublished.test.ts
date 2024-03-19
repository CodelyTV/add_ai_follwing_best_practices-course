import { CreateRetentionPostOnPostPublished } from "../../../../../../src/contexts/retention/posts/application/create/CreateRetentionPostOnPostPublished";
import { RetentionPostCreator } from "../../../../../../src/contexts/retention/posts/application/create/RetentionPostCreator";
import { PostIdMother } from "../../../../rrss/posts/domain/PostIdMother";
import { PostPublishedDomainEventMother } from "../../../../rrss/posts/domain/PostPublishedDomainEventMother";
import { RetentionPostMother } from "../../domain/RetentionPostMother";
import { MockRetentionPostRepository } from "../../infrastructure/MockRetentionPostRepository";

describe("CreateRetentionPostOnPostPublished should", () => {
	const repository = new MockRetentionPostRepository();
	const subscriber = new CreateRetentionPostOnPostPublished(new RetentionPostCreator(repository));

	it("not create a retention post if already exist", async () => {
		const event = PostPublishedDomainEventMother.create();
		const postId = PostIdMother.create(event.id);

		repository.shouldSearch(RetentionPostMother.create({ id: postId.value }));

		await subscriber.on(event);
	});

	it("create a new retention post", async () => {
		const event = PostPublishedDomainEventMother.create();
		const postId = PostIdMother.create(event.id);

		const post = RetentionPostMother.create({
			id: event.id,
			userId: event.userId,
		});

		repository.shouldSearchAndReturnNull(postId);
		repository.shouldSave(post);

		await subscriber.on(event);
	});
});
