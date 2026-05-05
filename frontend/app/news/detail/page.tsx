'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState, Suspense } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { News, NewsCategory } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Load mammoth via plain script injection
function loadMammothScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).mammoth) return resolve((window as any).mammoth)
    let existing = document.getElementById('mammoth-script')
    if (existing) {
      const poll = setInterval(() => { if ((window as any).mammoth) { clearInterval(poll); resolve((window as any).mammoth) } }, 100)
      setTimeout(() => { clearInterval(poll); reject(new Error('Mammoth timeout')) }, 10000)
      return
    }
    const script = document.createElement('script')
    script.id = 'mammoth-script'
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js'
    script.onload = () => resolve((window as any).mammoth)
    script.onerror = () => reject(new Error('Failed to load mammoth'))
    document.head.appendChild(script)
  })
}

function NewsDetailContent() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [newsItem, setNewsItem] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [parseLoading, setParseLoading] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<News>(`/api/news/${id}`)
        setNewsItem(response.data)
      } catch (err) {
        console.error('Failed to fetch news item:', err)
        setError('Failed to load news details')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchNews()
  }, [id])

  useEffect(() => {
    const parseWord = async (url: string) => {
      setParseLoading(true)
      try {
        const res = await api.get(url, { responseType: 'arraybuffer' })
        const arrayBuffer = res.data as ArrayBuffer
        const mammothAPI = await loadMammothScript()
        const result = await mammothAPI.convertToHtml({ arrayBuffer })
        setHtmlContent(result.value)
      } catch (err) {
        console.error('Failed to parse word doc:', err)
      } finally {
        setParseLoading(false)
      }
    }

    if (newsItem?.fileAttachment) {
      const isWord = newsItem.fileAttachment.toLowerCase().endsWith('.doc') || newsItem.fileAttachment.toLowerCase().endsWith('.docx')
      if (isWord) {
        parseWord(newsItem.fileAttachment)
      }
    }
  }, [newsItem])

  const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
      case NewsCategory.BREAKING: return 'blue'
      case NewsCategory.NEW: return 'green'
      case NewsCategory.EVENT: return 'yellow'
      case NewsCategory.UPDATE: return 'purple'
      default: return 'gray'
    }
  }

  const getCategoryLabel = (category: NewsCategory) => {
    return t(category.toLowerCase()) || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center text-red-500 space-y-4">
        <div>{error || 'News not found'}</div>
        <Link href="/news" className="text-blue-600 hover:underline">
          &larr; {language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}
        </Link>
      </div>
    )
  }

  const badgeColor = getCategoryColor(newsItem.category)
  const isWord = newsItem.fileAttachment && (newsItem.fileAttachment.toLowerCase().endsWith('.doc') || newsItem.fileAttachment.toLowerCase().endsWith('.docx'))
  const isPdf = newsItem.fileAttachment && newsItem.fileAttachment.toLowerCase().endsWith('.pdf')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/news" className="text-blue-600 hover:underline flex items-center transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {language === 'ar' ? 'العودة إلى الأخبار' : 'Back to News'}
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {newsItem.featuredImage ? (
            <div className="w-full h-64 md:h-96 relative group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={getImageUrl(newsItem.featuredImage)} 
                alt={language === 'ar' ? newsItem.titleAr : newsItem.titleEn}
                className="w-full h-full object-cover bg-gray-100"
              />
            </div>
          ) : (
            <div className={`w-full h-32 bg-${badgeColor}-600 bg-gradient-to-r from-${badgeColor}-600 to-${badgeColor}-400`}></div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <span className={`bg-${badgeColor}-500 text-white shadow-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
                {getCategoryLabel(newsItem.category)}
              </span>
              <span className="text-gray-500 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {newsItem.publishedAt ? new Date(newsItem.publishedAt).toLocaleDateString() : ''}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
              {language === 'ar' ? newsItem.titleAr : newsItem.titleEn}
            </h1>

            {/* File attachment content */}
            {newsItem.fileAttachment ? (
              isWord ? (
                <div className="w-full bg-white border border-gray-300 p-8 rounded shadow-sm min-h-[500px] mb-8">
                  {parseLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p>Parsing Document to HTML...</p>
                    </div>
                  ) : htmlContent ? (
                    <div className="prose prose-lg max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  ) : (
                    <p className="text-center text-gray-500 py-12">Failed to load content.</p>
                  )}
                </div>
              ) : isPdf ? (
                <div className="w-full bg-white border border-gray-300 rounded shadow-sm overflow-hidden mb-8">
                  <iframe
                    src={getImageUrl(newsItem.fileAttachment)}
                    className="w-full border-0"
                    style={{ height: '80vh', minHeight: '600px' }}
                    title={language === 'ar' ? newsItem.titleAr : newsItem.titleEn}
                  />
                </div>
              ) : null
            ) : null}
            
            {/* Text content (always shown as fallback/supplement) */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: language === 'ar' ? newsItem.contentAr : newsItem.contentEn }} 
            />
          </div>
        </article>
      </div>
    </div>
  )
}

export default function NewsDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <NewsDetailContent />
    </Suspense>
  )
}
