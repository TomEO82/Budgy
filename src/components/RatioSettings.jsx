function RatioSettings({ ratios, onRatiosChange, onReset }) {
  const total = ratios.needs + ratios.wants + ratios.savings
  const isValid = total === 100

  const handleChange = (key, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0))
    onRatiosChange({ ...ratios, [key]: num })
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-600">Budget Ratios</h3>
        <button
          onClick={onReset}
          className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
        >
          Reset to 50/30/20
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'needs', label: 'Needs', emoji: '🏠', color: 'blue' },
          { key: 'wants', label: 'Wants', emoji: '🎯', color: 'purple' },
          { key: 'savings', label: 'Savings', emoji: '🏦', color: 'emerald' },
        ].map(({ key, label, emoji, color }) => (
          <div key={key} className="text-center">
            <label className="block text-xs text-slate-500 mb-1">
              {emoji} {label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={ratios[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                min="0"
                max="100"
                className={`w-full text-center py-2 text-lg font-semibold rounded-lg border outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isValid
                    ? 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                    : 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                }`}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>
        ))}
      </div>

      {!isValid && (
        <p className="text-red-500 text-xs text-center mt-3">
          ⚠️ Ratios must add up to 100% (currently {total}%)
        </p>
      )}
    </div>
  )
}

export default RatioSettings
