import { NextRequest, NextResponse } from 'next/server'

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function GET(request: NextRequest) {
  try {
    const apiUrl = 'https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=9&language=English'

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Return the raw external API response so client can access news, blogs, videos and galleries
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json({ error: 'Failed to proxy external news API' }, { status: 500 })
  }
}