import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GRSAI_API_KEY;

    if (!apiKey) {
      console.error('GRSAI_API_KEY is not configured');

      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Poll the GRSAI result endpoint
    // TODO: Verify the correct result endpoint URL from GRSAI API documentation
    // The API documentation doesn't specify a result polling endpoint,
    // so this endpoint structure is assumed based on common API patterns
    const response = await fetch(
      `https://grsai.dakka.com.cn/v1/draw/result/${taskId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      // Distinguish between different error types
      if (response.status === 404) {
        // Task not found or still pending
        return NextResponse.json({
          status: 'pending',
          taskId,
        });
      } else {
        // Other errors (4xx, 5xx)
        const errorData = await response.json().catch(() => ({}));

        return NextResponse.json(
          { error: 'Failed to poll task status', details: errorData },
          { status: response.status }
        );
      }
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error polling infographic:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
