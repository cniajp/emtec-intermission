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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              EMTEC Intermission
            </h1>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="event-select"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
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
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={events.length === 0}
                >
                  {events.length === 0 ? (
                    <option value="">イベントが見つかりません</option>
                  ) : (
                    events.map((event) => (
                      <option key={event.abbr} value={event.abbr}>
                        {event.abbr}
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              イベント情報を読み込み中...
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              利用可能なイベントが見つかりません
            </div>
          </div>
        )}

        {!loading && selectedEvent && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('new')}
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
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
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
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
              <div className="space-y-8">
                {/* New Event-based Dreamkast Section */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Dreamkast 連携
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      外部APIからデータを取得 - イベント別URL形式
                    </p>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                      <div className="flex">
                        <svg
                          className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">
                            注意: CORSエラー
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            異なるドメイン間でのAPI呼び出しによりCORSエラーが発生する可能性があります。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-3">
                    <Link
                      href={`/${selectedEvent}/break-dk/menu/0`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {selectedEvent.toUpperCase()} Day 1
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /{selectedEvent}/break-dk/menu/0
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            API連携
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>

                    <Link
                      href={`/${selectedEvent}/break-dk/menu/1`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {selectedEvent.toUpperCase()} Day 2
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /{selectedEvent}/break-dk/menu/1
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            API連携
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </section>

                {/* New Event-based Static Data Section */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      静的データ
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      talks.tsファイルに定義されたデータを使用
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-3">
                    <Link
                      href={`/${selectedEvent}/break/menu/1`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 1 - Static Data
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /{selectedEvent}/break/menu/1
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            ローカルファイル
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>

                    <Link
                      href={`/${selectedEvent}/break/menu/2`}
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 2 - Static Data
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /{selectedEvent}/break/menu/2
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            ローカルファイル
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'legacy' && (
              <div className="space-y-8">
                {/* Legacy Dreamkast Section */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      Dreamkast 連携
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      外部APIからデータを取得 - レガシーURL形式
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-3">
                    <Link
                      href="/break-dk/menu/0"
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 1 - Dreamkast
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /break-dk/menu/0 - レガシーURL形式
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            API連携
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>

                    <Link
                      href="/break-dk/menu/1"
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 2 - Dreamkast
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /break-dk/menu/1 - レガシーURL形式
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            API連携
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
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
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 1 - Static Data
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /break/menu/1 - レガシーURL形式
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            ローカルファイル
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>

                    <Link
                      href="/break/menu/2"
                      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Day 2 - Static Data
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
                            /break/menu/2 - レガシーURL形式
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                            ローカルファイル
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </section>
              </div>
            )}

            {/* Comparison Table */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                EMTEC Intermission
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                イベント間のインターミッション画面を管理・配信するためのシステム
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <span>v2.0.0</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>運用中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
