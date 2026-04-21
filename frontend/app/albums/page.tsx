'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { Album } from '@/lib/types'
import Link from 'next/link'

export default function Albums() {
  const { t, language } = useLanguage()
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/api/albums/published')
        setAlbums(res.data)
      } catch (err) {
        console.error('Failed to load albums:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlbums()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          {t('albumsTitle') || 'Photo Albums'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => {
              const title = language === 'ar' ? album.titleAr : album.titleEn
              const coverSrc = album.coverPhoto ? getImageUrl(album.coverPhoto) : (album.photos && album.photos.length > 0 ? getImageUrl(album.photos[0].imageUrl) : '/placeholder-album.png')
              
              return (
                <Link key={album.id} href={`/albums/detail?id=${album.id}`} className="group bg-white rounded-xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {/* Fallback color if no image */}
                    {!album.coverPhoto && (!album.photos || album.photos.length === 0) && (
                       <div className="absolute inset-0 bg-blue-100 flex items-center justify-center text-4xl">📷</div>
                    )}
                    <img 
                      src={coverSrc} 
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-800 shadow-sm uppercase tracking-wide">
                      {album.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {title}
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center justify-between mt-4">
                      <span>{album.photos?.length || 0} Photos</span>
                      <span>{new Date(album.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              )
            })}

            {albums.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
                <p className="text-xl">No albums available currently.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}