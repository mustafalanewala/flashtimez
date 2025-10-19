export const fetcher = async (url?: string) => {
  // If no URL provided, use our internal API route that proxies the real news API
  const apiUrl = url || "/api/news"

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    // If using our internal API route, the data should already be transformed
    if (!url) {
      // Handle different possible response structures
      if (Array.isArray(data)) {
        return data
      } else if (data.data?.news && Array.isArray(data.data.news)) {
        return data.data.news
      } else if (data.news && Array.isArray(data.news)) {
        return data.news
      } else {
        console.warn('Unexpected API response structure:', data)
        return []
      }
    }

    return data
  } catch (error) {
    console.error('API fetch error:', error)
    // Fallback to static data if API fails
    try {
      const fallbackRes = await fetch('/data/data.json', { cache: "no-store" })
      if (!fallbackRes.ok) throw new Error("Fallback data fetch failed")
      const fallbackData = await fallbackRes.json()

      // Transform static data to match API field names (camelCase)
      return fallbackData.map((item: any) => ({
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
    } catch (fallbackError) {
      console.error('Fallback data fetch also failed:', fallbackError)
      return []
    }
  }
}
