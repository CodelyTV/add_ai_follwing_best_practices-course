import { generateText, ollama } from "modelfusion";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt") ?? "";

	const response = await generateText({
		model: ollama
			.CompletionTextGenerator({
				model: "gemma:2b",
			})
			.withInstructionPrompt(),
		prompt: {
			system: "Eres un respondedor de preguntas. Tus respuestas no superan las 15 palabras.",
			instruction: prompt,
		},
	});

	return NextResponse.json({ response });
}
