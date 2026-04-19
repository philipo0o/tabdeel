'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Calendar() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {t('calendarTitle')}
        </h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-1 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {t('upcomingEvents')}
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>• {t('groupCycling')}</span>
                  <span className="text-sm">15 فبراير</span>
                </li>
                <li className="flex justify-between">
                  <span>• {t('maintenanceWorkshop')}</span>
                  <span className="text-sm">22 فبراير</span>
                </li>
                <li className="flex justify-between">
                  <span>• {t('monthlyRace')}</span>
                  <span className="text-sm">1 مارس</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {t('bookAppointment')}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {t('joinEvents')}
            </p>
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                {t('bookNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}