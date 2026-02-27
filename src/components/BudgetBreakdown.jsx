const fmt = (n) => n.toLocaleString('he-IL', { maximumFractionDigits: 0 })

const categories = [
  {
    key: 'needs',
    title: 'Needs',
    emoji: '🏠',
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    person1Color: 'bg-blue-500',
    person2Color: 'bg-cyan-400',
    subcategories: ['Housing', 'Transportation', 'Groceries'],
    subcatEmojis: ['🏡', '🚗', '🛒'],
  },
  {
    key: 'wants',
    title: 'Wants',
    emoji: '🎯',
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    person1Color: 'bg-purple-500',
    person2Color: 'bg-fuchsia-400',
    subcategories: ['Entertainment', 'Subscriptions', 'Shopping'],
    subcatEmojis: ['🎬', '📱', '🛍️'],
  },
  {
    key: 'savings',
    title: 'Savings & Investments',
    emoji: '🏦',
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    person1Color: 'bg-emerald-500',
    person2Color: 'bg-teal-400',
    subcategories: ['Investment', 'Savings', 'Debt Payment'],
    subcatEmojis: ['📈', '💰', '💳'],
  },
]

function BudgetBreakdown({ breakdown, ratios, dualMode }) {
  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const data = breakdown[cat.key]
        const ratio = ratios[cat.key]

        return (
          <div
            key={cat.key}
            className={`bg-white rounded-2xl shadow-md border ${cat.borderColor} overflow-hidden`}
          >
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${cat.bgGradient} px-5 py-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{cat.title}</h3>
                    <span className="text-white/70 text-sm">{ratio}% of income</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{fmt(data.total)}₪</div>
                </div>
              </div>
            </div>

            {/* Person Breakdown (dual mode) */}
            {dualMode && data.person2 > 0 && (
              <div className="px-5 py-3 border-b border-slate-100">
                {/* Stacked bar */}
                <div className="flex rounded-full overflow-hidden h-3 mb-3">
                  <div
                    className={`${cat.person1Color} transition-all`}
                    style={{ width: `${(data.person1 / data.total) * 100}%` }}
                  />
                  <div
                    className={`${cat.person2Color} transition-all`}
                    style={{ width: `${(data.person2 / data.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.person1Color}`} />
                    <span className="text-slate-600">Person 1</span>
                    <span className="font-semibold text-slate-800">{fmt(data.person1)}₪</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cat.person2Color}`} />
                    <span className="text-slate-600">Person 2</span>
                    <span className="font-semibold text-slate-800">{fmt(data.person2)}₪</span>
                  </div>
                </div>
              </div>
            )}

            {/* Subcategories */}
            <div className="px-5 py-3">
              <div className="flex flex-wrap gap-2">
                {cat.subcategories.map((sub, i) => (
                  <span
                    key={sub}
                    className={`${cat.bgLight} ${cat.textColor} text-xs font-medium px-3 py-1.5 rounded-full`}
                  >
                    {cat.subcatEmojis[i]} {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BudgetBreakdown
