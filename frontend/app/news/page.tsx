'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { News, NewsCategory } from '@/lib/types'

export default function NewsPage() {
  const { t, language } = useLanguage()
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<News[]>('/api/news/published')
        setNewsList(response.data)
      } catch (err) {
        console.error('Failed to fetch news:', err)
        setError('Failed to load news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
      case NewsCategory.BREAKING:
        return 'blue'
      case NewsCategory.NEW:
        return 'green'
      case NewsCategory.EVENT:
        return 'yellow'
      case NewsCategory.UPDATE:
        return 'purple'
      default:
        return 'gray'
    }
  }

  const getCategoryLabel = (category: NewsCategory) => {
    // Mapping backend enum to translation keys
    // Assuming translation keys match the enum values or close to it
    // t('breaking'), t('new'), t('event'), t('update'), t('announcement')
    return t(category.toLowerCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {t('newsTitle')}
        </h1>

        <div className="max-w-4xl mx-auto">
          {newsList.length === 0 ? (
            <p className="text-center text-gray-500">No news found.</p>
          ) : (
            <div className="space-y-6">
              {newsList.map((item) => {
                const color = getCategoryColor(item.category)
                // Construct class names dynamically
                // Need to be careful with Tailwind dynamic classes, usually safer to have full strings
                // But typically `bg-${color}-50` works if color is simple and previously used
                // Better approach:
                const bgClass = `bg-${color}-50`
                const borderClass = `border-${color}-500`
                const badgeClass = `bg-${color}-500`

                return (
                  <div key={item.id} className={`${bgClass} border-l-4 ${borderClass} p-6 rounded-lg`}>
                    <div className="flex items-center mb-2">
                      <span className={`${badgeClass} text-white px-2 py-1 rounded text-sm capitalize`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-sm text-gray-500 ml-3">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'ar' ? item.contentAr : item.contentEn}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('viewAllNews')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}