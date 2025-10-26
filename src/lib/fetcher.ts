export const fetcher = async (url?: string) => {
  const externalApi = "https://newsapi.timesmed.com/WebAPI/getnewslist?siteId=9&language=English"

  let apiUrl: string
  const isServer = typeof window === "undefined"

  if (url) {
    if (url === "/api/news") {
      apiUrl = isServer ? externalApi : "/api/news"
    } else {
      apiUrl = url
    }
  } else {
    apiUrl = isServer ? externalApi : "/api/news"
  }

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    // If caller requested the internal proxy `/api/news`, return the full data object
    if (url === "/api/news") {
      if (data?.data) return data
      if (data.news) return { data: { news: data.news } }
      return { data: { news: [] } }
    }

    if (!url) {
      if (data?.data?.news && Array.isArray(data.data.news)) return data.data
      if (Array.isArray(data)) return { news: data }
      if (data.news && Array.isArray(data.news)) return { news: data.news }

      return data
    }

    return data
  } catch (error) {
    console.error("API fetch error:", error)
    return { news: [], blogs: [], videos: [], galleries: [] }
  }
}
