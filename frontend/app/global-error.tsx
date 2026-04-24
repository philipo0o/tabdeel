'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // If it's a chunk load error, force a hard reload of the page
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      window.location.reload()
    }
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong!</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => reset()}
            style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
