import { NextRequest, NextResponse } from 'next/server';

// Infographic style presets
export const INFOGRAPHIC_STYLES = {
  FUN_PLAYFUL:
    'STYLE: Fun, playful, vibrant 2D vector illustrations. Use bright colors, rounded shapes, and a friendly tone.',
  CLEAN_MINIMALIST:
    'STYLE: Ultra-minimalist. Lots of whitespace, thin lines, limited color palette (1-2 accent colors max). Very sophisticated and airy.',
  DARK_MODE_TECH:
    'STYLE: Dark mode technical aesthetic. Dark slate/black background with bright, glowing accent colors (cyan, lime green) for data points.',
  MODERN_EDITORIAL:
    'STYLE: Modern, flat vector illustration style. Clean, professional, and editorial (like a high-end tech magazine). Cohesive, mature color palette.',
} as const;

// Webhook special value to get immediate task ID response instead of streaming
const WEBHOOK_RETURN_ID = '-1';

export type InfographicStyle = keyof typeof INFOGRAPHIC_STYLES;

type GenerateInfographicRequest = {
  structuralSummary: string;
  style?: InfographicStyle;
  language?: string;
  aspectRatio?: string;
  imageSize?: '1K' | '2K' | '4K';
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateInfographicRequest = await request.json();
    const {
      structuralSummary,
      style = 'MODERN_EDITORIAL',
      language = 'English',
      aspectRatio = 'auto',
      imageSize = '1K',
    } = body;

    if (!structuralSummary) {
      return NextResponse.json(
        { error: 'Structural summary is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GRSAI_API_KEY;

    if (!apiKey) {
      console.error('GRSAI_API_KEY is not configured');

      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get style guidelines
    const styleGuidelines = INFOGRAPHIC_STYLES[style];

    // Build the prompt
    const prompt = `Create a professional, high-quality educational infographic based strictly on this structured content plan: ${structuralSummary}

VISUAL DESIGN RULES:
- ${styleGuidelines}
- LANGUAGE: The text within the infographic MUST be written in ${language}.
- LAYOUT: MUST follow the "VISUAL METAPHOR IDEA" from the plan above if one was provided.
- TYPOGRAPHY: Clean, highly readable sans-serif fonts. The "INFOGRAPHIC HEADLINE" must be prominent at the top.
- CONTENT: Use the actual text from "KEY TAKEAWAYS" in the image. Do not use placeholder text like Lorem Ipsum.
- GOAL: The image must be informative and readable as a standalone graphic.`;

    // Call GRSAI Nano Banana API
    const response = await fetch(
      'https://grsai.dakka.com.cn/v1/draw/nano-banana',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'nano-banana-pro',
          prompt,
          aspectRatio,
          imageSize,
          shutProgress: false,
          webHook: WEBHOOK_RETURN_ID, // Return ID immediately instead of using webhook
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('GRSAI API error:', errorData);

      return NextResponse.json(
        { error: 'Failed to generate infographic', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the task ID for polling or the complete result
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error generating infographic:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
