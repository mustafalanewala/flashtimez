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

    const data = await response.json()

    // Transform the API data to match our expected format
    let newsArray: any[] = []

    if (data.data?.news && Array.isArray(data.data.news)) {
      newsArray = data.data.news
    } else if (Array.isArray(data)) {
      newsArray = data
    } else if (data.news && Array.isArray(data.news)) {
      newsArray = data.news
    }

    // Transform each news item to our expected format
    const transformedData = newsArray.map((item: any) => ({
      news_Id: item.news_Id || item.News_Id || item.newsId,
      news_Title: item.news_Title || item.News_Title || item.title,
      news_Content: item.news_Content || item.News_Content || item.content || item.description,
      image: item.image || item.Image || item.imageUrl,
      insert_Date: item.insert_Date || item.Insert_Date || item.date || item.publishedAt,
      news_Source: item.news_Source || item.News_Source || item.source || 'Unknown',
      categrory_Name: item.categrory_Name || item.Categrory_Name || item.category || 'General',
      slug: item.slug || item.Slug || generateSlug(item.news_Title || item.News_Title || item.title || 'news'),
      category_Id: item.category_Id || item.categoryId,
      type_Id: item.type_Id || item.typeId,
      type_Name: item.type_Name || item.typeName
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('API proxy error:', error)

    // Fallback to static data
    try {
      const fallbackResponse = await fetch(new URL('/data/data.json', request.url))
      if (!fallbackResponse.ok) {
        throw new Error('Fallback data not found')
      }
      const fallbackData = await fallbackResponse.json()

      // Transform static data to match API field names (camelCase)
      const transformedData = fallbackData.map((item: any) => ({
        news_Id: item.News_Id || item.news_Id,
        news_Title: item.News_Title || item.news_Title,
        news_Content: item.News_Content || item.news_Content,
        image: item.Image || item.image,
        insert_Date: item.Insert_Date || item.insert_Date,
        news_Source: item.News_Source || item.news_Source,
        categrory_Name: item.Categrory_Name || item.categrory_Name,
        slug: item.Slug || item.slug,
        category_Id: item.category_Id,
        type_Id: item.type_Id,
        type_Name: item.type_Name
      }))

      return NextResponse.json(transformedData)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      return NextResponse.json(
        { error: 'Failed to fetch news data' },
        { status: 500 }
      )
    }
  }
}