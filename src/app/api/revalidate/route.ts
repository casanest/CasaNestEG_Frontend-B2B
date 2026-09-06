import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  return handleRevalidate(request)
}

export async function POST(request: Request) {
  return handleRevalidate(request)
}

async function handleRevalidate(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const tag = searchParams.get("tag")

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  if (!tag) {
    return NextResponse.json({ error: "Missing tag parameter" }, { status: 400 })
  }

  try {
    revalidateTag(tag, { expire: 0 })
    return NextResponse.json({ revalidated: true, tag })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to revalidate", detail: String(error) },
      { status: 500 }
    )
  }
}
