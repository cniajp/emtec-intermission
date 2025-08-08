'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Event {
  abbr: string
  name: string
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'legacy' | 'new'>('new')

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events')
        const eventData = await response.json()
        setEvents(eventData)
        if (eventData.length > 0) {
          setSelectedEvent(eventData[0].abbr)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                EMTEC Intermission 管理画面
              </h1>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                URL形式選択
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="event-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                イベント:
              </label>
              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  読み込み中...
                </div>
              ) : (
                <select
                  id="event-select"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={events.length === 0}
                >
                  {events.length === 0 ? (
                    <option value="">イベントが見つかりません</option>
                  ) : (
                    events.map((event) => (
                      <option key={event.abbr} value={event.abbr}>
                        {event.abbr} - {event.name}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-400">イベント情報を読み込み中...</div>
          </div>
        )}
        
        {!loading && events.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600 dark:text-gray-400">利用可能なイベントが見つかりません</div>
          </div>
        )}
        
        {!loading && selectedEvent && (
          <>
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('new')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              新形式（推奨）
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                推奨
              </span>
            </button>
            <button
              onClick={() => setActiveTab('legacy')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'legacy'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              旧形式
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'new' && (
          <div className="space-y-12">
            {/* New Event-based Dreamkast Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Dreamkast 連携
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  外部APIからデータを取得 - イベント別URL形式
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <Link
                  href={`/${selectedEvent}/break-dk/menu/0`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedEvent.toUpperCase()} Day 1 - Dreamkast
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /[eventAbbr]/break-dk/menu/0 - イベント別URL
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        API連携
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href={`/${selectedEvent}/break-dk/menu/1`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedEvent.toUpperCase()} Day 2 - Dreamkast
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /[eventAbbr]/break-dk/menu/1 - イベント別URL
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        API連携
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </section>

            {/* New Event-based Static Data Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  静的データ
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  /src/data/talks.tsファイルに定義されたデータを使用 - イベント別URL形式
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <Link
                  href={`/${selectedEvent}/break/menu/1`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 1 - Static Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /[eventAbbr]/break/menu/1 - イベント別URL
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        ローカルファイル
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href={`/${selectedEvent}/break/menu/2`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 2 - Static Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /[eventAbbr]/break/menu/2 - イベント別URL
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        ローカルファイル
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'legacy' && (
          <div className="space-y-12">
            {/* Legacy Dreamkast Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Dreamkast 連携
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  外部APIからデータを取得 - レガシーURL形式
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <Link
                  href="/break-dk/menu/0"
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 1 - Dreamkast
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /break-dk/menu/0 - レガシーURL形式
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        API連携
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/break-dk/menu/1"
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 2 - Dreamkast
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /break-dk/menu/1 - レガシーURL形式
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        API連携
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </section>

            {/* Legacy Static Data Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  静的データ
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  talks.tsファイルに定義されたデータを使用 - レガシーURL形式
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <Link
                  href="/break/menu/1"
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 1 - Static Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /break/menu/1 - レガシーURL形式
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        ローカルファイル
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  href="/break/menu/2"
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Day 2 - Static Data
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        /break/menu/2 - レガシーURL形式
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        ローカルファイル
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* Comparison Table */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            URL形式比較
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ページ種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    URL形式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    更新方法
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    推奨度
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Dreamkast API (旧URL)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    /break-dk/menu/[day]
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    自動取得
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      従来形式
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Dreamkast API (新URL)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    /[eventAbbr]/break-dk/menu/[day]
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    自動取得
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      推奨
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Static Data (旧URL)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    /break/menu/[day]
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    手動編集
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      従来形式
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Static Data (新URL)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    /[eventAbbr]/break/menu/[day]
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    手動編集
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      推奨
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                EMTEC Intermission
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                イベント間のインターミッション画面を管理・配信するためのシステムです。
              </p>
            </div>
            
            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                技術スタック
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Next.js
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  TypeScript
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © EMTEC. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className="text-gray-400 dark:text-gray-500 text-xs">
                  バージョン: 2.0.0
                </span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    運用中
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
