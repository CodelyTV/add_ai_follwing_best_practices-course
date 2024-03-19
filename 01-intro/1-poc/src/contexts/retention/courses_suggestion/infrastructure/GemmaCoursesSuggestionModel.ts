import { generateText, ollama } from "modelfusion";

import { CoursesSuggestionModel } from "../domain/CoursesSuggestionModel";
import { CourseSuggestion } from "../domain/CourseSuggestion";

export class GemmaCoursesSuggestionModel implements CoursesSuggestionModel {
	async predict(interests: string[]): Promise<CourseSuggestion[]> {
		return await generateText({
			model: ollama
				.CompletionTextGenerator({
					model: "gemma:2b",
					temperature: 0.7,
					maxGenerationTokens: 120,
				})
				.withTextPrompt(),

			prompt: "¿Quién es Javier Ferrer?:\n\n",
		});
	}
}
