'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ar' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'حول الموقع',
    services: 'مجتمع الدراجات',
    bicycleCulture: 'خريطة الدراجات',
    calendar: 'التقويم',
    library: 'المكتبة',
    contact: 'تواصل معنا',
    
    // Library sections
    publications: 'منشورات',
    albums: 'ألبومات',
    articles: 'مقالات',
    news: 'أخبار تبديل',
    
    // Common
    readMore: 'اقرأ المزيد',
    viewAll: 'عرض الكل',
    learnMore: 'تعلم المزيد',
    startJourney: 'ابدأ رحلتك',
    bookNow: 'احجز الآن',
    
    // Services
    bikeMaintenance: 'صيانة دراجات',
    bikeGarage: 'جراج دراجات',
    bikeSales: 'بيع دراجات',
    bikeTraining: 'تعليم دراجات',
    bikeSharing: 'مشاركة دراجات',
    bikeAccessories: 'اكسسوارات دراجات',
    search: 'ابحث',
    addService: 'إضافة خدمة',
    filter: 'فلتر',
    routes: 'مسارات',
    
    // Bicycle Culture
    bicycleCultureTitle: 'خريطة الدراجات',
    bicycleBenefits: 'فوائد ركوب الدراجات',
    improvedFitness: 'تحسين اللياقة البدنية',
    environmentFriendly: 'صديق للبيئة',
    costSavings: 'توفير في التكاليف',
    reducedTraffic: 'تقليل الازدحام المروري',
    joinCommunity: 'انضم إلى مجتمع راكبي الدراجات واكتشف المدينة بطريقة جديدة',
    
    // Calendar
    calendarTitle: 'التقويم',
    upcomingEvents: 'الفعاليات القادمة',
    groupCycling: 'رحلة دراجات جماعية',
    maintenanceWorkshop: 'ورشة صيانة الدراجات',
    monthlyRace: 'سباق الدراجات الشهري',
    bookAppointment: 'احجز موعدك الآن',
    joinEvents: 'انضم إلى فعالياتنا واستمتع بتجربة ركوب الدراجات',
    
    // Publications
    publicationsTitle: 'منشورات',
    recentPublications: 'منشورات حديثة',
    safetyGuide: 'دليل السلامة على الدراجات',
    bestRoutes: 'أفضل المسارات في المدينة',
    maintenanceTips: 'نصائح الصيانة الأساسية',
    trafficLaws: 'قوانين المرور للدراجات',
    discoverPublications: 'اكتشف مجموعة واسعة من المنشورات والأدلة المفيدة لراكبي الدراجات',
    browseAll: 'تصفح جميع المنشورات',
    
    // Albums
    albumsTitle: 'ألبومات',
    bikeAlbum: 'ألبوم الدراجات',
    bikeAlbumDesc: 'مجموعة صور لأفضل أنواع الدراجات',
    routesAlbum: 'ألبوم المسارات',
    routesAlbumDesc: 'صور لأجمل مسارات الدراجات',
    eventsAlbum: 'ألبوم الفعاليات',
    eventsAlbumDesc: 'صور من فعاليات ومسابقات الدراجات',
    viewAlbum: 'عرض الألبوم',
    exploreAlbums: 'استكشف مجموعة متنوعة من الألبومات المصورة',
    viewAllAlbums: 'عرض جميع الألبومات',
    
    // Articles
    articlesTitle: 'مقالات',
    healthBenefits: 'فوائد ركوب الدراجات للصحة',
    healthBenefitsDesc: 'ركوب الدراجات ليس مجرد وسيلة نقل، بل هو نشاط رياضي مفيد جداً للصحة البدنية والنفسية...',
    choosingBike: 'كيفية اختيار الدراجة المناسبة',
    choosingBikeDesc: 'اختيار الدراجة المناسبة يعتمد على عدة عوامل مهمة مثل الغرض من الاستخدام والميزانية...',
    safetyTips: 'نصائح السلامة أثناء ركوب الدراجات',
    safetyTipsDesc: 'السلامة أولوية قصوى عند ركوب الدراجات، وهناك قواعد مهمة يجب اتباعها...',
    daysAgo: 'منذ 3 أيام',
    weekAgo: 'منذ أسبوع',
    twoWeeksAgo: 'منذ أسبوعين',
    viewAllArticles: 'عرض جميع المقالات',
    
    // News
    newsTitle: 'أخبار تبديل',
    breaking: 'عاجل',
    new: 'جديد',
    event: 'فعالية',
    update: 'تحديث',
    today: 'اليوم',
    yesterday: 'أمس',
    threeDaysAgo: 'منذ 3 أيام',
    oneWeekAgo: 'منذ أسبوع',
    newRoute: 'إطلاق مسار جديد للدراجات في وسط المدينة',
    newRouteDesc: 'تم افتتاح مسار جديد آمن للدراجات يربط بين أهم المناطق في وسط المدينة...',
    freeWorkshop: 'ورشة مجانية لصيانة الدراجات هذا الأسبوع',
    freeWorkshopDesc: 'ندعوكم لحضور ورشة مجانية لتعلم أساسيات صيانة الدراجات يوم السبت القادم...',
    photoContest: 'مسابقة أفضل صورة للدراجات',
    photoContestDesc: 'شارك في مسابقتنا الشهرية لأفضل صورة للدراجات واربح جوائز قيمة...',
    appUpdate: 'تحديث تطبيق تبديل الجديد',
    appUpdateDesc: 'تم إطلاق النسخة الجديدة من تطبيق تبديل مع ميزات محسنة وواجهة أفضل...',
    viewAllNews: 'عرض جميع الأخبار',
    
    // Contact
    contactTitle: 'تواصل معنا',
    contactSubtitle: 'نحن هنا لمساعدتك',
    contactDescription: 'لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا. فريقنا جاهز لمساعدتك في أي وقت.',
    contactInfo: 'معلومات التواصل',
    address: 'العنوان',
    addressValue: 'شارع الدراجات، المدينة الجديدة، المملكة العربية السعودية',
    phone: 'الهاتف',
    phoneValue: '+966 12 345 6789',
    email: 'البريد الإلكتروني',
    emailValue: 'info@tabdeel.com',
    workingHours: 'ساعات العمل',
    workingHoursValue: 'الأحد - الخميس: 9:00 ص - 6:00 م',
    contactForm: 'نموذج التواصل',
    name: 'الاسم',
    namePlaceholder: 'اكتب اسمك الكامل',
    emailPlaceholder: 'اكتب بريدك الإلكتروني',
    subject: 'الموضوع',
    subjectPlaceholder: 'موضوع الرسالة',
    message: 'الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    sendMessage: 'إرسال الرسالة',
    followUs: 'تابعنا على',
    socialMedia: 'وسائل التواصل الاجتماعي'
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    services: 'Cycling Community',
    bicycleCulture: 'Cycling Map',
    calendar: 'Calendar',
    library: 'Library',
    contact: 'Contact',
    
    // Library sections
    publications: 'Publications',
    albums: 'Albums',
    articles: 'Articles',
    news: 'Tabdeel News',
    
    // Common
    readMore: 'Read More',
    viewAll: 'View All',
    learnMore: 'Learn More',
    startJourney: 'Start Your Journey',
    bookNow: 'Book Now',
    
    // Services
    bikeMaintenance: 'Bike Maintenance',
    bikeGarage: 'Bike Garage',
    bikeSales: 'Bike Sales',
    bikeTraining: 'Bike Training',
    bikeSharing: 'Bike Sharing',
    bikeAccessories: 'Bike Accessories',
    search: 'Search',
    addService: 'Add Service',
    filter: 'Filter',
    routes: 'Routes',
    
    // Bicycle Culture
    bicycleCultureTitle: 'Cycling Map',
    bicycleBenefits: 'Benefits of Cycling',
    improvedFitness: 'Improved physical fitness',
    environmentFriendly: 'Environmentally friendly',
    costSavings: 'Cost savings',
    reducedTraffic: 'Reduced traffic congestion',
    joinCommunity: 'Join the cycling community and discover the city in a new way',
    
    // Calendar
    calendarTitle: 'Calendar & Schedule',
    upcomingEvents: 'Upcoming Events',
    groupCycling: 'Group Cycling Trip',
    maintenanceWorkshop: 'Bike Maintenance Workshop',
    monthlyRace: 'Monthly Bike Race',
    bookAppointment: 'Book Your Appointment Now',
    joinEvents: 'Join our events and enjoy the cycling experience',
    
    // Publications
    publicationsTitle: 'Publications',
    recentPublications: 'Recent Publications',
    safetyGuide: 'Bicycle Safety Guide',
    bestRoutes: 'Best City Routes',
    maintenanceTips: 'Basic Maintenance Tips',
    trafficLaws: 'Traffic Laws for Cyclists',
    discoverPublications: 'Discover a wide range of publications and useful guides for cyclists',
    browseAll: 'Browse All Publications',
    
    // Albums
    albumsTitle: 'Albums',
    bikeAlbum: 'Bike Album',
    bikeAlbumDesc: 'Collection of photos of the best types of bicycles',
    routesAlbum: 'Routes Album',
    routesAlbumDesc: 'Photos of the most beautiful cycling routes',
    eventsAlbum: 'Events Album',
    eventsAlbumDesc: 'Photos from cycling events and competitions',
    viewAlbum: 'View Album',
    exploreAlbums: 'Explore a variety of photo albums',
    viewAllAlbums: 'View All Albums',
    
    // Articles
    articlesTitle: 'Articles',
    healthBenefits: 'Health Benefits of Cycling',
    healthBenefitsDesc: 'Cycling is not just a means of transportation, but a very beneficial physical activity for physical and mental health...',
    choosingBike: 'How to Choose the Right Bike',
    choosingBikeDesc: 'Choosing the right bike depends on several important factors such as the purpose of use and budget...',
    safetyTips: 'Safety Tips While Cycling',
    safetyTipsDesc: 'Safety is a top priority when cycling, and there are important rules to follow...',
    daysAgo: '3 days ago',
    weekAgo: '1 week ago',
    twoWeeksAgo: '2 weeks ago',
    viewAllArticles: 'View All Articles',
    
    // News
    newsTitle: 'Tabdeel News',
    breaking: 'Breaking',
    new: 'New',
    event: 'Event',
    update: 'Update',
    today: 'Today',
    yesterday: 'Yesterday',
    threeDaysAgo: '3 days ago',
    oneWeekAgo: '1 week ago',
    newRoute: 'New Cycling Route Launched in City Center',
    newRouteDesc: 'A new safe cycling route has been opened connecting the most important areas in the city center...',
    freeWorkshop: 'Free Bike Maintenance Workshop This Week',
    freeWorkshopDesc: 'We invite you to attend a free workshop to learn the basics of bike maintenance next Saturday...',
    photoContest: 'Best Bike Photo Contest',
    photoContestDesc: 'Participate in our monthly contest for the best bike photo and win valuable prizes...',
    appUpdate: 'New Tabdeel App Update',
    appUpdateDesc: 'The new version of the Tabdeel app has been released with improved features and better interface...',
    viewAllNews: 'View All News',
    
    // Contact
    contactTitle: 'Contact Us',
    contactSubtitle: 'We\'re Here to Help',
    contactDescription: 'Have a question or suggestion? Don\'t hesitate to contact us. Our team is ready to help you anytime.',
    contactInfo: 'Contact Information',
    address: 'Address',
    addressValue: 'Bicycle Street, New City, Saudi Arabia',
    phone: 'Phone',
    phoneValue: '+966 12 345 6789',
    email: 'Email',
    emailValue: 'info@tabdeel.com',
    workingHours: 'Working Hours',
    workingHoursValue: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    contactForm: 'Contact Form',
    name: 'Name',
    namePlaceholder: 'Enter your full name',
    emailPlaceholder: 'Enter your email address',
    subject: 'Subject',
    subjectPlaceholder: 'Message subject',
    message: 'Message',
    messagePlaceholder: 'Write your message here...',
    sendMessage: 'Send Message',
    followUs: 'Follow Us',
    socialMedia: 'Social Media'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}