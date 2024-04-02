/* eslint-disable no-console */
import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

import { CoursesSuggestionLlm } from "../domain/CoursesSuggestionLlm";

export class OllamaMistralCoursesSuggestionLlm implements CoursesSuggestionLlm {
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

	async predict(finishedCourses: string[]): Promise<string> {
		console.log("Finished courses:", finishedCourses);

		const chain = RunnableSequence.from([
			PromptTemplate.fromTemplate(
				`Sugiere 3 cursos en base a la oferta de cursos que tenemos:
				${this.courses.map((course) => `* ${course}`).join("\n")}
				
				Dado que actualmente el usuario ha finalizado los siguientes cursos:
				${finishedCourses.map((course) => `* ${course}`).join("\n")}
				`,
			),
			SystemMessagePromptTemplate.fromTemplate(
				`* Eres un recomendador de cursos.
				 * En tu respuesta SOLO devuelves el listado de cursos que recomiendas en formato lista de markdown.
				 * Sólo sugieres cursos en base a la oferta de cursos que tenemos.
				 * No das las gracias ni dices nada más extra, sólo devuelves el listado de cursos.
				 * El nombre de los cursos es en castellano.`,
			),
			new Ollama({
				model: "mistral",
			}),
		]);

		return await chain.invoke({ query: "prompt" });
	}
}
