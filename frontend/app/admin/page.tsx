'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import api from '@/lib/api'

type ContentSection = 'news' | 'articles' | 'publications' | 'albums' | 'events' | 'services'

export default function AdminPage() {
  const { language } = useLanguage()
  const [activeSection, setActiveSection] = useState<ContentSection>('news')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) setIsAuthenticated(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await api.post('/api/auth/login', { username, password })
      localStorage.setItem('token', res.data.access_token)
      setIsAuthenticated(true)
    } catch (err) {
      setLoginError('Invalid credentials')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Login</h1>
          {loginError && <p className="text-red-500 text-center mb-4">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="1234" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Login</button>
            <p className="text-sm text-gray-500 text-center mt-4">Admin Credentials: admin / 1234</p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Language: {language === 'ar' ? 'Arabic' : 'English'}</span>
            <button
              onClick={() => { localStorage.removeItem('token'); setIsAuthenticated(false); }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Content Sections</h2>
              <nav className="space-y-2">
                {[
                  { id: 'news', label: 'News', icon: '📰' },
                  { id: 'articles', label: 'Articles', icon: '📝' },
                  { id: 'publications', label: 'Publications', icon: '📚' },
                  { id: 'albums', label: 'Albums', icon: '📷' },
                  { id: 'events', label: 'Events', icon: '📅' },
                  { id: 'services', label: 'Services', icon: '🔧' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as ContentSection)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeSection === 'news' && <NewsManager />}
              {activeSection === 'articles' && <ArticlesManager />}
              {activeSection === 'publications' && <PublicationsManager />}
              {activeSection === 'albums' && <AlbumsManager />}
              {activeSection === 'events' && <EventsManager />}
              {activeSection === 'services' && <ServicesManager />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// News Manager Component
function NewsManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [titleEn, setTitleEn] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [contentAr, setContentAr] = useState('')
  const [category, setCategory] = useState('new')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/news'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setTitleEn(item.titleEn); setTitleAr(item.titleAr)
    setContentEn(item.contentEn); setContentAr(item.contentAr); setCategory(item.category)
    setFeaturedImage(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try { await api.delete(`/api/news/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setTitleEn(''); setTitleAr(''); setContentEn(''); setContentAr(''); setCategory('new'); setFeaturedImage(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      let imageUrl = ''
      if (featuredImage) {
        const formData = new FormData(); formData.append('file', featuredImage)
        const res = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        imageUrl = res.data.url
      }
      
      const payload: any = { titleEn, titleAr, contentEn, contentAr, category, authorId: 1, isPublished: true }
      if (imageUrl) payload.featuredImage = imageUrl

      if (editingId) {
        await api.put(`/api/news/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated successfully!' })
      } else {
        await api.post('/api/news', payload)
        setStatusMsg({ type: 'success', text: 'Created successfully!' })
      }
      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Operation failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage News</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add News</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.titleAr} | {item.titleEn}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 inline-block">{item.category}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No news found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit News' : 'Create News'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && ( <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div> )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title (En)</label><input required type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Title (Ar)</label><input required type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Content (En)</label><textarea required value={contentEn} onChange={e => setContentEn(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
              <div><label className="block text-sm font-medium mb-1">Content (Ar)</label><textarea required value={contentAr} onChange={e => setContentAr(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="breaking">Breaking</option><option value="new">New</option><option value="event">Event</option><option value="update">Update</option><option value="announcement">Announcement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Image {editingId && '(Leave empty to keep)'}</label>
                <input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update News' : 'Publish News')}</button>
          </div>
        </form>
      )}
    </div>
  )
}

// Articles Manager Component
function ArticlesManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [attachment, setAttachment] = useState<File | null>(null)

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/articles'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setTitle(item.title || ''); setContent(item.content || ''); setExcerpt(item.excerpt || '')
    setCoverImage(null); setAttachment(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/api/articles/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setTitle(''); setContent(''); setExcerpt('')
    setCoverImage(null); setAttachment(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      let featuredImage = ''; let fileAttachment = ''

      if (coverImage) {
        const formData = new FormData(); formData.append('file', coverImage)
        const res = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        featuredImage = res.data.url
      }
      if (attachment) {
        const formData = new FormData(); formData.append('file', attachment)
        const res = await api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        fileAttachment = res.data.url
      }

      const payload: any = { title, content, excerpt, authorId: 1, status: 'published', tags: [] }
      if (featuredImage) payload.featuredImage = featuredImage
      if (fileAttachment) payload.fileAttachment = fileAttachment

      if (editingId) {
        await api.put(`/api/articles/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated successfully!' })
      } else {
        await api.post('/api/articles', payload)
        setStatusMsg({ type: 'success', text: 'Published successfully!' })
      }
      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Operation failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Articles</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Article</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.excerpt || 'No excerpt'}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No articles found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Article' : 'Create Article'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && ( <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div> )}
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Article Title" /></div>
            <div><label className="block text-sm font-medium mb-1">Excerpt</label><input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Short description" /></div>
            <div><label className="block text-sm font-medium mb-1">Content (Fallback text)</label><textarea required value={content} onChange={e => setContent(e.target.value)} rows={6} className="w-full px-4 py-2 border rounded-lg" placeholder="Write content if you don't upload a document"></textarea></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Cover Image {editingId && '(optional)'}</label><input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
              <div><label className="block text-sm font-medium mb-1">Attach File {editingId && '(optional)'}</label><input type="file" accept=".pdf,.doc,.docx" onChange={e => setAttachment(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}</button>
          </div>
        </form>
      )}
    </div>
  )
}

// Publications Manager Component
function PublicationsManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [titleEn, setTitleEn] = useState(''); const [titleAr, setTitleAr] = useState('')
  const [descEn, setDescEn] = useState(''); const [descAr, setDescAr] = useState('')
  const [type, setType] = useState('guide')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/publications'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setTitleEn(item.titleEn); setTitleAr(item.titleAr); setDescEn(item.descriptionEn); setDescAr(item.descriptionAr); setType(item.type)
    setCoverImage(null); setPdfFile(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/api/publications/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setTitleEn(''); setTitleAr(''); setDescEn(''); setDescAr(''); setType('guide')
    setCoverImage(null); setPdfFile(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      let featuredImage = ''; let fileUrl = ''
      if (coverImage) {
        const fd = new FormData(); fd.append('file', coverImage)
        const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        featuredImage = res.data.url
      }
      if (pdfFile) {
        const fd = new FormData(); fd.append('file', pdfFile)
        const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        fileUrl = res.data.url
      }
      
      const payload: any = { titleEn, titleAr, descriptionEn: descEn, descriptionAr: descAr, type, authorId: 1, isPublished: true }
      if (featuredImage) payload.coverImage = featuredImage
      if (fileUrl) payload.fileUrl = fileUrl

      if (editingId) {
        await api.put(`/api/publications/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated!' })
      } else {
        await api.post('/api/publications', payload)
        setStatusMsg({ type: 'success', text: 'Created!' })
      }
      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Operation failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Publications</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Publication</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.titleAr} | {item.titleEn}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 inline-block">{item.type}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No publications found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Publication' : 'Create Publication'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title (En)</label><input required type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Title (Ar)</label><input required type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Desc. (En)</label><textarea required value={descEn} onChange={e => setDescEn(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
              <div><label className="block text-sm font-medium mb-1">Desc. (Ar)</label><textarea required value={descAr} onChange={e => setDescAr(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="guide">Guide</option><option value="map">Map</option><option value="manual">Manual</option><option value="report">Report</option><option value="brochure">Brochure</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Cover Image {editingId && '(optional)'}</label><input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
              <div><label className="block text-sm font-medium mb-1">Content Document (PDF/Word) {editingId && '(optional)'}</label><input type="file" accept=".pdf,.doc,.docx" onChange={e => setPdfFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}</button>
          </div>
        </form>
      )}
    </div>
  )
}

// Albums Manager Component
function AlbumsManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [titleEn, setTitleEn] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [descEn, setDescEn] = useState('')
  const [descAr, setDescAr] = useState('')
  const [category, setCategory] = useState('bikes')
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<any[]>([])

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/albums'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setTitleEn(item.titleEn || ''); setTitleAr(item.titleAr || '')
    setDescEn(item.descriptionEn || ''); setDescAr(item.descriptionAr || ''); setCategory(item.category || 'bikes')
    setExistingPhotos(item.photos || [])
    setCoverPhoto(null); setAlbumPhotos([]); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/api/albums/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setTitleEn(''); setTitleAr(''); setDescEn(''); setDescAr(''); setCategory('bikes')
    setExistingPhotos([])
    setCoverPhoto(null); setAlbumPhotos([]); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDeleteExistingPhoto = async (photoId: number) => {
    if (!confirm('Delete this photo?')) return
    try {
      await api.delete(`/api/albums/photos/${photoId}`)
      setExistingPhotos(prev => prev.filter(p => p.id !== photoId))
    } catch(e) { alert('Failed to delete photo') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      let coverPhotoUrl = ''
      if (coverPhoto) {
        const bd = new FormData(); bd.append('file', coverPhoto)
        const res = await api.post('/api/upload', bd, { headers: { 'Content-Type': 'multipart/form-data' } })
        coverPhotoUrl = res.data.url
      }
      
      const payload: any = { titleEn, titleAr, descriptionEn: descEn, descriptionAr: descAr, category, authorId: 1, isPublished: true }
      if (coverPhotoUrl) payload.coverPhoto = coverPhotoUrl

      let albumIdToUse = editingId;
      if (editingId) {
        await api.put(`/api/albums/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated!' })
      } else {
        const createRes = await api.post('/api/albums', payload)
        albumIdToUse = createRes.data.id
        setStatusMsg({ type: 'success', text: 'Created!' })
      }

      // Upload extra photos
      if (albumPhotos.length > 0 && albumIdToUse) {
        setStatusMsg({ type: 'success', text: 'Uploading additional photos...' })
        for (const file of albumPhotos) {
          const fd = new FormData(); fd.append('file', file)
          const pRes = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
          await api.post('/api/albums/photos', { albumId: albumIdToUse, imageUrl: pRes.data.url, order: 0 })
        }
        setStatusMsg({ type: 'success', text: 'All photos uploaded successfully!' })
      }

      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Albums</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Album</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.titleAr} | {item.titleEn}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 inline-block">{item.category}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No albums found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Album' : 'Create Album'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title (En)</label><input required type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Title (Ar)</label><input required type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Desc. (En)</label><textarea required value={descEn} onChange={e => setDescEn(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
              <div><label className="block text-sm font-medium mb-1">Desc. (Ar)</label><textarea required value={descAr} onChange={e => setDescAr(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="bikes">Bikes</option><option value="routes">Routes</option><option value="events">Events</option><option value="members">Members</option><option value="general">General</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Cover Photo {editingId && '(optional)'}</label><input type="file" accept="image/*" onChange={e => setCoverPhoto(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">New Inner Pictures (Select Multiple)</label>
                <div className="text-xs text-gray-500">You can select batch files multiple times</div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={e => {
                  const files = Array.from(e.target.files || [])
                  setAlbumPhotos(prev => [...prev, ...files])
                  e.target.value = '' // reset input so same file can be selected if removed
                }} 
                className="w-full px-4 py-2 border rounded-lg bg-white" 
              />
              
              {albumPhotos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-blue-600 mb-2">{albumPhotos.length} new photos ready to upload:</p>
                  <div className="flex flex-wrap gap-2">
                    {albumPhotos.map((f, i) => (
                      <div key={i} className="flex items-center bg-blue-50 border border-blue-100 px-2 py-1 rounded text-xs">
                        <span className="truncate max-w-[150px] mr-2">{f.name}</span>
                        <button 
                          type="button" 
                          onClick={() => setAlbumPhotos(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {existingPhotos.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Existing Photos ({existingPhotos.length})</label>
                <div className="flex flex-wrap gap-4">
                  {existingPhotos.map(photo => (
                    <div key={photo.id} className="relative border p-1 rounded bg-white">
                      <img src={photo.imageUrl.startsWith('http') ? photo.imageUrl : api.defaults.baseURL + photo.imageUrl} alt="" className="w-24 h-24 object-cover" />
                      <button type="button" onClick={() => handleDeleteExistingPhoto(photo.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow hover:bg-red-600">&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}</button>
          </div>
        </form>
      )}
    </div>
  )
}

// Events Manager Component
function EventsManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [type, setType] = useState('ride')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [organizerName, setOrganizerName] = useState('')
  const [socialMediaUrl, setSocialMediaUrl] = useState('')

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/events'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const formatForInput = (isoString?: string) => {
    if (!isoString) return ''
    const d = new Date(isoString); d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setTitle(item.title || ''); setDescription(item.description || '')
    setLocation(item.location || ''); setType(item.type || 'ride')
    setStartDate(formatForInput(item.startDate)); setEndDate(formatForInput(item.endDate))
    setOrganizerName(item.organizerName || '')
    setSocialMediaUrl(item.socialMediaUrl || '')
    setFeaturedImage(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/api/events/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setTitle(''); setDescription(''); setLocation(''); setStartDate(''); setEndDate(''); setType('ride')
    setOrganizerName(''); setSocialMediaUrl(''); setFeaturedImage(null); setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      let imageUrl = ''
      if (featuredImage) {
        const fd = new FormData(); fd.append('file', featuredImage)
        const res = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        imageUrl = res.data.url
      }
      
      const payload: any = {
        title, description, location, 
        startDate: new Date(startDate).toISOString(), 
        endDate: new Date(endDate).toISOString(), 
        type, authorId: 1, status: 'upcoming',
        organizerName, socialMediaUrl
      }
      if (imageUrl) payload.featuredImage = imageUrl

      if (editingId) {
        await api.put(`/api/events/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated!' })
      } else {
        await api.post('/api/events', payload)
        setStatusMsg({ type: 'success', text: 'Created!' })
      }
      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Events</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Event</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{new Date(item.startDate).toLocaleDateString()} - {item.location}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 inline-block">{item.type}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No events found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Event' : 'Create Event'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label><input required type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Description</label><textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Start Date/Time</label><input required type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
              <div><label className="block text-sm font-medium mb-1">End Date/Time</label><input required type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Organizer Name (Optional)</label><input type="text" value={organizerName} onChange={e => setOrganizerName(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
              <div><label className="block text-sm font-medium mb-1">Social Media URL (Optional)</label><input type="url" placeholder="https://" value={socialMediaUrl} onChange={e => setSocialMediaUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                  <option value="ride">Ride</option><option value="meeting">Meeting</option><option value="workshop">Workshop</option><option value="social">Social</option><option value="competition">Competition</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Cover Image {editingId && '(optional)'}</label><input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files?.[0] || null)} className="w-full px-4 py-2 border rounded-lg bg-white" /></div>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}</button>
          </div>
        </form>
      )}
    </div>
  )
}

// Services Manager Component
function ServicesManager() {
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('maintenance')

  useEffect(() => { if (mode === 'list') fetchItems() }, [mode])

  const fetchItems = async () => {
    try { const res = await api.get('/api/services'); setItems(res.data) } catch (e) { console.error(e) }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id); setName(item.name || ''); setTitle(item.title || '')
    setDescription(item.description || ''); setType(item.type || 'maintenance')
    setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try { await api.delete(`/api/services/${id}`); setItems(items.filter(i => i.id !== id)) } catch (e) { alert('Delete failed') }
  }

  const handleAddNew = () => {
    setEditingId(null); setName(''); setTitle(''); setDescription(''); setType('maintenance')
    setStatusMsg({ type: '', text: '' }); setMode('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setStatusMsg({ type: '', text: '' })
    try {
      const payload = { name, title, description, type }
      if (editingId) {
        await api.put(`/api/services/${editingId}`, payload)
        setStatusMsg({ type: 'success', text: 'Updated!' })
      } else {
        await api.post('/api/services', payload)
        setStatusMsg({ type: 'success', text: 'Created!' })
      }
      setTimeout(() => setMode('list'), 1500)
    } catch (error) {
      console.error(error); setStatusMsg({ type: 'error', text: 'Failed.' })
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
        {mode === 'list' && <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">+ Add Service</button>}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.title}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1 inline-block">{item.type}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-500 text-center py-8">No services found.</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Service' : 'Create Service'}</h3>
            <button type="button" onClick={() => setMode('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          {statusMsg.text && <div className={`p-4 mb-4 rounded-md ${statusMsg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{statusMsg.text}</div>}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Service Name</label><input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Pro Tune-up" /></div>
              <div><label className="block text-sm font-medium mb-1">Service Title</label><input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Get your bike fully tuned" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Description</label><textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg"></textarea></div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-white">
                <option value="maintenance">Maintenance</option><option value="sharing">Sharing</option><option value="accessories">Accessories</option><option value="training">Training</option><option value="sales">Sales</option><option value="garage">Garage</option>
              </select>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : (editingId ? 'Update' : 'Publish')}</button>
          </div>
        </form>
      )}
    </div>
  )
}
