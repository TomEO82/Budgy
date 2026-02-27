import { useState, useMemo } from 'react'
import SalaryInput from './components/SalaryInput'
import BudgetBreakdown from './components/BudgetBreakdown'
import RatioSettings from './components/RatioSettings'

const DEFAULT_RATIOS = { needs: 50, wants: 30, savings: 20 }

function App() {
  const [dualMode, setDualMode] = useState(false)
  const [salary1, setSalary1] = useState('')
  const [salary2, setSalary2] = useState('')
  const [ratios, setRatios] = useState(DEFAULT_RATIOS)
  const [showSettings, setShowSettings] = useState(false)

  const s1 = parseFloat(salary1) || 0
  const s2 = dualMode ? (parseFloat(salary2) || 0) : 0
  const total = s1 + s2

  const breakdown = useMemo(() => {
    if (total === 0) return null
    return {
      needs: {
        total: total * ratios.needs / 100,
        person1: s1 * ratios.needs / 100,
        person2: s2 * ratios.needs / 100,
      },
      wants: {
        total: total * ratios.wants / 100,
        person1: s1 * ratios.wants / 100,
        person2: s2 * ratios.wants / 100,
      },
      savings: {
        total: total * ratios.savings / 100,
        person1: s1 * ratios.savings / 100,
        person2: s2 * ratios.savings / 100,
      },
    }
  }, [s1, s2, total, ratios])

  const handleModeToggle = () => {
    setDualMode(!dualMode)
    if (dualMode) setSalary2('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            <span className="inline-block mr-2">💰</span>
            Budgy
          </h1>
          <p className="text-slate-500 text-lg">Smart salary budget calculator</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <button
              onClick={() => { setDualMode(false); setSalary2('') }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !dualMode
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              👤 Solo
            </button>
            <button
              onClick={() => setDualMode(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                dualMode
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              👥 Partners
            </button>
          </div>
        </div>

        {/* Salary Inputs */}
        <SalaryInput
          dualMode={dualMode}
          salary1={salary1}
          salary2={salary2}
          onSalary1Change={setSalary1}
          onSalary2Change={setSalary2}
        />

        {/* Total */}
        {total > 0 && (
          <div className="text-center my-6">
            <div className="inline-flex items-center gap-2 bg-white rounded-2xl px-6 py-3 shadow-md">
              <span className="text-slate-500 text-sm font-medium">Combined Net Income</span>
              <span className="text-2xl font-bold text-slate-800">
                {total.toLocaleString('he-IL')}₪
              </span>
            </div>
          </div>
        )}

        {/* Ratio Settings Toggle */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
          >
            ⚙️ {showSettings ? 'Hide' : 'Adjust'} ratios
            <span className="text-xs">({ratios.needs}/{ratios.wants}/{ratios.savings})</span>
          </button>
        </div>

        {showSettings && (
          <RatioSettings
            ratios={ratios}
            onRatiosChange={setRatios}
            onReset={() => setRatios(DEFAULT_RATIOS)}
          />
        )}

        {/* Budget Breakdown */}
        {breakdown && (
          <BudgetBreakdown
            breakdown={breakdown}
            ratios={ratios}
            dualMode={dualMode}
          />
        )}

        {/* Empty State */}
        {!breakdown && (
          <div className="text-center mt-12 text-slate-400">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-lg">Enter your salary to see the breakdown</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
