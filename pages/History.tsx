import React from 'react';
import { useStore } from '../store';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { CalendarHeatmap } from '../components/CalendarHeatmap';

export const History = () => {
  const { history } = useStore();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Your Journey</h1>
        <div className="text-sm text-gray-500">
           Total Quizzes: <span className="font-bold text-gray-900 dark:text-white">{history.length}</span>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <CalendarHeatmap />

      {/* History Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detailed Log</h2>
        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm overflow-hidden">
          {history.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No history yet. Take your first quiz!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-700 border-b border-gray-100 dark:border-dark-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Quiz Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
                  {history.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.quizTitle}</div>
                        <div className="text-xs text-gray-500">ID: {item.quizId.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          item.score >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          item.score >= 60 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {item.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                        <Clock size={14} />
                        {Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s
                      </td>
                      <td className="px-6 py-4">
                        {item.score >= 60 ? (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                          <XCircle className="text-red-500 w-5 h-5" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};