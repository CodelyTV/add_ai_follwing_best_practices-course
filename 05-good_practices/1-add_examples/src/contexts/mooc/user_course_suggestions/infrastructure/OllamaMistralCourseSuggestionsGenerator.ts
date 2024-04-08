/* eslint-disable no-console */
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { CourseSuggestionsGenerator } from "../domain/CourseSuggestionsGenerator";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";

export class OllamaMistralCourseSuggestionsGenerator implements CourseSuggestionsGenerator {
	private readonly existingCodelyCourses = [
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

	async generate(userCourseSuggestions: UserCourseSuggestions): Promise<string> {
		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(
				`* Actúas como un recomendador de cursos avanzado.
                 * Solo debes sugerir cursos de la siguiente lista (IMPORTANTE: no incluyas cursos que no estén en la lista):
                 {codely_courses}
                 * Devuelve únicamente el listado de los 3 cursos recomendados, utilizando formato de lista en markdown.
                 * Los cursos completados por el usuario son:
                 {completed_courses}`,
			),
			new Ollama({
				model: "mistral",
				temperature: 0,
			}),
		]);

		return await chain.invoke({
			codely_courses: this.existingCodelyCourses.map((course) => `\t- ${course}`).join("\n"),
			completed_courses: userCourseSuggestions.completedCourses
				.map((course) => `* ${course}`)
				.join("\n"),
		});
	}
}
