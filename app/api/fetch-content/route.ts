import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, format = 'md', liteMode = false, includeImages = true } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const apiKey = process.env.UNIFUNCS_API_KEY;

    if (!apiKey) {
      console.error('UNIFUNCS_API_KEY is not configured');

      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call Unifuncs API to fetch web content
    const response = await fetch(
      'https://api.unifuncs.com/api/web-reader/read',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          format,
          liteMode,
          includeImages,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('Unifuncs API error:', errorData);

      return NextResponse.json(
        { error: 'Failed to fetch content from URL', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      content: data.content || data,
      url,
    });
  } catch (error) {
    console.error('Error fetching content:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
