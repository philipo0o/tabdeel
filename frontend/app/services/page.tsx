'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Services() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-12 pb-20 flex flex-col overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-96 bg-purple-600/5 rotate-6 -z-10 transform origin-top-right rounded-3xl blur-2xl" />
      <div className="absolute -bottom-20 left-0 w-full h-96 bg-indigo-600/5 -rotate-6 -z-10 transform origin-bottom-left rounded-3xl blur-3xl" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-sm text-center">
          {t('services') || (language === 'ar' ? 'مجتمع الدراجات' : 'Cycling Community')}
        </h1>
        <p className="text-gray-500 text-lg mb-10 text-center max-w-2xl">
          {language === 'ar' 
            ? 'تصفح خريطة التفاعل المباشرة لاكتشاف أحدث الخدمات وإضافة إشاراتك الخاصة.' 
            : 'Browse the interactive map to discover the latest services and drop your own pins.'}
        </p>

        {/* Frameless Padlet Map Container */}
        <div className="w-full mx-auto px-4 lg:px-8 pb-12">
          <div className="w-full relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-50 transition-shadow duration-300 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)]" style={{ height: '700px' }}>
            <iframe 
              src="https://padlet.com/omaraboutaleb20/padlet-hvzbr7urtsiwejr7"
              className="absolute top-0 left-0 w-full h-full border-0 outline-none"
              allow="camera;microphone;geolocation"
              title="Padlet Map"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Beautiful Footer Image - Full Display */}
      <div className="w-full mt-auto relative z-10">
        <img
          src="/services-illustration.png"
          alt="Services footer illustration"
          className="w-full h-auto block opacity-95 hover:opacity-100 transition-opacity duration-300 transform translate-y-2 hover:translate-y-0"
          style={{
            filter: 'contrast(1.05) drop-shadow(0 -10px 20px rgba(0,0,0,0.05))',
            display: 'block'
          }}
        />
      </div>
    </div>
  )
}