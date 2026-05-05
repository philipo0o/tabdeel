'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function Home() {
  const { t, language } = useLanguage()
  useEffect(() => {
    const observerOptions = { threshold: 0.1 }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.reveal-trigger').forEach(trigger => {
      observer.observe(trigger)
    })

    return () => observer.disconnect()
  }, [])

  /* Optimized images */
  const imageSrc = language === 'en'
    ? "/Landing_Presetation_full_4k_EN_optimized.JPG"
    : "/Landing_Presetation_full_4k_optimized.JPG"

  return (
    <div className="main-wrapper">
      {/* Logo Section */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0', backgroundColor: '#fff' }}>
        <Image
          src="/tabdeel%20logo.PNG"
          alt="Tabdeel Logo"
          width={180}
          height={180}
          priority={true}
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Optimized Next.js Image component for faster loading */}
      <Image
        src={imageSrc}
        alt="Road Map"
        className="road-image"
        width={2560}
        height={1440}
        priority={true}
        quality={90}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDX2a8uQhVBBGQQQCDzSAtqGjVmQVBBGQQQCDzTrNfXIQqggjIIIBB5pAW1DRqzIKggjIIIBB5p1mvrk="
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          backgroundColor: '#f5f5f5'
        }}
        key={language} // Force re-render when language changes
      />

      {/* Clickable area for Bicycle Culture button */}
      <Link href="/bicycle-culture" className="clickable-button bicycle-culture-btn">
        <span className="sr-only">{t('bicycleCulture')}</span>
      </Link>

      {/* Clickable area for Calendar button */}
      <Link href="/calendar" className="clickable-button calendar-btn">
        <span className="sr-only">{t('calendar')}</span>
      </Link>

      {/* Clickable area for Services button */}
      <Link href="/services" className="clickable-button services-btn">
        <span className="sr-only">{t('services')}</span>
      </Link>

      {/* Clickable area for Library button */}
      <Link href="/library" className="clickable-button library-btn">
        <span className="sr-only">{t('library')}</span>
      </Link>

      <div className="content-spot spot-1 reveal-trigger">
        <div className="content-holder">
          {/* Content for spot 1 - you can add your content here */}
        </div>
      </div>

      <div className="content-spot spot-2 reveal-trigger lg-right">
        <div className="content-holder">
          {/* Content for spot 2 - you can add your content here */}
        </div>
      </div>

      <div className="content-spot spot-3 reveal-trigger lg-left">
        <div className="content-holder">
          {/* Content for spot 3 - you can add your content here */}
        </div>
      </div>

      <div className="content-spot spot-4 reveal-trigger lg-right">
        <div className="content-holder">
          {/* Content for spot 4 - you can add your content here */}
        </div>
      </div>

      <div className="content-spot spot-5 reveal-trigger">
        <div className="content-holder" style={{ marginBottom: '50px' }}>
          {/* Content for spot 5 - you can add your content here */}
        </div>
      </div>
    </div>
  )
}