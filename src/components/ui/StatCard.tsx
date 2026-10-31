import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { CountUp } from './CountUp';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  colorScheme?: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';
  delay?: number;
}

const colorStyles = {
  indigo: {
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:bg-indigo-500/20',
    border: 'hover:border-indigo-500/30',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20',
    border: 'hover:border-emerald-500/30',
  },
  violet: {
    iconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/20',
    border: 'hover:border-violet-500/30',
  },
  amber: {
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20',
    border: 'hover:border-amber-500/30',
  },
  rose: {
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/20',
    border: 'hover:border-rose-500/30',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:bg-cyan-500/20',
    border: 'hover:border-cyan-500/30',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  change,
  isPositive = true,
  colorScheme = 'indigo',
  delay = 0,
}) => {
  const scheme = colorStyles[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            <CountUp end={value} prefix={prefix} suffix={suffix} />
          </div>
          {change && (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {isPositive ? (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {change}
                </span>
              ) : (
                <span className="flex items-center text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {change}
                </span>
              )}
              <span className="text-slate-500 dark:text-slate-400">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};
