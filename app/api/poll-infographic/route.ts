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
    // According to GRSAI API docs, the /v1/draw/result endpoint uses POST method
    // and expects the task ID in the request body
    const response = await fetch(
      'https://grsai.dakka.com.cn/v1/draw/result',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          id: taskId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error(`Error polling task ${taskId}:`, response.status, errorData);

      return NextResponse.json(
        { error: 'Failed to poll task status', details: errorData },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log(`Poll result for taskId ${taskId}:`, JSON.stringify(result, null, 2));

    // GRSAI API returns: { code: 0, msg: "success", data: { id, results, progress, status, ... } }
    // code: 0 = success, -22 = task not found
    if (result.code === -22) {
      // Task not found
      console.log(`Task ${taskId} not found (code: -22) - returning pending status`);
      return NextResponse.json({
        success: true,
        data: {
          status: 'pending',
          taskId,
        },
      });
    }

    if (result.code !== 0) {
      console.error(`GRSAI API error for task ${taskId}, code: ${result.code}, msg: ${result.msg}`);
      return NextResponse.json(
        { error: result.msg || 'API request failed', code: result.code },
        { status: 400 }
      );
    }

    // Return the data object which contains the actual task result
    return NextResponse.json({
      success: true,
      data: result.data,
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
