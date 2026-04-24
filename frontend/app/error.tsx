'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      window.location.reload()
    }
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong.</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">We encountered an unexpected loading issue. Please try reloading the page.</p>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
