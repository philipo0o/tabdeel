'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Publication, PublicationType } from '@/lib/types'
import Link from 'next/link'

export default function Publications() {
  const { t, language } = useLanguage()
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await api.get<Publication[]>('/api/publications/published')
        setPublications(response.data)
      } catch (err) {
        console.error('Failed to fetch publications:', err)
        setError('Failed to load publications')
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
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
          {t('publicationsTitle')}
        </h1>

        <div className="max-w-4xl mx-auto">
          {publications.length === 0 ? (
            <div className="text-center text-gray-500 mb-12">No publications found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
              {publications.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/publications/detail?id=${item.id}`} 
                  className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase min-w-max ml-2">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-blue-100/50">
                    <span className="text-blue-600 font-medium flex items-center group-hover:text-blue-800">
                      {language === 'ar' ? 'التفاصيل' : 'View Details'}
                      <svg className={`w-4 h-4 ${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              {t('discoverPublications')}
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('browseAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}