'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/services', label: t('services') },
    { href: '/bicycle-culture', label: t('bicycleCulture') },
    { href: '/calendar', label: t('calendar') },
    { href: '/library', label: t('library') },
    { href: '/contact', label: t('contact') },
  ]

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  return (
    <nav className="bg-white/60 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center h-16 relative">
          {/* Centered Components: Logo + Nav Items */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center transition-transform hover:scale-105">
              <Image 
                src="/tabdeel%20logo.PNG" 
                alt="Tabdeel Logo" 
                width={120} 
                height={48} 
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Edge Components: Language Switcher & Mobile Menu */}
          <div className="absolute end-0 flex items-center gap-2">
            {/* Desktop Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hidden md:block bg-black text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="md:hidden bg-black text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}