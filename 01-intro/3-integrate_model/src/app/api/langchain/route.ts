import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt") ?? "";

	const ollama = new Ollama({
		model: "gemma:2b",
	});

	const promptTemplate = PromptTemplate.fromTemplate(
		"Responde en menos de 15 palabras la siguiente consulta: {query}",
	);
	const chain = promptTemplate.pipe(ollama);

	const response = await chain.invoke({ query: prompt });

	return NextResponse.json({ response });
}
