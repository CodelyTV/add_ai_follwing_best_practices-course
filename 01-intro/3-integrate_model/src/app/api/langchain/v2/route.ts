import { Ollama } from "@langchain/community/llms/ollama";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt") ?? "";

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate(
			`Responde la siguiente pregunta lo mejor posible en castellano:\n{format_instructions}\n{pregunta}`,
		),
		new Ollama({
			model: "mistral",
			temperature: 1,
		}),
		StructuredOutputParser.fromZodSchema(
			z.object({
				respuesta: z.string().describe("Response a la pregunta formulada."),
				fuentes: z
					.array(z.string())
					.describe("Fuentes para responder a la pregunta, urls a páginas web."),
			}),
		),
	]);

	// console.log(parser.getFormatInstructions());

	const response = await chain.invoke({
		pregunta: prompt,
		format_instructions: StructuredOutputParser.fromZodSchema(
			z.object({
				respuesta: z.string().describe("Response a la pregunta formulada."),
				fuentes: z
					.array(z.string())
					.describe("Fuentes para responder a la pregunta, urls a páginas web."),
			}),
		).getFormatInstructions(),
	});

	return NextResponse.json({ ...response });
}
