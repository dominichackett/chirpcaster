import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { title, hostWallets } = await request.json();

  try {
    const response = await fetch("https://api.huddle01.com/api/v1/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_HUDDLE01_API_KEY!
      },
      body: JSON.stringify({ title,muteOnEntry	:true,roomType:"VIDEO",roomLocked:false })
    });

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
