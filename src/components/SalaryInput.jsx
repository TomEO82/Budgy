function SalaryInput({ dualMode, salary1, salary2, onSalary1Change, onSalary2Change }) {
  return (
    <div className={`grid gap-4 ${dualMode ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
      <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
        <label className="block text-sm font-medium text-slate-500 mb-2">
          {dualMode ? '👤 Person 1 — Net Salary' : '👤 Your Net Salary'}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₪</span>
          <input
            type="number"
            value={salary1}
            onChange={(e) => onSalary1Change(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full pl-9 pr-4 py-3 text-xl font-semibold text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {dualMode && (
        <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
          <label className="block text-sm font-medium text-slate-500 mb-2">
            👤 Person 2 — Net Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₪</span>
            <input
              type="number"
              value={salary2}
              onChange={(e) => onSalary2Change(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full pl-9 pr-4 py-3 text-xl font-semibold text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SalaryInput
