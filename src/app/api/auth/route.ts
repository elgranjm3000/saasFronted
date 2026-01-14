import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Implement authentication logic
    // For now, just return a mock response
    return NextResponse.json({
      user: {
        id: 1,
        email: body.email,
        name: 'User'
      },
      token: 'mock-token'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
