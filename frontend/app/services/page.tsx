'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

export default function Services() {
  const { t } = useLanguage()
  const [selectedService, setSelectedService] = useState('bikeMaintenance')

  const services = [
    'bikeMaintenance',
    'bikeGarage',
    'bikeSales',
    'bikeTraining',
    'bikeSharing',
    'bikeAccessories',
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Buttons */}
      <div className="flex justify-center gap-4 pt-4 pb-2">
        <button className="sketch-button-header-tight">{t('routes')}</button>
        <button className="sketch-button-header-tight">{t('services')}</button>
      </div>

      {/* Main Content - Centered and Compact */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        <div className="sketch-main-box-medium">
          {/* Service Items */}
          <div className="space-y-3">
            {services.map((serviceKey) => (
              <label
                key={serviceKey}
                className="sketch-service-item-medium cursor-pointer group"
                onClick={() => setSelectedService(serviceKey)}
              >
                <div className={`sketch-circle-medium ${selectedService === serviceKey ? 'filled' : ''} flex items-center justify-center transition-colors`}>
                  <input
                    type="radio"
                    name="service"
                    value={serviceKey}
                    checked={selectedService === serviceKey}
                    onChange={() => setSelectedService(serviceKey)}
                    className="sr-only"
                  />
                  {/* Inner dot for better radio look if needed, but 'filled' handles background */}
                </div>
                <span className="sketch-service-text-medium group-hover:bg-gray-50 transition-colors">{t(serviceKey)}</span>
              </label>
            ))}
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-4">
            <button className="sketch-search-button-medium">
              <span>🔍</span>
              <span>{t('search')}</span>
            </button>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button className="sketch-button-bottom-medium">{t('addService')}</button>
          <button className="sketch-button-bottom-medium">{t('filter')}</button>
        </div>
      </div>

      {/* Beautiful Footer Image - Full Display */}
      <div className="w-full mt-auto">
        <img
          src="/services-illustration.png"
          alt="Services footer illustration"
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