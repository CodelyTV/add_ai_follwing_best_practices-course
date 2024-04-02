import { Ollama } from "@langchain/community/dist/llms/ollama";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

import { CoursesSuggestionLlm } from "../domain/CoursesSuggestionLlm";
import { CourseSuggestion } from "../domain/CourseSuggestion";

export class OllamaLangChainCoursesSuggestionLlm implements CoursesSuggestionLlm {
	private readonly courses = [
		"Diseño de infraestructura: AWS SQS como cola de mensajería",
		"Patrones de Diseño: Criteria",
		"Diseño de infraestructura: RabbitMQ como cola de mensajería",
		"Diseño de infraestructura: Mapeo de herencia en PHP",
		"Next.js: Open Graph Images",
		"Problemas con DDD: Gestión de errores en Eventos de Domino",
		"Linting en PHP",
		"Modelado del Dominio: Eventos de Dominio",
		"Análisis de código estático en PHP",
		"Modelado del dominio: Agregados",
		"Buenas prácticas con CSS: Colores",
		"TypeScript Avanzado: Mejora tu Developer eXperience",
		"Grafana",
		"Modelado del dominio: Repositorios",
		"Crea tu librería en React: Carousel",
	];

	async predict(interests: string[]): Promise<CourseSuggestion[]> {
		console.log("Interests:", interests);

		const parser = StructuredOutputParser.fromZodSchema(
			z.object({
				suggestions: z
					.array(
						z.object({
							courseName: z.string().describe("Name of the course"),
							coveredInterests: z.array(z.string()).describe("Interests covered by the course"),
							suggestionReason: z.string().describe("Reason for suggesting the course"),
						}),
					)
					.describe("List of course suggestions"),
			}),
		);

		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(
				`
Given a list of interests: ${interests.map((interest) => `"${interest}"`).join(", ")}, suggest up to 3 courses from the following selection: ${this.courses.map((course) => `"${course}"`).join(", ")}.
Only suggest courses that align with the provided interests, specifically focusing on programming languages if they are listed among the interests. Avoid recommending courses on topics or languages not included in the interests list. For exemple, don't recommend the course "DDD en PHP" if there is no interest in "PHP" on the provided interest list.
For each suggestion, include the covered interests by the course. These interests MUST match the ones previously listed. Additionally, provide a brief rationale for each suggestion in Spanish. The reason should start with the word "Porque" (because) to explain the relevance.
Response format:
1. "Course name"; "Covered interests"; "Suggestion reason".
2. "Course name"; "Covered interests"; "Suggestion reason" (if applicable).
3. "Course name"; "Covered interests"; "Suggestion reason" (if applicable).
For example, if interests include "observabilidad" and "escalabilidad", a valid response could be:
"Grafana - Porque Grafana es una de las herramientas de observabilidad más populares que hay.",
"Diseño de infraestructura: AWS SQS como cola de mensajería - Porque las colas de mensajería con AWS SQSFavorece la escalabilidad."
Ensure the interests used to justify course recommendations are directly drawn from the provided interests list, preventing the generation of unrelated interests.
`.trim(),
			),
			new Ollama({
				model: "gemma:2b",
				temperature: 0,
			}),
			parser,
		]);

		const generated = parser.getFormatInstructions();

		console.log(generated);

		return generated.suggestions.map(
			(suggestion) =>
				new CourseSuggestion(
					suggestion.courseName,
					suggestion.suggestionReason,
					suggestion.coveredInterests,
				),
		);
	}
}
