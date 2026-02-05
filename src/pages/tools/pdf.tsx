import { useState, useRef, useCallback } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { Layout } from '@/components/Layout'

const WIDTH = 1920
const HEIGHT = 1080

type PDFDocument = {
  numPages: number
  getPage: (num: number) => Promise<PDFPage>
}

type PDFPage = {
  getViewport: (opts: { scale: number }) => { width: number; height: number }
  render: (opts: {
    canvasContext: CanvasRenderingContext2D
    viewport: unknown
  }) => { promise: Promise<void> }
}

declare global {
  interface Window {
    pdfjsLib: {
      GlobalWorkerOptions: { workerSrc: string }
      getDocument: (opts: { data: ArrayBuffer }) => {
        promise: Promise<PDFDocument>
      }
    }
    JSZip: new () => {
      file: (name: string, data: Blob) => void
      generateAsync: (opts: { type: string }) => Promise<Blob>
    }
  }
}

export default function PdfConverter() {
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null)
  const [fileName, setFileName] = useState('')
  const [previews, setPreviews] = useState<string[]>([])
  const [progress, setProgress] = useState({
    show: false,
    percent: 0,
    text: '',
  })
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg')
  const [quality, setQuality] = useState(92)
  const [bgColor, setBgColor] = useState<'white' | 'black' | 'transparent'>(
    'white'
  )
  const [scriptsLoaded, setScriptsLoaded] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentFileRef = useRef<File | null>(null)

  const isReady = scriptsLoaded >= 2

  const renderPage = useCallback(
    async (
      doc: PDFDocument,
      pageNum: number,
      targetWidth = WIDTH,
      bg: string
    ) => {
      const page = await doc.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1 })

      const scaleX = targetWidth / viewport.width
      const scaleY = (targetWidth * HEIGHT) / WIDTH / viewport.height
      const scale = Math.min(scaleX, scaleY)

      const scaledViewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = (targetWidth * HEIGHT) / WIDTH
      const ctx = canvas.getContext('2d')!

      if (bg === 'white') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (bg === 'black') {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      const offsetX =
        (canvas.width - (scaledViewport as { width: number }).width) / 2
      const offsetY =
        (canvas.height - (scaledViewport as { height: number }).height) / 2
      ctx.translate(offsetX, offsetY)

      await page.render({ canvasContext: ctx, viewport: scaledViewport })
        .promise
      return canvas
    },
    []
  )

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== 'application/pdf') {
        alert('PDFファイルを選択してください')
        return
      }

      currentFileRef.current = file
      const arrayBuffer = await file.arrayBuffer()
      const doc = await window.pdfjsLib.getDocument({ data: arrayBuffer })
        .promise

      setPdfDoc(doc)
      setFileName(file.name)
      setPreviews([])
      setProgress({ show: true, percent: 0, text: 'プレビュー生成中...' })

      const newPreviews: string[] = []
      for (let i = 1; i <= doc.numPages; i++) {
        const canvas = await renderPage(doc, i, 200, 'white')
        newPreviews.push(canvas.toDataURL('image/jpeg', 0.7))
        setProgress({
          show: true,
          percent: (i / doc.numPages) * 100,
          text: 'プレビュー生成中...',
        })
      }

      setPreviews(newPreviews)
      setProgress({ show: false, percent: 0, text: '' })
    },
    [renderPage]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  const handleConvert = useCallback(async () => {
    if (!pdfDoc || !currentFileRef.current) return

    setProgress({ show: true, percent: 0, text: '変換中...' })

    const zip = new window.JSZip()
    const baseName = currentFileRef.current.name.replace('.pdf', '')

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      setProgress({
        show: true,
        percent: (i / pdfDoc.numPages) * 100,
        text: `変換中... ${i} / ${pdfDoc.numPages}`,
      })

      const canvas = await renderPage(pdfDoc, i, WIDTH, bgColor)
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
      const ext = format === 'png' ? 'png' : 'jpg'

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mimeType, quality / 100)
      })

      zip.file(`info_${String(i).padStart(3, '0')}.${ext}`, blob)
    }

    setProgress({ show: true, percent: 100, text: 'ZIPファイル生成中...' })
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseName}_images.zip`
    a.click()
    URL.revokeObjectURL(url)

    setProgress({ show: false, percent: 0, text: '完了！' })
  }, [pdfDoc, format, quality, bgColor, renderPage])

  return (
    <Layout>
      <Head>
        <title>PDF → 画像変換 | EMTEC Intermission</title>
      </Head>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          setScriptsLoaded((s) => s + 1)
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        onLoad={() => setScriptsLoaded((s) => s + 1)}
      />

      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-8">
          PDF → 画像変換（1920×1080）
        </h1>

        {!isReady && (
          <p className="text-center text-neutral-400 mb-4">
            ライブラリ読み込み中...
          </p>
        )}

        <div
          className="border-2 border-dashed border-neutral-700 rounded-xl p-10 text-center cursor-pointer hover:border-neutral-500 hover:bg-neutral-800/30 transition-colors mb-6"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
            disabled={!isReady}
          />
          <p className="text-neutral-300">
            PDFファイルをドラッグ&ドロップ または クリックして選択
          </p>
        </div>

        {pdfDoc && (
          <div className="bg-neutral-800/50 border border-neutral-700 p-4 rounded-lg mb-6">
            <span className="mr-5 text-white">
              <strong>{fileName}</strong>
            </span>
            <span className="text-neutral-400">
              ページ数:{' '}
              <strong className="text-white">{pdfDoc.numPages}</strong>
            </span>
          </div>
        )}

        <div className="flex gap-5 mb-6 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <label className="text-neutral-400">形式:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png')}
              className="px-3 py-2 border border-neutral-700 rounded-md bg-neutral-800 text-white"
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-neutral-400">品質 (JPEG):</label>
            <input
              type="number"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              min={1}
              max={100}
              className="w-16 px-3 py-2 border border-neutral-700 rounded-md bg-neutral-800 text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-neutral-400">背景:</label>
            <select
              value={bgColor}
              onChange={(e) =>
                setBgColor(e.target.value as 'white' | 'black' | 'transparent')
              }
              className="px-3 py-2 border border-neutral-700 rounded-md bg-neutral-800 text-white"
            >
              <option value="white">白</option>
              <option value="black">黒</option>
              <option value="transparent">透明 (PNGのみ)</option>
            </select>
          </div>
          <button
            onClick={handleConvert}
            disabled={!pdfDoc || progress.show}
            className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-colors text-white font-medium"
          >
            変換してダウンロード
          </button>
        </div>

        {progress.show && (
          <div className="mb-6">
            <div className="h-2 bg-neutral-800 rounded overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-neutral-400">{progress.text}</p>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {previews.map((src, i) => (
            <div
              key={i}
              className="bg-neutral-800/50 border border-neutral-700 rounded-lg overflow-hidden"
            >
              <img src={src} alt={`Page ${i + 1}`} className="w-full" />
              <p className="p-2 text-center text-sm text-neutral-400">
                ページ {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
