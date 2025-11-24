import { NextRequest, NextResponse } from 'next/server';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return new Response('ok', { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, format = 'md', liteMode = false, includeImages = true } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const apiKey = process.env.UNIFUNCS_API_KEY;

    if (!apiKey) {
      console.error('UNIFUNCS_API_KEY is not configured');

      return NextResponse.json(
        { error: 'UNIFUNCS_API_KEY not configured' },
        {
          status: 500,
          headers: corsHeaders,
        }
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
      const errorText = await response.text();

      console.error('Unifuncs API error:', response.status, errorText);

      return NextResponse.json(
        {
          error: `Failed to fetch article: ${response.status}`,
          details: errorText,
        },
        {
          status: response.status,
          headers: corsHeaders,
        }
      );
    }

    // Check response Content-Type
    const contentType = response.headers.get('Content-Type') || '';

    console.log('Response Content-Type:', contentType);

    let data;

    if (contentType.includes('application/json')) {
      // If JSON response
      data = await response.json();
    } else {
      // If text response, parse it
      const textContent = await response.text();

      console.log('Raw response text:', textContent.substring(0, 200)); // Log first 200 characters

      // Try to parse title and content from markdown format
      const lines = textContent.split('\n');
      let title = '未知标题';
      let content = textContent;

      // Find title
      for (const line of lines) {
        if (line.startsWith('Title:') || line.startsWith('title:')) {
          title = line.replace(/^Title:\s*|^title:\s*/i, '').trim();
          break;
        }
        if (line.startsWith('#')) {
          title = line.replace(/^#+\s*/, '').trim();
          break;
        }
      }

      data = {
        title: title,
        content: content,
        data: content,
      };
    }

    return NextResponse.json(
      {
        success: true,
        url: url,
        title: data.title || '未知标题',
        content: data.content || data.data || '',
        author: data.author,
        publishDate: data.publishDate,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Error in fetch-content function:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
