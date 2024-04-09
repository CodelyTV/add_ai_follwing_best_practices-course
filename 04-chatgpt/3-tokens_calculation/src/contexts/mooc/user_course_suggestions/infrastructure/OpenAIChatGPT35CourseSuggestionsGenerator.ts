/* eslint-disable no-console */
import { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { OpenAI } from "@langchain/openai";

import { CourseSuggestionsGenerator } from "../domain/CourseSuggestionsGenerator";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";

export class OpenAIChatGPT35CourseSuggestionsGenerator implements CourseSuggestionsGenerator {
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
${this.existingCodelyCourses.map((course) => `\t- ${course}`).join("\n")}
* Devuelve únicamente el listado de los 3 cursos recomendados, utilizando formato de lista en markdown.
* Mantén la respuesta centrada en la recomendación, sin añadir agradecimientos o comentarios adicionales.
* Asegúrate de que los cursos recomendados sean relevantes para el progreso del usuario, basándote en los cursos que ya ha completado.
* Los cursos que ya ha completado el usuario son los que te proveerá.
* Devuelve los cursos en castellano.
* No puedes añadir cursos que el usuario ya ha completado.
* No añadas ningún titular, devuelve sólo los nombres de los cursos.,
* Devuelve sólo los nombres de los cursos, sin añadir información adicional.
{completedCourses}`,
			),
			new OpenAI({
				modelName: "gpt-3.5-turbo-0125",
				openAIApiKey: process.env.OPENAI_API_KEY,
				callbacks: [
					{
						handleLLMStart: (_llm: Serialized, prompts: string[]) => {
							console.log("-- PROMPT --\n");
							console.log(prompts[0]);
						},
						handleLLMEnd: (output: LLMResult) => {
							console.log("\n\n-- RESULT --\n");
							console.log(output.generations[0][0].text);
						},
					},
				],
			}),
		]);

		return await chain.invoke({
			completedCourses: userCourseSuggestions.completedCourses
				.map((course) => `\t- ${course}`)
				.join("\n"),
		});
	}
}
