import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { UserId } from "../../users/domain/UserId";
import { UserRepository } from "../../users/domain/UserRepository";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

export class OllamaMistralUserCourseSuggestionsRepository
	implements UserCourseSuggestionsRepository
{
	constructor(private readonly userRepository: UserRepository) {}

	async search(userId: UserId): Promise<UserCourseSuggestions | null> {
		const user = await this.userRepository.search(userId);

		if (user === null || !user.hasCompletedAnyCourse()) {
			return null;
		}

		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(`Recomienda cursos similares a {completedCourses}`),
			new Ollama({
				model: "mistral",
			}),
		]);

		const suggestions = await chain.invoke({
			completedCourses: user.completedCourses.map((course) => `* ${course}`).join("\n"),
		});

		return UserCourseSuggestions.fromPrimitives({
			userId: userId.value,
			completedCourses: user.completedCourses,
			suggestions,
		});
	}
}
