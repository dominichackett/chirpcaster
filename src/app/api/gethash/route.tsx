import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {url } = await request.json();

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
