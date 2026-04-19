'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function BicycleCulture() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {t('bicycleCultureTitle')}
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-1 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {t('bicycleBenefits')}
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('improvedFitness')}</li>
                <li>• {t('environmentFriendly')}</li>
                <li>• {t('costSavings')}</li>
                <li>• {t('reducedTraffic')}</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              {t('joinCommunity')}
            </p>
            
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                {t('startJourney')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}