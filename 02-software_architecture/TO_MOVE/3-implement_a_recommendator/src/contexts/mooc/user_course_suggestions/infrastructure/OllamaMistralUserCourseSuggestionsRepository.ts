import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

export class OllamaMistralUserCourseSuggestionsRepository
	implements UserCourseSuggestionsRepository
{
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

	async byCompletedCourses(completedCourses: string[]): Promise<string> {
		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(`{completedCourses}`),
			SystemMessagePromptTemplate.fromTemplate(
				`* Actúas como un recomendador de cursos avanzado.
                 * Solo debes sugerir cursos de la siguiente lista (IMPORTANTE: no incluyas cursos que no estén en la lista):
                 ${this.courses.map((course) => `\t- ${course}`).join("\n")}
                 * Devuelve únicamente el listado de los 3 cursos recomendados, utilizando formato de lista en markdown.
                 * Mantén la respuesta centrada en la recomendación, sin añadir agradecimientos o comentarios adicionales.
                 * Asegúrate de que los cursos recomendados sean relevantes para el progreso del usuario, basándote en los cursos que ya ha completado.
                 * Los cursos que ya ha completado el usuario son los que te proveerá.
                 * Devuelve los cursos en castellano.
                 * No puedes añadir cursos que el usuario ya ha completado.
                 * Devuelve sólo los nombres de los cursos, sin añadir información adicional.`,
			),
			new Ollama({
				model: "mistral",
				temperature: 0,
			}),
		]);

		return await chain.invoke({
			completedCourses: completedCourses.map((course) => `* ${course}`).join("\n"),
		});
	}
}
