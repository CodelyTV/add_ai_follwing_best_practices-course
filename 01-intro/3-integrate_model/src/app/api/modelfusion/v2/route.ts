import { generateObject, jsonObjectPrompt, ollama, zodSchema } from "modelfusion";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt") ?? "";

	const response = await generateObject({
		model: ollama
			.CompletionTextGenerator({
				model: "mistral",
				temperature: 0,
			})
			.asObjectGenerationModel(jsonObjectPrompt.text()),
		schema: zodSchema(
			z.object({
				respuesta: z.string().describe("Response a la pregunta formulada."),
				fuentes: z
					.array(z.string())
					.describe("Fuentes para responder a la pregunta, urls a páginas web."),
			}),
		),
		prompt: `Responde la siguiente pregunta lo mejor posible en castellano: ${prompt}`,
		// logging: "detailed-object",
	});

	return NextResponse.json({ ...response });
}
