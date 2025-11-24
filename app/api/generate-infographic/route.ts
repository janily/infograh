import { NextRequest, NextResponse } from 'next/server';

import {
  INFOGRAPHIC_STYLES,
  type InfographicStyle,
} from '@/lib/infographic-styles';

// Webhook special value to get immediate task ID response instead of streaming
// When set to '-1', GRSAI API returns task ID immediately for polling instead of streaming
const WEBHOOK_RETURN_ID = '-1';

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

    // Sanitize inputs to prevent prompt injection
    const sanitizedSummary = structuralSummary
      .replace(/[\r\n]+/g, ' ')
      .substring(0, 10000)
      .trim();
    // Allow alphanumeric, spaces, parentheses, and hyphens for language names
    const sanitizedLanguage = language
      .replace(/[^a-zA-Z0-9\s\-()]/g, '')
      .substring(0, 50);

    // Get style guidelines
    const styleGuidelines = INFOGRAPHIC_STYLES[style];

    // Build the prompt
    const prompt = `Create a professional, high-quality educational infographic based strictly on this structured content plan: ${sanitizedSummary}

VISUAL DESIGN RULES:
- ${styleGuidelines}
- LANGUAGE: The text within the infographic MUST be written in ${sanitizedLanguage}.
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

    const result = await response.json();

    console.log('GRSAI API Response:', JSON.stringify(result, null, 2));

    // GRSAI API returns: { code: 0, msg: "success", data: { id: "task-id" } }
    // when webHook is set to "-1"
    if (result.code !== 0) {
      console.error('GRSAI API error:', result.msg, result);
      return NextResponse.json(
        { error: result.msg || 'Failed to generate infographic', code: result.code },
        { status: 400 }
      );
    }

    // Return the data object which contains the task ID
    return NextResponse.json({
      success: true,
      data: result.data,
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
