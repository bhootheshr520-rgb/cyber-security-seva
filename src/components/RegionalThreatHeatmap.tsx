import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Flame, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  PlusCircle, 
  Filter, 
  Layers, 
  Radio, 
  X, 
  Check, 
  ArrowUpRight, 
  Users, 
  Activity,
  Grid,
  Map as MapIcon,
  RotateCcw
} from 'lucide-react';
import { INITIAL_HOTSPOTS, ThreatHotspot } from '../data/hotspotsData';

interface RegionalThreatHeatmapProps {
  onOpenSos: () => void;
}

export const RegionalThreatHeatmap: React.FC<RegionalThreatHeatmapProps> = ({ onOpenSos }) => {
  const [hotspots, setHotspots] = useState<ThreatHotspot[]>(INITIAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<ThreatHotspot | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'digitalArrest' | 'apkTrojan' | 'electricityBill' | 'telegramTask' | 'upiPhishing'>('all');
  const [timeWindow, setTimeWindow] = useState<'24h' | '7d' | '30d'>('7d');
  const [viewMode, setViewMode] = useState<'map' | 'matrix'>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // New report form state
  const [reportHotspotId, setReportHotspotId] = useState(INITIAL_HOTSPOTS[0].id);
  const [reportCategory, setReportCategory] = useState<'digitalArrest' | 'apkTrojan' | 'electricityBill' | 'telegramTask' | 'upiPhishing'>('digitalArrest');
  const [reportCity, setReportCity] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const svgRef = useRef<SVGSVGElement | null>(null);
  const matrixSvgRef = useRef<SVGSVGElement | null>(null);

  // Sync with user reports from Report Scam component
  useEffect(() => {
    const handleScamReported = (e: Event) => {
      const customEvent = e as CustomEvent<{ city?: string; category?: string }>;
      const detail = customEvent.detail;
      if (!detail) return;

      setHotspots((prev) => {
        return prev.map((hs) => {
          const matchCity = detail.city && hs.name.toLowerCase().includes(detail.city.toLowerCase());
          if (matchCity) {
            return {
              ...hs,
              reportCount: hs.reportCount + 1,
              intensity: Math.min(100, hs.intensity + 1),
              lastReported: 'Just now'
            };
          }
          return hs;
        });
      });
    };

    window.addEventListener('cyber_scam_reported', handleScamReported);
    return () => window.removeEventListener('cyber_scam_reported', handleScamReported);
  }, []);

  // Filtered hotspots based on scam type
  const displayedHotspots = useMemo(() => {
    return hotspots.map((hs) => {
      let relativeIntensity = hs.intensity;
      if (activeFilter !== 'all') {
        const catShare = hs.categoryBreakdown[activeFilter]; // percentage 0 - 100
        relativeIntensity = Math.min(100, Math.round((hs.intensity * catShare) / 28));
      }
      return {
        ...hs,
        currentIntensity: Math.max(25, relativeIntensity),
      };
    });
  }, [hotspots, activeFilter]);

  // Aggregate stats
  const totalReports = useMemo(() => {
    return hotspots.reduce((acc, h) => acc + h.reportCount, 0);
  }, [hotspots]);

  const highestRiskZone = useMemo(() => {
    return [...hotspots].sort((a, b) => b.intensity - a.intensity)[0];
  }, [hotspots]);

  // D3 Map Heatmap Rendering
  useEffect(() => {
    if (viewMode !== 'map' || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear prior elements

    const width = 390;
    const height = 450;

    // Projection mapping for Indian coordinates (approx lon: 68 - 92, lat: 8 - 35)
    const xScale = d3.scaleLinear().domain([68.5, 90.5]).range([38, width - 30]);
    const yScale = d3.scaleLinear().domain([33.5, 8.5]).range([35, height - 35]);

    // Color scale for heat intensity
    const colorScale = d3.scaleLinear<string>()
      .domain([30, 65, 85, 100])
      .range(['#10b981', '#f59e0b', '#f97316', '#ef4444']);

    // Definitions: Gradients for halos
    const defs = svg.append('defs');

    // Filter for glowing effect
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // India simplified geographic backdrop contours
    const mapGroup = svg.append('g').attr('class', 'geographic-mesh');

    // Stylized India boundary representation polygons / guide nodes
    const subcontinentPoints: [number, number][] = [
      [74.5, 33.2], // Kashmir
      [77.5, 31.8], // Himachal
      [80.3, 29.8], // Uttarakhand
      [88.2, 27.3], // Sikkim
      [90.1, 26.2], // Assam / NE
      [88.8, 22.2], // Bengal Delta
      [85.8, 19.8], // Odisha coast
      [80.3, 13.1], // Chennai coast
      [77.5, 8.1],  // Kanyakumari
      [76.2, 9.9],  // Kerala coast
      [73.8, 15.3], // Goa coast
      [72.8, 19.0], // Mumbai coast
      [69.0, 22.5], // Gujarat Saurashtra
      [70.5, 24.5], // Rann of Kutch
      [71.2, 28.5], // Rajasthan West
      [74.5, 33.2], // Close loop
    ];

    const lineGenerator = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveCardinalClosed.tension(0.4));

    // Draw territorial zone background
    mapGroup.append('path')
      .datum(subcontinentPoints)
      .attr('d', lineGenerator)
      .attr('fill', '#090d16')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '3 3');

    // Coordinate grid lat/long guide lines
    const gridLines = [
      [[68.5, 28], [90.5, 28]],
      [[68.5, 20], [90.5, 20]],
      [[68.5, 12], [90.5, 12]],
      [[74, 33.5], [74, 8.5]],
      [[82, 33.5], [82, 8.5]],
    ];
    gridLines.forEach(([start, end]) => {
      mapGroup.append('line')
        .attr('x1', xScale(start[0]))
        .attr('y1', yScale(start[1]))
        .attr('x2', xScale(end[0]))
        .attr('y2', yScale(end[1]))
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 0.6)
        .attr('stroke-opacity', 0.5);
    });

    // Fraud Syndicate Money Mule Transit Vectors (Dashed high-risk transfer lines)
    const transitVectors = [
      { from: [86.8, 23.95], to: [72.87, 19.07], label: 'Jamtara ➔ Mumbai Mule Accounts' },
      { from: [77.1, 27.5], to: [77.2, 28.61], label: 'Mewat ➔ Delhi Video Extortion' },
      { from: [72.57, 23.02], to: [77.59, 12.97], label: 'Gujarat ➔ Bengaluru Crypto Tasks' },
      { from: [85.13, 25.59], to: [78.48, 17.38], label: 'Patna ➔ Hyderabad Loan Rings' }
    ];

    transitVectors.forEach((v) => {
      const x1 = xScale(v.from[0]);
      const y1 = yScale(v.from[1]);
      const x2 = xScale(v.to[0]);
      const y2 = yScale(v.to[1]);

      // Path with curve
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;

      mapGroup.append('path')
        .attr('d', `M${x1},${y1}A${dr},${dr} 0 0,1 ${x2},${y2}`)
        .attr('fill', 'none')
        .attr('stroke', '#f43f5e')
        .attr('stroke-width', 1.2)
        .attr('stroke-opacity', 0.35)
        .attr('stroke-dasharray', '4 4');
    });

    // Create Radial Gradients for each hotspot
    displayedHotspots.forEach((hs) => {
      const gradId = `heat-grad-${hs.id}`;
      const baseColor = colorScale(hs.currentIntensity);

      const radGrad = defs.append('radialGradient')
        .attr('id', gradId)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      radGrad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.85);

      radGrad.append('stop')
        .attr('offset', '40%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.45);

      radGrad.append('stop')
        .attr('offset', '75%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0.15);

      radGrad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', baseColor)
        .attr('stop-opacity', 0);
    });

    // Halo & Heatmap Density Layer
    const haloGroup = svg.append('g').attr('class', 'heat-halos');

    displayedHotspots.forEach((hs) => {
      const cx = xScale(hs.lng);
      const cy = yScale(hs.lat);
      const radius = 22 + (hs.currentIntensity / 100) * 34;

      // Outer Heat Halo with blending
      haloGroup.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', radius)
        .attr('fill', `url(#heat-grad-${hs.id})`)
        .style('mix-blend-mode', 'screen')
        .style('pointer-events', 'none');

      // Animated live pulse ring for critical hotspots
      if (hs.currentIntensity >= 80) {
        const pulseRing = haloGroup.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 8)
          .attr('fill', 'none')
          .attr('stroke', colorScale(hs.currentIntensity))
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.8)
          .style('pointer-events', 'none');

        // Infinite pulsation
        function animatePulse() {
          pulseRing
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('r', radius * 0.9)
            .attr('stroke-opacity', 0)
            .on('end', () => {
              pulseRing.attr('r', 8).attr('stroke-opacity', 0.8);
              animatePulse();
            });
        }
        animatePulse();
      }
    });

    // Interactive Nodes & Labels Layer
    const nodesGroup = svg.append('g').attr('class', 'hotspot-nodes');

    displayedHotspots.forEach((hs) => {
      const cx = xScale(hs.lng);
      const cy = yScale(hs.lat);
      const isSelected = selectedHotspot?.id === hs.id;
      const nodeColor = colorScale(hs.currentIntensity);

      const nodeG = nodesGroup.append('g')
        .attr('class', 'node')
        .attr('cursor', 'pointer')
        .on('click', () => {
          setSelectedHotspot(hs);
        });

      // Target hit area for mobile touch
      nodeG.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 20)
        .attr('fill', 'transparent');

      // Selection indicator ring
      if (isSelected) {
        nodeG.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 14)
          .attr('fill', 'none')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('filter', 'url(#glow)');
      }

      // Center Pin Dot
      nodeG.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', isSelected ? 6.5 : 5)
        .attr('fill', nodeColor)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.5);

      // Micro Label (Name abbreviation / State)
      const labelText = hs.name.split(' ')[0].replace(/[^a-zA-Z]/g, '');
      nodeG.append('text')
        .attr('x', cx + 7)
        .attr('y', cy + 3)
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .attr('fill', isSelected ? '#ffffff' : '#cbd5e1')
        .attr('stroke', '#020617')
        .attr('stroke-width', 2)
        .attr('paint-order', 'stroke')
        .text(labelText);
    });

  }, [displayedHotspots, selectedHotspot, viewMode]);

  // D3 Heat Matrix Grid Rendering
  useEffect(() => {
    if (viewMode !== 'matrix' || !matrixSvgRef.current) return;

    const svg = d3.select(matrixSvgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 15, bottom: 20, left: 110 };
    const width = 390;
    const height = hotspots.length * 32 + margin.top + margin.bottom;

    const categories = [
      { key: 'digitalArrest', label: 'Digital Arrest' },
      { key: 'apkTrojan', label: 'APK Trojan' },
      { key: 'electricityBill', label: 'Power SMS' },
      { key: 'telegramTask', label: 'Telegram Task' },
      { key: 'upiPhishing', label: 'UPI QR' },
    ];

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .domain(categories.map(c => c.key))
      .padding(0.12);

    const y = d3.scaleBand()
      .range([margin.top, height - margin.bottom])
      .domain(hotspots.map(d => d.id))
      .padding(0.12);

    const matrixColorScale = d3.scaleSequential()
      .interpolator(d3.interpolateYlOrRd)
      .domain([0, 50]);

    // Column Headers
    categories.forEach(cat => {
      svg.append('text')
        .attr('x', (x(cat.key) || 0) + x.bandwidth() / 2)
        .attr('y', margin.top - 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', '#94a3b8')
        .text(cat.label);
    });

    // Row Headers & Matrix Cells
    hotspots.forEach(hs => {
      const rowY = y(hs.id) || 0;

      // Hotspot Label
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', rowY + y.bandwidth() / 2 + 3)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-weight', selectedHotspot?.id === hs.id ? 'bold' : 'normal')
        .attr('fill', selectedHotspot?.id === hs.id ? '#ffffff' : '#cbd5e1')
        .text(hs.name.split('(')[0].trim().slice(0, 14));

      // Cells
      categories.forEach(cat => {
        const value = hs.categoryBreakdown[cat.key as keyof typeof hs.categoryBreakdown];
        const cellX = x(cat.key) || 0;

        const cell = svg.append('g')
          .attr('cursor', 'pointer')
          .on('click', () => setSelectedHotspot(hs));

        cell.append('rect')
          .attr('x', cellX)
          .attr('y', rowY)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .attr('rx', 4)
          .attr('fill', matrixColorScale(value))
          .attr('stroke', selectedHotspot?.id === hs.id ? '#ffffff' : '#1e293b')
          .attr('stroke-width', selectedHotspot?.id === hs.id ? 1.5 : 0.5);

        cell.append('text')
          .attr('x', cellX + x.bandwidth() / 2)
          .attr('y', rowY + y.bandwidth() / 2 + 3)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('font-weight', 'bold')
          .attr('fill', value > 25 ? '#ffffff' : '#0f172a')
          .text(`${value}%`);
      });
    });

  }, [hotspots, viewMode, selectedHotspot]);

  // Handle reporting incident to increment heatmap
  const handleReportHotspotIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportCity.trim() && !reportHotspotId) return;

    setHotspots(prev => {
      return prev.map(hs => {
        if (hs.id === reportHotspotId) {
          const updatedBreakdown = { ...hs.categoryBreakdown };
          updatedBreakdown[reportCategory] = Math.min(100, updatedBreakdown[reportCategory] + 4);

          return {
            ...hs,
            reportCount: hs.reportCount + 1,
            intensity: Math.min(100, hs.intensity + 2),
            lastReported: 'Just now',
            spikePercentage: hs.spikePercentage + 1,
            categoryBreakdown: updatedBreakdown,
          };
        }
        return hs;
      });
    });

    setReportSuccess(true);
    setIsReportModalOpen(false);
    setReportCity('');
    setReportDetails('');
    setTimeout(() => setReportSuccess(false), 4000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white shadow-xl space-y-4">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600/30 border border-rose-500/50 flex items-center justify-center">
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              Regional Threat Heatmap
            </h2>
            <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              LIVE D3.JS
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Real-time geospatial hotspot density mapped from {totalReports.toLocaleString()} verified citizen reports & I4C intelligence.
          </p>
        </div>

        {/* Action button to report incident */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Hotspot Activity</span>
        </button>
      </div>

      {reportSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Incident report successfully logged! Regional heatmap density and threat indices recalculated in real time.</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <p className="text-[10px] text-slate-400 font-medium">Logged Reports</p>
          <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-0.5">
            {totalReports.toLocaleString()}
          </p>
          <span className="text-[9px] text-emerald-400 font-semibold flex items-center justify-center gap-0.5">
            <Activity className="w-2.5 h-2.5" /> Verified Citizen Feed
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <p className="text-[10px] text-slate-400 font-medium">Highest Severity Zone</p>
          <p className="text-xs sm:text-sm font-bold text-rose-400 truncate mt-0.5" title={highestRiskZone.name}>
            {highestRiskZone.name.split(' ')[0]}
          </p>
          <span className="text-[9px] text-rose-300 font-semibold font-mono">
            Index: {highestRiskZone.intensity}/100
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <p className="text-[10px] text-slate-400 font-medium">Top Fraud Vector</p>
          <p className="text-xs sm:text-sm font-bold text-amber-300 truncate mt-0.5">
            Digital Arrest
          </p>
          <span className="text-[9px] text-amber-400 font-semibold">
            +28% Spike This Week
          </span>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        {/* Scam Vector Filter */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Scams' },
            { id: 'digitalArrest', label: 'Digital Arrest' },
            { id: 'apkTrojan', label: 'APK Trojans' },
            { id: 'electricityBill', label: 'Power SMS' },
            { id: 'telegramTask', label: 'Telegram' },
            { id: 'upiPhishing', label: 'UPI QR' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle: Map vs Matrix */}
        <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700 shrink-0">
          <button
            onClick={() => setViewMode('map')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3 h-3" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Heat Matrix</span>
          </button>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-2 min-h-[460px]">
        {viewMode === 'map' ? (
          <>
            <svg
              ref={svgRef}
              viewBox="0 0 390 450"
              className="w-full max-w-[390px] h-[450px] touch-manipulation select-none"
            />
            {/* Map Legend Overlay */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-[9px] text-slate-300">
              <span className="font-bold text-white mb-0.5">Threat Intensity</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Low (&lt;60)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Moderate (60-75)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span>High (76-88)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Critical (89+)</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 text-[9px] text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
              Tap pin to inspect hotspot
            </div>
          </>
        ) : (
          <div className="w-full overflow-x-auto no-scrollbar">
            <svg
              ref={matrixSvgRef}
              viewBox={`0 0 390 ${hotspots.length * 32 + 60}`}
              className="w-full min-w-[360px] h-auto select-none"
            />
          </div>
        )}
      </div>

      {/* Selected Hotspot Detailed Breakdown Panel */}
      {selectedHotspot && (
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-indigo-500/50 shadow-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  selectedHotspot.severity === 'Critical'
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                    : 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                }`}>
                  {selectedHotspot.severity} Threat Zone
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Reported {selectedHotspot.lastReported}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{selectedHotspot.name}</span>
              </h3>
            </div>

            <button
              onClick={() => setSelectedHotspot(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
              <span className="text-[10px] text-slate-400">Total Citizen Reports</span>
              <p className="text-sm font-mono font-bold text-white mt-0.5">
                {selectedHotspot.reportCount.toLocaleString()} incidents
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60">
              <span className="text-[10px] text-slate-400">Weekly Surge</span>
              <p className="text-sm font-mono font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +{selectedHotspot.spikePercentage}% this week
              </p>
            </div>
          </div>

          {/* Trending Vector & Modus */}
          <div className="space-y-1.5 text-xs">
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-0.5">
                Predominant Modus Operandi & Trap
              </p>
              <p className="text-xs text-white leading-relaxed">
                {selectedHotspot.syndicateModus}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300 px-1">
              <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span><strong>Primary Target:</strong> {selectedHotspot.targetProfile}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
            <button
              onClick={() => {
                setReportHotspotId(selectedHotspot.id);
                setIsReportModalOpen(true);
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>+ Log Incident in {selectedHotspot.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={onOpenSos}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-950/40 cursor-pointer transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Emergency 1930 Helpline</span>
            </button>
          </div>
        </div>
      )}

      {/* Hotspot Leaderboard Rank List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">Live Regional Cyber Fraud Hotspots</span>
          <span>Ranked by Report Density</span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pr-0.5">
          {hotspots.map((hs, index) => {
            const isSelected = selectedHotspot?.id === hs.id;
            return (
              <div
                key={hs.id}
                onClick={() => setSelectedHotspot(hs)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-400 shadow-md'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                    index === 0 ? 'bg-rose-600 text-white' : index === 1 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {hs.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {hs.trendingVector}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {hs.reportCount.toLocaleString()}
                    </p>
                    <span className="text-[9px] text-rose-400 font-mono font-semibold">
                      +{hs.spikePercentage}%
                    </span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    hs.intensity >= 90 ? 'bg-rose-500 animate-ping' : hs.intensity >= 80 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Incident Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-5 text-white max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Report Hotspot Activity</h3>
                  <p className="text-[10px] text-slate-400">Updates live D3 heatmap intelligence</p>
                </div>
              </div>

              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportHotspotIncident} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Select Hotspot Region *</label>
                <select
                  value={reportHotspotId}
                  onChange={(e) => setReportHotspotId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {hotspots.map(hs => (
                    <option key={hs.id} value={hs.id}>
                      {hs.name} (Index: {hs.intensity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Specific City / Neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Gurugram Cyber City, Deoghar Rural, Whitefield..."
                  value={reportCity}
                  onChange={(e) => setReportCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Primary Fraud Category *</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as typeof reportCategory)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="digitalArrest">Digital Arrest / Fake Supreme Court Skype Video</option>
                  <option value="apkTrojan">Malicious APK Trojan (WhatsApp Forward)</option>
                  <option value="electricityBill">Electricity Bill Power Cutoff SMS</option>
                  <option value="telegramTask">Part-time YouTube / Telegram Task Escrow</option>
                  <option value="upiPhishing">UPI QR Code Spoofing / OLX Overpayment</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Brief Incident Narrative *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="How did they approach? (Phone number, fake portal link, fake badge...)"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 font-bold text-white rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Submit & Update Heatmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
