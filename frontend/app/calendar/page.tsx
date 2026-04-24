'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { useEffect, useState } from 'react'
import api, { getImageUrl } from '@/lib/api'
import { Event } from '@/lib/types'

export default function Calendar() {
  const { t, language } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null) // null means "All Days"

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/events/upcoming') // or '/api/events'
        // Sort by start date ascending
        const sorted = res.data.sort((a: Event, b: Event) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        setEvents(sorted)
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Extract unique days strings (e.g. "2026-02-15") from events
  const uniqueDays = Array.from(new Set(events.map(e => new Date(e.startDate).toISOString().split('T')[0])))

  // Filter events based on selected date
  const filteredEvents = selectedDate 
    ? events.filter(e => new Date(e.startDate).toISOString().split('T')[0] === selectedDate)
    : events

  // Format helper
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateDisplay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          {t('calendarTitle') || 'Events Calendar'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center my-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Day Filter Ribbon */}
            <div className="mb-10 w-full overflow-x-auto pb-4">
              <div className="flex space-x-3 gap-2 px-1 items-center justify-start min-w-max">
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-semibold text-sm ${
                    selectedDate === null 
                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {language === 'ar' ? 'جميع الأيام' : 'All Days'}
                </button>
                {uniqueDays.map((dayStr) => (
                  <button
                    key={dayStr}
                    onClick={() => setSelectedDate(dayStr)}
                    className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium text-sm ${
                      selectedDate === dayStr 
                      ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {formatDateDisplay(dayStr)}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                  
                  {/* Image / Header Placeholder */}
                  <div className="relative h-48 bg-gray-100 flex-shrink-0">
                    {evt.featuredImage ? (
                      <img 
                        src={getImageUrl(evt.featuredImage)} 
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-300">
                         <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                       </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm text-center">
                      <div className="text-xs font-bold text-red-500 uppercase">
                        {new Date(evt.startDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' })}
                      </div>
                      <div className="text-xl font-bold text-gray-800 leading-none mt-1">
                        {new Date(evt.startDate).getDate()}
                      </div>
                    </div>
                    {evt.type && (
                      <div className="absolute top-4 right-4 bg-blue-600/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm uppercase tracking-wide">
                        {evt.type}
                      </div>
                    )}
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>

                    {/* Meta details */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="truncate">{formatTime(evt.startDate)} - {formatTime(evt.endDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="truncate">{evt.location}</span>
                      </div>
                      {evt.organizerName && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          <span className="truncate font-medium">{evt.organizerName}</span>
                        </div>
                      )}
                      {evt.socialMediaUrl && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.376.202 2.394.1 2.646.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                          <a href={evt.socialMediaUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:text-blue-800 font-medium hover:underline w-full">
                            {evt.socialMediaUrl.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">
                      {evt.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
                  <div className="text-6xl mb-4">🗓️</div>
                  <p className="text-xl font-semibold">No events scheduled for this day.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}