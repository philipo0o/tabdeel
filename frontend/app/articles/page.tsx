'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Article } from '@/lib/types'
import Link from 'next/link'

export default function Articles() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching from /api/articles...');
        const response = await api.get<Article[]>('/api/articles')
        setArticles(response.data)
      } catch (err) {
        console.error('Failed to fetch articles:', err)
        setError('Failed to load articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

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
          {t('articlesTitle')}
        </h1>

        <div className="max-w-4xl mx-auto">
          {articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles found.</p>
          ) : (
            <div className="space-y-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                    {article.title}
                  </h3>
                  <div className="text-gray-600 mb-4 prose max-w-none line-clamp-3">
                    {article.excerpt || article.content.substring(0, 150) + '...'}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                    </span>
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('readMore')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('viewAllArticles')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}