import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, change, changeType }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-sm ${
            changeType === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );
}