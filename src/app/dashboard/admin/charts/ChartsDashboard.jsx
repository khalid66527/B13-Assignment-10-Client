"use client";

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

const ChartsDashboard = ({ sales = [], categoryCounts = [], totalArtworks = 0 }) => {
    // 💡 Active states for interactivity
    const [activeSaleIndex, setActiveSaleIndex] = useState(null);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);

    // 📈 SVG dimensions
    const lineChartWidth = 700;
    const lineChartHeight = 350;
    const chartPadding = 50;

    // 1. Process Sales Data for Line/Area Chart
    const salesPoints = useMemo(() => {
        if (sales.length === 0) return [];
        
        // Group by date
        const grouped = sales.reduce((acc, sale) => {
            const dateStr = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            acc[dateStr] = (acc[dateStr] || 0) + Number(sale.amount);
            return acc;
        }, {});

        // Convert to array and sort by original date chronological order
        const uniqueDates = Object.keys(grouped);
        const points = uniqueDates.map(date => {
            // Find earliest matching sale to get timestamp for sorting
            const matchingSale = sales.find(s => 
                new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === date
            );
            return {
                label: date,
                amount: grouped[date],
                timestamp: new Date(matchingSale.date).getTime()
            };
        }).sort((a, b) => a.timestamp - b.timestamp);

        // Calculate SVG Coordinates
        const maxAmount = Math.max(...points.map(p => p.amount), 100);
        
        const usableWidth = lineChartWidth - (chartPadding * 2);
        const usableHeight = lineChartHeight - (chartPadding * 2);

        return points.map((p, idx) => {
            const x = chartPadding + (idx * (usableWidth / (Math.max(points.length - 1, 1))));
            const y = lineChartHeight - chartPadding - ((p.amount / maxAmount) * usableHeight);
            return { ...p, x, y };
        });
    }, [sales]);

    // Construct SVG paths
    const { linePath, areaPath } = useMemo(() => {
        if (salesPoints.length === 0) return { linePath: "", areaPath: "" };
        
        let pathD = `M ${salesPoints[0].x} ${salesPoints[0].y}`;
        let areaD = `M ${salesPoints[0].x} ${lineChartHeight - chartPadding} L ${salesPoints[0].x} ${salesPoints[0].y}`;

        for (let i = 1; i < salesPoints.length; i++) {
            pathD += ` L ${salesPoints[i].x} ${salesPoints[i].y}`;
            areaD += ` L ${salesPoints[i].x} ${salesPoints[i].y}`;
        }

        areaD += ` L ${salesPoints[salesPoints.length - 1].x} ${lineChartHeight - chartPadding} Z`;

        return { linePath: pathD, areaPath: areaD };
    }, [salesPoints]);

    // 2. Process Categories for Donut Chart
    const donutData = useMemo(() => {
        const colors = [
            "#D4AF37", // Gold
            "#FFE58F", // Light Amber
            "#A78BFA", // Lavender/Purple
            "#60A5FA", // Sky Blue
            "#34D399", // Emerald
            "#F87171"  // Salmon
        ];

        let accumulatedPercent = 0;
        return categoryCounts.map(([name, count], idx) => {
            const pct = totalArtworks > 0 ? count / totalArtworks : 0;
            const startAngle = accumulatedPercent * 360;
            accumulatedPercent += pct;
            
            return {
                name,
                count,
                percentage: pct * 100,
                color: colors[idx % colors.length]
            };
        });
    }, [categoryCounts, totalArtworks]);

    // Donut math
    const radius = 70;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius; // ~439.82

    let accumulatedCircumference = 0;

    return (
        <div className="space-y-8 pb-10">
            {/* 🏷️ Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:pie-chart-3-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Platform Charts</h1>
                        <p className="text-xs text-gray-500 mt-1">Interactive data representations of sales trends and category distributions.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 📈 Sales Trend Line Chart */}
                <div className="lg:col-span-2 bg-[#111111]/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                            <Icon icon="solar:graph-up-bold-duotone" className="text-[#D4AF37]" />
                            Revenue Generation Trend
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-6">Daily aggregated platform sales and purchases revenue.</p>
                    </div>

                    {salesPoints.length > 0 ? (
                        <div className="relative w-full overflow-x-auto select-none">
                            <svg 
                                viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`} 
                                className="w-full min-w-[600px] h-auto overflow-visible"
                            >
                                {/* Gradients definitions */}
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#AA7C11" />
                                        <stop offset="50%" stopColor="#D4AF37" />
                                        <stop offset="100%" stopColor="#FFE58F" />
                                    </linearGradient>
                                </defs>

                                {/* Y-Axis Gridlines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                                    const y = chartPadding + (i * ((lineChartHeight - chartPadding * 2) / 4));
                                    return (
                                        <line 
                                            key={i} 
                                            x1={chartPadding} 
                                            y1={y} 
                                            x2={lineChartWidth - chartPadding} 
                                            y2={y} 
                                            stroke="white" 
                                            strokeOpacity="0.04" 
                                            strokeDasharray="4 4" 
                                        />
                                    );
                                })}

                                {/* Area Fill */}
                                <path d={areaPath} fill="url(#areaGradient)" />

                                {/* Trend Spline Path */}
                                <path 
                                    d={linePath} 
                                    fill="none" 
                                    stroke="url(#lineGradient)" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round"
                                />

                                {/* Interactive Dots */}
                                {salesPoints.map((pt, idx) => (
                                    <g key={idx} className="cursor-pointer">
                                        {/* Highlight background circle on hover */}
                                        {activeSaleIndex === idx && (
                                            <circle 
                                                cx={pt.x} 
                                                cy={pt.y} 
                                                r="12" 
                                                fill="#D4AF37" 
                                                fillOpacity="0.15" 
                                            />
                                        )}
                                        {/* Main Dot */}
                                        <circle 
                                            cx={pt.x} 
                                            cy={pt.y} 
                                            r={activeSaleIndex === idx ? "6" : "4.5"} 
                                            fill={activeSaleIndex === idx ? "#FFE58F" : "#D4AF37"} 
                                            stroke="#0A0A0A" 
                                            strokeWidth="2"
                                            onMouseEnter={() => setActiveSaleIndex(idx)}
                                            onMouseLeave={() => setActiveSaleIndex(null)}
                                        />
                                    </g>
                                ))}

                                {/* X-Axis Labels */}
                                {salesPoints.map((pt, idx) => {
                                    // Render alternate labels or all if count is small to avoid overlap
                                    const shouldRender = salesPoints.length < 10 || idx % 2 === 0 || idx === salesPoints.length - 1;
                                    if (!shouldRender) return null;

                                    return (
                                        <text
                                            key={idx}
                                            x={pt.x}
                                            y={lineChartHeight - chartPadding + 22}
                                            fill="#888"
                                            fontSize="10"
                                            textAnchor="middle"
                                            fontWeight="bold"
                                            fontFamily="monospace"
                                        >
                                            {pt.label}
                                        </text>
                                    );
                                })}
                            </svg>

                            {/* Floating Tooltip Component */}
                            {activeSaleIndex !== null && (
                                <div 
                                    className="absolute bg-zinc-950/95 border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-left pointer-events-none shadow-2xl transition-all duration-150"
                                    style={{
                                        left: `${(salesPoints[activeSaleIndex].x / lineChartWidth) * 100}%`,
                                        top: `${(salesPoints[activeSaleIndex].y / lineChartHeight) * 100 - 18}%`,
                                        transform: 'translate(-50%, -100%)'
                                    }}
                                >
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{salesPoints[activeSaleIndex].label}</p>
                                    <p className="text-xs font-black text-[#D4AF37] mt-0.5">
                                        ${salesPoints[activeSaleIndex].amount.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-xs text-gray-600">
                            Insufficient sales records to model trend.
                        </div>
                    )}
                </div>

                {/* 🍩 Category Donut Chart (Circle pie chart) */}
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between items-center text-center">
                    <div className="w-full text-left">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                            <Icon icon="solar:folder-open-bold-duotone" className="text-[#D4AF37]" />
                            Category Share
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-6">Percentage share of artworks by category classification.</p>
                    </div>

                    {donutData.length > 0 ? (
                        <div className="flex flex-col items-center gap-8 w-full">
                            {/* SVG Donut */}
                            <div className="relative w-40 h-40">
                                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                                    {/* Base Background Circle */}
                                    <circle 
                                        cx="80" 
                                        cy="80" 
                                        r={radius} 
                                        fill="transparent" 
                                        stroke="white" 
                                        strokeOpacity="0.02" 
                                        strokeWidth={strokeWidth} 
                                    />

                                    {/* Segment Slices */}
                                    {donutData.map((slice, idx) => {
                                        const sliceOffset = accumulatedCircumference;
                                        const sliceStroke = (slice.percentage / 100) * circumference;
                                        accumulatedCircumference -= sliceStroke;

                                        const isHighlighted = activeCategoryIndex === idx;

                                        return (
                                            <circle
                                                key={idx}
                                                cx="80"
                                                cy="80"
                                                r={radius}
                                                fill="transparent"
                                                stroke={slice.color}
                                                strokeWidth={isHighlighted ? strokeWidth + 4 : strokeWidth}
                                                strokeDasharray={`${sliceStroke} ${circumference}`}
                                                strokeDashoffset={sliceOffset}
                                                strokeLinecap="butt"
                                                className="transition-all duration-300 cursor-pointer"
                                                style={{ transformOrigin: '80px 80px' }}
                                                onMouseEnter={() => setActiveCategoryIndex(idx)}
                                                onMouseLeave={() => setActiveCategoryIndex(null)}
                                            />
                                        );
                                    })}
                                </svg>

                                {/* Center Donut Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    {activeCategoryIndex !== null ? (
                                        <>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                {donutData[activeCategoryIndex].name}
                                            </span>
                                            <span className="text-lg font-black text-white mt-0.5">
                                                {donutData[activeCategoryIndex].percentage.toFixed(1)}%
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Total</span>
                                            <span className="text-xl font-black text-[#D4AF37] mt-0.5">
                                                {totalArtworks}
                                            </span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Arts</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Legend Labels Grid */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full pt-4 border-t border-white/5">
                                {donutData.map((slice, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex items-center gap-2 cursor-pointer transition-all ${
                                            activeCategoryIndex === idx ? 'opacity-100 scale-105 font-bold' : 'opacity-70'
                                        }`}
                                        onMouseEnter={() => setActiveCategoryIndex(idx)}
                                        onMouseLeave={() => setActiveCategoryIndex(null)}
                                    >
                                        <span 
                                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                                            style={{ backgroundColor: slice.color }}
                                        ></span>
                                        <div className="text-left leading-none">
                                            <p className="text-[11px] text-white truncate max-w-[70px]">{slice.name}</p>
                                            <p className="text-[9px] text-gray-500 font-mono mt-0.5">{slice.count} arts</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-xs text-gray-600">
                            No categories available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartsDashboard;
