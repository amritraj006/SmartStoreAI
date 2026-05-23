function StatsCard({ title, value, icon, color, bgColor, trend }) {
  const getTheme = (colorCls = "") => {
    if (colorCls.includes("emerald")) {
      return { text: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" };
    }
    if (colorCls.includes("orange")) {
      return { text: "text-orange-400", bg: "bg-orange-500/10 border border-orange-500/20" };
    }
    if (colorCls.includes("violet")) {
      return { text: "text-violet-400", bg: "bg-violet-500/10 border border-violet-500/20" };
    }
    return { text: "text-indigo-400", bg: "bg-indigo-500/10 border border-indigo-500/20" };
  };

  const theme = getTheme(color);

  return (
    <div className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl transition-all duration-300 p-6 border border-slate-800/80 hover:border-slate-700/80 hover:-translate-y-0.5 animate-fade-in-up">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-white mt-2 tracking-tight">{value}</h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              <span>{trend >= 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(trend)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <div className={`text-xl ${theme.text}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;