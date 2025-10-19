export type NewsItem = {
  news_Id: string | number
  news_Title: string
  news_Content: string
  image: string
  insert_Date: string // ISO date string
  news_Source: string
  categrory_Name: string
  slug: string
  category_Id?: number
  type_Id?: number
  type_Name?: string
}