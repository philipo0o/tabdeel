'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState, Suspense } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { Article } from '@/lib/types'
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

function ArticleDetailContent() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get<Article>(`/api/articles/${id}`)
        setArticle(response.data)
      } catch (err) {
        console.error('Failed to fetch article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchArticle()
  }, [id])

  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [parseLoading, setParseLoading] = useState(false)

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

    if (article?.fileAttachment) {
      const isWord = article.fileAttachment.toLowerCase().endsWith('.doc') || article.fileAttachment.toLowerCase().endsWith('.docx')
      if (isWord) {
        parseWord(article.fileAttachment)
      }
    }
  }, [article])

  const isWord = article?.fileAttachment && (article.fileAttachment.toLowerCase().endsWith('.doc') || article.fileAttachment.toLowerCase().endsWith('.docx'))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-red-500 space-y-4">
        <div>{error || 'Article not found'}</div>
        <Link href="/articles" className="text-blue-600 hover:underline">
          &larr; {language === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/articles" className="text-blue-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {language === 'ar' ? 'العودة إلى المقالات' : 'Back to Articles'}
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {article.featuredImage ? (
            <div className="w-full h-64 md:h-96 relative">
              <img 
                src={getImageUrl(article.featuredImage)} 
                alt={article.title}
                className="w-full h-full object-cover bg-gray-100"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-blue-600"></div>
          )}
          
          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold uppercase">
                {article.status}
              </span>
              <span className="text-gray-500 text-sm">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {article.title}
            </h1>
            
            {article.fileAttachment ? (
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
              ) : (
                <div className="text-center py-12 text-gray-600 bg-white rounded border border-gray-200 mb-8">
                  <p className="mb-2 font-semibold">Cannot display PDF as HTML.</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">Because you requested not to use a PDF Viewer or Download Button, and PDFs cannot be converted to HTML text, this file cannot be displayed.</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 italic">Please upload a .doc or .docx Word Document in the Admin panel to see HTML content extraction.</p>
                </div>
              )
            ) : (
              article.content && (
                <div 
                  className="prose prose-lg max-w-none text-gray-800 mb-8"
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              )
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {language === 'ar' ? 'الوسوم' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

export default function ArticleDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ArticleDetailContent />
    </Suspense>
  )
}
