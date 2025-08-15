
import { GoogleGenAI, Type } from "@google/genai";
import type { Scene } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        story: {
            type: Type.STRING,
            description: "A paragraph of the story. Make it engaging and descriptive. If the story is concluding, make this the final paragraph and provide an empty choices array.",
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A visually rich, detailed prompt for an image generation model. Describe the scene, characters, and atmosphere. Use styles like 'epic fantasy art', 'cinematic sci-fi concept art', or 'dramatic oil painting'.",
        },
        choices: {
            type: Type.ARRAY,
            description: "An array of 2 to 4 strings, each representing a distinct action the player can take. If the story has ended, return an empty array.",
            items: {
                type: Type.STRING,
            },
        },
    },
    required: ["story", "imagePrompt", "choices"],
};

export const generateScene = async (prompt: string, history: string = ""): Promise<Scene> => {
    const fullPrompt = `
        You are a master storyteller for a dynamic text adventure game.
        Based on the user's prompt and the story history, generate the next scene.
        Ensure the story is creative and the choices are meaningful.

        Story History (what has happened so far):
        ${history}

        User's latest action or initial prompt:
        "${prompt}"

        Generate the next part of the story.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        const sceneData = JSON.parse(jsonText);
        
        // Basic validation
        if (
            typeof sceneData.story !== 'string' ||
            typeof sceneData.imagePrompt !== 'string' ||
            !Array.isArray(sceneData.choices)
        ) {
            throw new Error("Invalid scene data structure received from API.");
        }

        return sceneData as Scene;

    } catch (error) {
        console.error("Error generating scene:", error);
        throw new Error("Failed to generate the next part of the adventure. Please try again.");
    }
};


export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to create the visual for this scene. Please try again.");
    }
};
