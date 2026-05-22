function StatsCard({ title, value, icon, color, trend, trendValue }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {value}
          </h3>
          
          {/* Optional trend indicator */}
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>

        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`text-2xl ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;