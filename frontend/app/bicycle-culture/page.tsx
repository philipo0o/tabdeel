'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function BicycleCulture() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-12 pb-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/5 rotate-3 -z-10 transform origin-top-left rounded-3xl" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-blue-600/5 -rotate-3 -z-10 transform origin-bottom-right rounded-3xl" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm">
            {t('bicycleCultureTitle') || (language === 'ar' ? 'خريطة الدراجات' : 'Cycling Map')}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تفاعل معنا واكتشف عالم الدراجات من خلال هذه الرحلة البصرية التفاعلية.' 
              : 'Interact and discover the world of cycling through this interactive visual journey.'}
          </p>
        </div>
        
        {/* Frameless Genially Embed Container */}
        <div className="w-full mx-auto px-4 lg:px-8 pb-12">
          <div className="w-full relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-50 transition-shadow duration-300 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)]" style={{ paddingBottom: '60%' }}>
            <iframe 
              src="https://view.genially.com/69d4f7813dcbb1926393b571" 
              className="absolute top-0 left-0 w-full h-full border-0 outline-none" 
              allowFullScreen>
            </iframe>
          </div>
        </div>

      </div>
    </div>
  )
}