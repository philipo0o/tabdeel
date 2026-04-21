'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState, Suspense } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { Album } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AlbumDetailContent() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await api.get<Album>(`/api/albums/${id}`)
        setAlbum(response.data)
      } catch (err) {
        console.error('Failed to fetch album:', err)
        setError('Failed to load album')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAlbum()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center space-y-4">
        <div className="text-red-500">{error || 'Album not found'}</div>
        <Link href="/albums" className="text-blue-600 hover:underline">
          &larr; {language === 'ar' ? 'العودة إلى الألبومات' : 'Back to Albums'}
        </Link>
      </div>
    )
  }

  const title = language === 'ar' ? album.titleAr : album.titleEn
  const description = language === 'ar' ? album.descriptionAr : album.descriptionEn

  // Deduplicate array of image sources for the gallery
  const allImages = new Set<string>()
  if (album.coverPhoto) allImages.add(album.coverPhoto)
  if (album.photos) {
    album.photos.forEach(p => allImages.add(p.imageUrl))
  }
  const galleryArray = Array.from(allImages)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/albums" className="text-blue-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {language === 'ar' ? 'العودة إلى الألبومات' : 'Back to Albums'}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
              {album.category}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(album.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
          
          {description && (
            <p className="text-gray-600 text-lg max-w-3xl leading-relaxed mb-6">
              {description}
            </p>
          )}

          <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {galleryArray.length} {language === 'ar' ? 'صور' : 'Photos'}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryArray.map((imgUrl, index) => (
            <div 
              key={index} 
              className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(getImageUrl(imgUrl))}
            >
              <img 
                src={getImageUrl(imgUrl)} 
                alt={`${title} - Photo ${index + 1}`}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                </svg>
              </div>
            </div>
          ))}
          {galleryArray.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              <p className="text-xl">No photos found in this album.</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Fullscreen view" 
              className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default function AlbumDetail() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <AlbumDetailContent />
    </Suspense>
  )
}
