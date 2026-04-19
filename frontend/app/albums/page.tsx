'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Albums() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {t('albumsTitle')}
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🚲</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {t('bikeAlbum')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('bikeAlbumDesc')}
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                {t('viewAlbum')}
              </button>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🏞️</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {t('routesAlbum')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('routesAlbumDesc')}
              </p>
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
                {t('viewAlbum')}
              </button>
            </div>
            
            <div className="bg-teal-50 p-6 rounded-lg text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {t('eventsAlbum')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('eventsAlbumDesc')}
              </p>
              <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors">
                {t('viewAlbum')}
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              {t('exploreAlbums')}
            </p>
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors">
              {t('viewAllAlbums')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}