import { generateObject, jsonObjectPrompt, ollama, zodSchema } from "modelfusion";
import { z } from "zod";

import { CoursesSuggestionModel } from "../domain/CoursesSuggestionModel";
import { CourseSuggestion } from "../domain/CourseSuggestion";

export class GemmaCoursesSuggestionModel implements CoursesSuggestionModel {
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
		const generated = await generateObject({
			model: ollama
				.CompletionTextGenerator({
					model: "mistral",
					temperature: 0.8,
				})
				.asObjectGenerationModel(jsonObjectPrompt.text()),

			schema: zodSchema(
				z.object({
					suggestions: z.array(
						z.object({
							courseName: z.string(),
							suggestionReason: z.string(),
						}),
					),
				}),
			),

			prompt:
				`Based on these interests: ${interests.join(", ")}, suggest up to 3 courses from the following list: ${this.courses.join(", ")} ` +
				`and provide a brief reason for each suggestion in Spanish. ` +
				`Response format: ` +
				`1. Course name - Reason for suggestion. ` +
				`2. Course name - Reason for suggestion (if applicable). ` +
				`3. Course name - Reason for suggestion (if applicable). ` +
				`For example, if interests include "observability" and "scalability", a valid response could be: ` +
				`"Grafana - Grafana es una de las herramientas de observabilidad más populares que hay.", ` +
				`"Diseño de infraestructura: AWS SQS como cola de mensajería - Favorece la escalabilidad mediante el desacoplamiento de componentes."`,
		});

		return generated.suggestions.map(
			(suggestion) => new CourseSuggestion(suggestion.courseName, suggestion.suggestionReason),
		);
	}
}
