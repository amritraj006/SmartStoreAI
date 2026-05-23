function StatsCard({ title, value, icon, color, bgColor, trend }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 hover:border-slate-200 hover:-translate-y-0.5 animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{value}</h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              <span>{trend >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${bgColor || "bg-indigo-50"} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <div className={`text-xl ${color}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;