/* eslint-disable no-console */
import { Ollama } from "@langchain/community/llms/ollama";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

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
		const outputParser = StructuredOutputParser.fromZodSchema(
			z.array(
				z.object({
					suggestedCourse: z.string().describe("Curso sugerido."),
					reason: z.string().describe("Motivo por qué el curso es sugerido."),
				}),
			),
		);

		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(
				`* Actúas como un recomendador de cursos avanzado.
                 * Solo debes sugerir cursos de la siguiente lista (IMPORTANTE: no incluyas cursos que no estén en la lista):
                 ${this.existingCodelyCourses.map((course) => `\t- ${course}`).join("\n")}
                 * Devuelve una lista con los 3 cursos recomendados.
                 * No puedes añadir cursos que el usuario ya ha completado.
                 * Añade también el motivo de la sugerencia (IMPORTANTE: Ha de ser en castellano)
                 * Ejemplo de respuesta de la razón de la sugerencia: "Porque haciendo el curso de DDD en PHP has demostrado interés en PHP".
                 * Devuelve sólo la lista de cursos con sus razones, sin añadir información adicional.
                 * Siempre respondes utilizando el siguiente JSON Schema:
                 {format_instructions}
                 * Los cursos completados por el usuario son:
                 {completed_courses}`,
			),
			new Ollama({
				model: "mistral",
				temperature: 0,
			}),
			outputParser,
		]);

		const suggestions = await chain.invoke({
			completed_courses: userCourseSuggestions.completedCourses
				.map((course) => `* ${course}`)
				.join("\n"),
			format_instructions: outputParser.getFormatInstructions(),
		});

		console.log(suggestions);

		return JSON.stringify(suggestions);
	}
}
