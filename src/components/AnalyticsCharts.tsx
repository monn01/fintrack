"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatRupiah } from "@/lib/utils";

interface CashFlowPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface CategoryPoint {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartsProps {
  cashFlowData: CashFlowPoint[];
  categoryData: CategoryPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121215] border border-[#27272a] p-3 rounded-xl shadow-xl text-xs">
        <p className="font-semibold text-white mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 font-mono">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-zinc-400 capitalize">{entry.name}:</span>
            <span className="font-bold text-white">
              {formatRupiah(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({ cashFlowData, categoryData }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* CASH FLOW AREA CHART */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Tren Arus Kas (Cash Flow)</h3>
            <p className="text-xs text-zinc-500">Perbandingan pemasukan vs pengeluaran 6 bulan terakhir</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Pemasukan</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Pengeluaran</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val / 1000000}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="pemasukan"
                name="Pemasukan"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="pengeluaran"
                name="Pengeluaran"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN DONUT CHART */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-[#27272a] shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Distribusi Pengeluaran</h3>
          <p className="text-xs text-zinc-500">Porsi pengeluaran berdasarkan kategori bulan ini</p>
        </div>

        <div className="h-56 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121215" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatRupiah(Number(value)), "Nominal"]}
                contentStyle={{
                  backgroundColor: "#121215",
                  borderColor: "#27272a",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#27272a]">
          {categoryData.slice(0, 4).map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
              <span className="text-zinc-400 truncate">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
