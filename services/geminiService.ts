import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits or regenerates an image based on a text prompt.
 * Uses gemini-2.5-flash-image (Nano Banana)
 * Supports an optional second image for combining/merging.
 */
export const editImage = async (
  imageBase64: string, 
  mimeType: string, 
  prompt: string,
  image2Base64?: string,
  mimeType2?: string
): Promise<string[]> => {
  const modelId = 'gemini-2.5-flash-image';

  const parts: any[] = [
    {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    }
  ];

  // Add second image if provided
  if (image2Base64 && mimeType2) {
    parts.push({
      inlineData: {
        mimeType: mimeType2,
        data: image2Base64,
      },
    });
  }

  // Add text prompt last
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const images: string[] = [];
    
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                images.push(part.inlineData.data);
            }
        }
    }
    
    if (images.length === 0) {
        throw new Error("No image generated");
    }

    return images;

  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Identifies a song from an audio clip.
 */
export const identifySong = async (audioBase64: string, mimeType: string): Promise<string> => {
  const modelId = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64,
            },
          },
          {
            text: "Identify this song. Return the artist, title, and album if possible. Format the response nicely.",
          },
        ],
      },
    });

    return response.text || "Could not identify the song.";
  } catch (error) {
    console.error("Error identifying song:", error);
    throw error;
  }
};

/**
 * Analyzes an image and provides a detailed description.
 */
export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  const modelId = 'gemini-2.5-flash';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: "Analyze this image in detail. Describe what you see, including objects, colors, mood, and any text present.",
          },
        ],
      },
    });

    return response.text || "Could not analyze the image.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};