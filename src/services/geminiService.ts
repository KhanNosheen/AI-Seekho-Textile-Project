import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FabricSpecs {
  fiberType: string;
  gsm: string;
  weave: string;
  finish: string;
  useCase: string;
  vizOption?: string;
}

export interface TextileAnalysis {
  isClarificationNeeded: boolean;
  questions?: string[];
  marketing?: {
    headline: string;
    benefits: string[];
    story: string;
    cta: string;
  };
  sales?: {
    summary: string;
    techSpecsText: string;
    useCases: string[];
  };
  quality?: {
    points: { label: string; value: string }[];
  };
  visualizationAdvice?: string;
}

const SYSTEM_PROMPT = `
You are the "Senior Textile Design Consultant" for a high-end manufacturing factory. Your expertise spans technical fiber science, luxury design trends, and B2B sales strategy.

When provided with Fiber Type, GSM, Weave, Finish, Intended Use, and an optional Design Visualization choice, you must generate a comprehensive Design and Sales Brief.

### DESIGN VISUALIZATION & INTUITION
If "AI Pattern Generator" is selected, DO NOT ask follow-up questions. Use your professional intuition to provide:
1. ARTISTIC STYLE: Select the most commercially viable style (e.g., 'Modern Geometric' for Curtains, 'Elegant Floral' for Bedsheets) based on the "Intended Use".
2. COLOR PALETTE: Suggest a seasonal palette with specific Pantone TCX codes.
3. SCALE & PRINT STRATEGY: Specific technical layout advice (e.g., 'Engineered Border Design' for Bedding, 'Large-scale vertical motif' for Curtains).

If "3D Drape Simulation" or "Seasonal Palette" are selected, you may still provide expert guidance or ask for specific details if critical variables are missing.

### SALES INTELLIGENCE
Always provide:
1. B2B NEGOTIATION HOOKS: 2 specific value-based selling points.
2. OBJECTION HANDLING: Address technical concerns like shrinkage or lead times specific to the fiber/weave.
3. NEXT-BEST ACTION: A tactical recommendation for a sales meeting.

### OUTPUT SPECS
1. MARKETING: High-energy luxury vibes.
2. SALES: Professional and data-driven.
3. QUALITY: Technical checklist (Durability, Breathability, Shrink Resistance).
4. VISUALIZATION ADVICE: Formatted as a "Design and Sales Brief" using professional language.

Maintain a sophisticated, factory-direct expert tone. Use technical specs (GSM, Weave) to justify design/sales recommendations.
`;

export async function analyzeFabric(specs: FabricSpecs): Promise<TextileAnalysis> {
  const prompt = `
  Fiber Type: ${specs.fiberType}
  GSM/Weight: ${specs.gsm}
  Weave/Knit: ${specs.weave}
  Finish: ${specs.finish}
  Intended Use: ${specs.useCase}
  Design Visualization Requested: ${specs.vizOption || 'None'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isClarificationNeeded: { type: Type.BOOLEAN },
            questions: { type: Type.ARRAY, items: { type: Type.STRING } },
            marketing: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                story: { type: Type.STRING },
                cta: { type: Type.STRING },
              },
            },
            sales: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                techSpecsText: { type: Type.STRING },
                useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            quality: {
              type: Type.OBJECT,
              properties: {
                points: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            visualizationAdvice: { type: Type.STRING, description: "Highly detailed markdown formatted Design and Sales brief." },
          },
          required: ["isClarificationNeeded"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Fabric Analysis Error:", error);
    throw error;
  }
}
