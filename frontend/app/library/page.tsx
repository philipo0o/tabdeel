'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useState, useEffect } from 'react'

export default function Library() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset loading state when language changes
  useEffect(() => {
    setImageLoaded(false)
  }, [language])

  // Choose image based on language
  const imageSrc = language === 'en' 
    ? "/library-sketch-EN.png" 
    : "/library-sketch.png"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-gray-400 text-lg">Loading...</div>
            </div>
          )}
          
          {/* Optimized Next.js Image component for faster loading */}
          <Image 
            src={imageSrc}
            alt="Hand-drawn library sketch"
            width={800}
            height={1200}
            priority={true}
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            style={{
              width: '100%',
              height: 'auto',
              filter: 'contrast(1.05)',
              maxWidth: '100%',
              backgroundColor: '#f9fafb' // Light gray background to prevent black flash
            }}
            onLoad={() => setImageLoaded(true)}
            key={language} // Force re-render when language changes
          />

          {/* Invisible clickable areas over each section */}
          
          {/* منشورات (Publications) - Left frame */}
          <div 
            className="absolute cursor-pointer hover:bg-opacity-10 transition-colors"
            style={{
              top: '15%',
              left: '5%',
              width: '25%',
              height: '50%'
            }}
            onClick={() => router.push('/publications')}
            title={t('publications')}
          ></div>

          {/* ألبومات (Albums) - Center ornate frame */}
          <div 
            className="absolute cursor-pointer hover:bg-opacity-10 transition-colors"
            style={{
              top: '20%',
              left: '40%',
              width: '20%',
              height: '20%'
            }}
            onClick={() => router.push('/albums')}
            title={t('albums')}
          ></div>

          {/* مقالات (Articles) - Right frame */}
          <div 
            className="absolute cursor-pointer  hover:bg-opacity-10 transition-colors"
            style={{
              top: '15%',
              right: '5%',
              width: '25%',
              height: '50%'
            }}
            onClick={() => router.push('/articles')}
            title={t('articles')}
          ></div>

          {/* أخبار تبديل (Tabdeel News) - Bottom frame */}
          <div 
            className="absolute cursor-pointer hover:bg-opacity-10 transition-colors"
            style={{
              top: '60%',
              left: '25%',
              width: '50%',
              height: '40%'
            }}
            onClick={() => router.push('/news')}
            title={t('news')}
          ></div>
        </div>
      </div>

      {/* Footer Image - Full Width */}
      <div className="w-full mt-auto">
        <img 
          src="/library-sketch-footer.png" 
          alt="Library footer illustration"
          className="w-full h-auto block"
          style={{
            filter: 'contrast(1.05)',
            display: 'block'
          }}
        />
      </div>
    </div>
  )
}