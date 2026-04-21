'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState, Suspense } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { Publication } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Load mammoth via plain script injection (avoids next/script issues with chunk loading)
function loadMammothScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).mammoth) {
      resolve((window as any).mammoth)
      return
    }
    const existing = document.getElementById('mammoth-script')
    if (existing) {
      // Script tag exists but not loaded yet, poll for it
      const poll = setInterval(() => {
        if ((window as any).mammoth) {
          clearInterval(poll)
          resolve((window as any).mammoth)
        }
      }, 100)
      setTimeout(() => { clearInterval(poll); reject(new Error('Mammoth load timeout')) }, 10000)
      return
    }
    const script = document.createElement('script')
    script.id = 'mammoth-script'
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js'
    script.onload = () => resolve((window as any).mammoth)
    script.onerror = () => reject(new Error('Failed to load mammoth from CDN'))
    document.head.appendChild(script)
  })
}

function PublicationDetailContent() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [publication, setPublication] = useState<Publication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [htmlContent, setHtmlContent] = useState<string | null>(null)
  const [parseLoading, setParseLoading] = useState(false)

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await api.get<Publication>(`/api/publications/${id}`)
        setPublication(response.data)
      } catch (err) {
        console.error('Failed to fetch publication:', err)
        setError('Failed to load publication')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPublication()
    }
  }, [id])

  useEffect(() => {
    const parseWord = async (url: string) => {
      setParseLoading(true)
      try {
        // Use the api axios instance which already has the correct baseURL
        console.log('Fetching word document from:', url);
        
        const res = await api.get(url, { responseType: 'arraybuffer' })
        const arrayBuffer = res.data as ArrayBuffer
        
        // Load mammoth dynamically via plain script injection
        const mammothAPI = await loadMammothScript()
        const result = await mammothAPI.convertToHtml({ arrayBuffer })
        setHtmlContent(result.value)
        
      } catch (err) {
        console.error('Failed to parse word doc:', err)
      } finally {
        setParseLoading(false)
      }
    }

    if (publication) {
      const fileUrl = publication.fileUrl || publication.pdfUrl
      if (fileUrl && (fileUrl.toLowerCase().endsWith('.doc') || fileUrl.toLowerCase().endsWith('.docx'))) {
        parseWord(fileUrl)
      }
    }
  }, [publication])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-red-500 space-y-4">
        <div>{error || 'Publication not found'}</div>
        <Link href="/publications" className="text-blue-600 hover:underline">
          &larr; {language === 'ar' ? 'العودة إلى الإصدارات' : 'Back to Publications'}
        </Link>
      </div>
    )
  }

  const title = language === 'ar' ? publication.titleAr : publication.titleEn
  const description = language === 'ar' ? publication.descriptionAr : publication.descriptionEn
  const fileUrl = publication.fileUrl || publication.pdfUrl
  const isWord = fileUrl && (fileUrl.toLowerCase().endsWith('.doc') || fileUrl.toLowerCase().endsWith('.docx'))

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/publications" className="text-blue-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            {language === 'ar' ? 'العودة إلى الإصدارات' : 'Back to Publications'}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {publication.coverImage ? (
            <div className="w-full h-64 md:h-96 relative">
              <img 
                src={getImageUrl(publication.coverImage)} 
                alt={title}
                className="w-full h-full object-contain bg-gray-100"
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-blue-600"></div>
          )}
          
          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold uppercase">
                {publication.type}
              </span>
              <span className="text-gray-500 text-sm">
                {publication.publishedAt ? new Date(publication.publishedAt).toLocaleDateString() : ''}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>
            
            {description && (
              <div className="prose max-w-none text-gray-700 mb-8 border-l-4 border-blue-500 pl-4 py-2">
                <p>{description}</p>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-8 bg-gray-50 rounded-b-lg p-6 -mx-8 -mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {language === 'ar' ? 'المحتوى' : 'Content'}
                </h3>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    {t('download') || 'Download Original File'}
                  </a>
                )}
              </div>

              {fileUrl ? (
                isWord ? (
                  <div className="w-full bg-white border border-gray-300 p-8 rounded shadow-sm min-h-[500px]">
                    {parseLoading ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p>Parsing Word Document to HTML...</p>
                      </div>
                    ) : htmlContent ? (
                      <div className="prose max-w-none prose-blue" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                      <p className="text-center text-gray-500 py-12">Failed to parse Word document.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600 bg-white rounded border border-gray-200">
                    <p className="mb-2 font-semibold">Cannot display PDF as HTML.</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">Because you requested not to use a PDF Viewer or Download Button, and PDFs cannot be converted to HTML text, this file cannot be displayed.</p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 italic">Please upload a .doc or .docx Word Document in the Admin panel to see HTML content extraction.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white rounded border border-gray-200">
                  <p>No document available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicationDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <PublicationDetailContent />
    </Suspense>
  )
}
