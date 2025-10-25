import { GoogleGenAI, Type } from "@google/genai";
import { ForgeryAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType
    },
  };
};

export const runForgeryDetectionProcess = async (originalImageBase64: string, tamperedImageBase64: string): Promise<ForgeryAnalysis> => {
    try {
        const prompt = `
            You are an expert in digital image forensics analyzing two images for tampering.
            Simulate a report from the PFDNet system based on the provided original and tampered images.
            Your response must be a valid JSON object.

            Simulate the following four phases:

            1.  **Cyber Vaccinator:** Describe how imperceptible perturbations pre-applied to the original image helped detect the forgery. Invent a plausible, technical-sounding mechanism.
            2.  **Forgery Detector:** Identify the specific forgery. Be descriptive, for example: "Localized a splice forgery in the upper-right quadrant where an object was digitally removed. The PFDNet model identified anomalous pixel variance and inconsistent JPEG compression artifacts."
            3.  **Self Recovery:** Describe how the original image content was restored from the embedded data. Mention a technique like 'Discrete Cosine Transform block analysis' to reconstruct the altered region.
            4.  **Quality Assurance:** Provide a final verification summary. Mention a technique like 'Run-Length Encoding (RLE) checksum validation' to confirm the integrity of the recovered image.

            Analyze the images and return your findings as a single JSON object with keys: "vaccinator", "detector", "recovery", "assurance".
        `;
        
        const originalMimeType = originalImageBase64.substring(originalImageBase64.indexOf(":") + 1, originalImageBase64.indexOf(";"));
        const tamperedMimeType = tamperedImageBase64.substring(tamperedImageBase64.indexOf(":") + 1, tamperedImageBase64.indexOf(";"));

        const originalImagePart = fileToGenerativePart(originalImageBase64, originalMimeType);
        const tamperedImagePart = fileToGenerativePart(tamperedImageBase64, tamperedMimeType);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{text: prompt}, originalImagePart, tamperedImagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vaccinator: { type: Type.STRING },
                        detector: { type: Type.STRING },
                        recovery: { type: Type.STRING },
                        assurance: { type: Type.STRING },
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as ForgeryAnalysis;

    } catch (error) {
        console.error("Error running forgery detection:", error);
        throw new Error("Could not get forgery analysis from the AI model.");
    }
};