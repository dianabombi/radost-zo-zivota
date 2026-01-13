import { useState } from 'react'
import { Header } from './components/layout'
import { Button, Counter } from './components/ui'
import { AuthModal } from './components'
import Leaderboard from './components/leaderboard/Leaderboard'
import VerificationHub from './components/verification/VerificationHub'
import DashboardHome from './components/dashboard/DashboardHome'
import ScreenshotProtection from './components/ui/ScreenshotProtection'
import CookieConsent from './components/legal/CookieConsent'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import GDPRPage from './components/legal/GDPRPage'
import CookiesPage from './components/legal/CookiesPage'
import { useAuth } from './contexts/AuthContext'
import './App.css'

type ViewMode = 'home' | 'leaderboard' | 'verification' | 'game' | 'privacy' | 'gdpr' | 'cookies';

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const [count, setCount] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('home')

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <p className="text-gray-300 font-poppins text-xl">Načítava sa...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return <AuthModal />
  }

  // Show main app if authenticated
  return (
    <ScreenshotProtection>
      <div className="min-h-screen px-0 py-4 sm:p-6 md:p-8 transition-colors duration-300 bg-light-bg dark:bg-deep-charcoal">
        <div className="max-w-7xl mx-auto">
        {!['privacy', 'gdpr', 'cookies'].includes(viewMode) && (
          <Header 
            title="Hra na radosť zo života" 
            viewMode={viewMode as 'home' | 'leaderboard' | 'verification' | 'game'}
            onViewChange={setViewMode}
          />
        )}
        
        {/* Content Views */}
        {viewMode === 'home' && (
          <DashboardHome onNavigate={(view) => setViewMode(view)} />
        )}
        
        {viewMode === 'leaderboard' && <Leaderboard />}
        
        {viewMode === 'verification' && <VerificationHub />}

        {viewMode === 'privacy' && <PrivacyPolicy onBack={() => setViewMode('home')} />}
        
        {viewMode === 'gdpr' && <GDPRPage onBack={() => setViewMode('home')} />}
        
        {viewMode === 'cookies' && <CookiesPage onBack={() => setViewMode('home')} />}
        
        {viewMode === 'game' && (
          /* Main Gaming Card */
          <div className="bg-charcoal-light border-2 border-electric-blue rounded-2xl sm:rounded-3xl shadow-neon-blue p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border border-vibrant-green rounded-full hidden sm:block"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 border border-warm-yellow rounded-full hidden sm:block"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-electric-blue rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-bold text-transparent bg-gradient-to-r from-vibrant-green to-electric-blue bg-clip-text mb-6 sm:mb-8 px-2">
              Welcome to Your Social Gaming Hub
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
              {/* Counter Section */}
              <div className="bg-deep-charcoal border border-vibrant-green rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-neon-green transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-poppins font-semibold text-vibrant-green mb-4 sm:mb-6">
                  Score Counter
                </h3>
                <Counter
                  initialValue={count}
                  onCountChange={handleCountChange}
                  className="justify-center"
                />
                <p className="text-gray-300 mt-3 sm:mt-4 font-poppins text-sm sm:text-base">
                  Current Score: <span className="text-warm-yellow font-bold">{count}</span>
                </p>
              </div>
              
              {/* Button Controls */}
              <div className="bg-deep-charcoal border border-electric-blue rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-neon-blue transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-poppins font-semibold text-electric-blue mb-4 sm:mb-6">
                  Game Controls
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <Button 
                    onClick={() => setCount(count + 1)}
                    variant="success"
                    className="w-full text-sm sm:text-base"
                    glow={count > 5}
                  >
                    🎯 Level Up (+1)
                  </Button>
                  <Button 
                    onClick={() => setCount(Math.max(0, count - 1))}
                    variant="warning"
                    className="w-full text-sm sm:text-base"
                  >
                    ⚡ Power Down (-1)
                  </Button>
                  <Button 
                    onClick={() => setCount(0)}
                    variant="outline"
                    className="w-full text-sm sm:text-base"
                  >
                    🔄 Reset Game
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="mt-8 sm:mt-10 md:mt-12 bg-deep-charcoal border border-warm-yellow rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
              <p className="text-gray-300 font-poppins text-base sm:text-lg">
                Game Status: <span className="text-warm-yellow font-bold">
                  {count === 0 ? 'Ready to Start' : count < 5 ? 'Getting Started' : count < 10 ? 'On Fire!' : 'Legendary!'}
                </span>
              </p>
              <div className="mt-3 sm:mt-4 bg-charcoal-light rounded-full h-2 sm:h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-vibrant-green to-warm-yellow transition-all duration-500"
                  style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
            
          </div>
        </div>
        )}
        
        <footer className="text-center font-poppins px-4 mt-6 sm:mt-8 space-y-3">
          <p className="text-gray-600 dark:text-gray-300 opacity-80 dark:opacity-60 text-sm sm:text-base">
            🎮 Užívaj si hru na radosť zo života
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <button onClick={() => setViewMode('privacy')} className="text-electric-blue hover:text-vibrant-green transition-colors">
              Privacy Policy
            </button>
            <span className="text-gray-400">•</span>
            <button onClick={() => setViewMode('cookies')} className="text-electric-blue hover:text-vibrant-green transition-colors">
              Cookies
            </button>
            <span className="text-gray-400">•</span>
            <button onClick={() => setViewMode('gdpr')} className="text-electric-blue hover:text-vibrant-green transition-colors">
              GDPR
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Created by <span className="text-vibrant-green font-semibold">Wavelyne</span>
          </p>
        </footer>
      </div>
    </div>
    <CookieConsent />
  </ScreenshotProtection>
  )
}

export default App
