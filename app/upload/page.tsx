'use client'

import { useState } from 'react'

export default function Upload() {
  const [status, setStatus] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(',')[1]
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            filename: file.name
          })
        })
        const data = await res.json()
        setStatus(`Uploaded! URL: ${data.url}`)
      } catch (error) {
        setStatus('Upload failed')
      }
    }
  }

  return (
    <div className="p-8">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload}
      />
      <pre className="mt-4 text-sm">{status}</pre>
    </div>
  )
} 