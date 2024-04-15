/* eslint-disable no-console */
import { Ollama } from "@langchain/community/llms/ollama";
import { LengthBasedExampleSelector } from "@langchain/core/example_selectors";
import { Serialized } from "@langchain/core/load/serializable";
import { LLMResult } from "@langchain/core/outputs";
import { FewShotPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

import { CourseSuggestionsGenerator } from "../domain/CourseSuggestionsGenerator";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";

export class OllamaMistralCourseSuggestionsGeneratorWithLengthExamples
	implements CourseSuggestionsGenerator
{
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
		const prefix = `Dado unos curso de entrada, sugiere tres cursos relevantes de la siguiente lista (IMPORTANTE devuelve sólo los títulos de los cursos):
${this.formatCodelyCourses(this.existingCodelyCourses)}

Cumple con las siguientes reglas:
* Devuelve 3 cursos, ni más, ni menos.
* Devuelve sólo el título del curso.
* Devuelve sólo la lista de cursos, sin añadir información adicional.
* No añadas una introducción ni un mensaje de bienvenida.
* No me digas por qué has escogido los cursos. Solo quiero la lista de cursos.
* Mo modifiques los títulos de los cursos.

Dame las sugerencias para los siguientes cursos:`;

		const examplePrompt = new PromptTemplate({
			inputVariables: ["completed_courses", "suggested_courses"],
			template: "{completed_courses}\n{suggested_courses}",
		});

		const exampleSelector = await LengthBasedExampleSelector.fromExamples(
			[
				{
					completed_courses: this.formatCoursesInline(["Modelado del Dominio: Eventos de Dominio"]),
					suggested_courses: this.formatExampleCourses([
						"Modelado del dominio: Agregados",
						"Modelado del dominio: Repositorios",
						"Patrones de Diseño: Criteria",
					]),
				},
				{
					completed_courses: this.formatCoursesInline([
						"Linting en PHP",
						"Diseño de infraestructura: Mapeo de herencia en PHP",
					]),
					suggested_courses: this.formatExampleCourses([
						"Análisis de código estático en PHP",
						"Diseño de infraestructura: AWS SQS como cola de mensajería",
						"Diseño de infraestructura: RabbitMQ como cola de mensajería",
					]),
				},
				{
					completed_courses: this.formatCoursesInline(["Next.js: Open Graph Images"]),
					suggested_courses: this.formatExampleCourses([
						"Crea tu librería en React: Carousel",
						"Buenas prácticas con CSS: Colores",
						"TypeScript Avanzado: Mejora tu Developer eXperience",
					]),
				},
			],
			{
				examplePrompt,
				maxLength: 500,
			},
		);

		const dynamicPrompt = new FewShotPromptTemplate({
			prefix,
			examplePrompt,
			exampleSelector,
			suffix: "{completed_courses}",
			inputVariables: ["completed_courses"],
		});

		const prompt = await dynamicPrompt.format({
			completed_courses: this.formatCoursesInline(userCourseSuggestions.completedCourses),
		});

		return await new Ollama({
			model: "mistral",
			temperature: 0,
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
		}).invoke(prompt);
	}

	private formatCodelyCourses(courses: string[]): string {
		return courses.map((course) => `\t- ${course}`).join("\n");
	}

	private formatExampleCourses(courses: string[]): string {
		return `${courses.map((course) => `\t- ${course}`).join("\n")}\n---`;
	}

	private formatCoursesInline(courses: string[]): string {
		return `---\n${courses.join(", ")}`;
	}
}
