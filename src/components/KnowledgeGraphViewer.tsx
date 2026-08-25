import React, { useState } from 'react';
import { Network, Sparkles, Filter, ChevronRight, Eye, Layers } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'dimension' | 'metric' | 'entity' | 'datetime';
  color: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  weight: number; // 0.1 to 1.0
}

interface KnowledgeGraphViewerProps {
  reportTables?: any[];
}

export const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>('Revenue');
  const [activeFilter, setActiveFilter] = useState<'all' | 'metrics' | 'dimensions'>('all');

  const nodes: GraphNode[] = [
    { id: 'Customer', label: 'Customer ID', type: 'entity', color: '#8B5CF6', x: 80, y: 150 },
    { id: 'Orders', label: 'Order Records', type: 'dimension', color: '#3B82F6', x: 230, y: 90 },
    { id: 'Product', label: 'Product Category', type: 'dimension', color: '#8B5CF6', x: 230, y: 220 },
    { id: 'Revenue', label: 'Total Revenue', type: 'metric', color: '#14F1D9', x: 400, y: 110 },
    { id: 'Discount', label: 'Discount %', type: 'metric', color: '#F59E0B', x: 380, y: 240 },
    { id: 'Region', label: 'Geographic Region', type: 'dimension', color: '#8B5CF6', x: 550, y: 60 },
    { id: 'Profit', label: 'Net Profit Margin', type: 'metric', color: '#14F1D9', x: 570, y: 170 },
    { id: 'Time', label: 'Transaction Date', type: 'datetime', color: '#EC4899', x: 230, y: 310 },
  ];

  const edges: GraphEdge[] = [
    { from: 'Customer', to: 'Orders', label: 'places (1:N)', weight: 0.92 },
    { from: 'Customer', to: 'Product', label: 'prefers', weight: 0.65 },
    { from: 'Orders', to: 'Revenue', label: 'generates', weight: 0.98 },
    { from: 'Product', to: 'Revenue', label: 'drives', weight: 0.88 },
    { from: 'Product', to: 'Discount', label: 'impacts', weight: 0.74 },
    { from: 'Revenue', to: 'Profit', label: 'yields (r=0.94)', weight: 0.94 },
    { from: 'Discount', to: 'Profit', label: 'erodes (r=-0.61)', weight: 0.61 },
    { from: 'Revenue', to: 'Region', label: 'aggregated by', weight: 0.81 },
    { from: 'Time', to: 'Revenue', label: 'seasonality', weight: 0.79 },
  ];

  const filteredNodes = nodes.filter((n) => {
    if (activeFilter === 'metrics') return n.type === 'metric';
    if (activeFilter === 'dimensions') return n.type === 'dimension' || n.type === 'entity';
    return true;
  });

  const selectedNodeObj = nodes.find((n) => n.id === selectedNode);
  const connectedEdges = edges.filter(
    (e) => e.from === selectedNode || e.to === selectedNode
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-6 shadow-2xl text-[#F8FAFC] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-teal-400 text-white shadow-lg shadow-purple-500/20">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-white">Dataset Knowledge Graph</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                Entity Topology Map
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive relationship mapping connecting entities, measures, and cross-column dependencies
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              activeFilter === 'all' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setActiveFilter('metrics')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              activeFilter === 'metrics' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveFilter('dimensions')}
            className={`px-3 py-1 rounded-lg transition cursor-pointer ${
              activeFilter === 'dimensions' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dimensions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Canvas Map */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-slate-950/70 p-4 relative overflow-hidden min-h-[340px] flex items-center justify-center">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#14F1D9 1px, transparent 1px), linear-gradient(90deg, #14F1D9 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />

          <svg className="w-full h-[320px] overflow-visible">
            {/* Render Edges */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isConnected = selectedNode === edge.from || selectedNode === edge.to;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isConnected ? '#14F1D9' : '#334155'}
                    strokeWidth={isConnected ? 2.5 : 1.5}
                    strokeDasharray={isConnected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                  />
                  {/* Midpoint Label */}
                  {isConnected && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 6}
                      fill="#14F1D9"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono font-bold"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulse Halo if selected */}
                  {isSelected && (
                    <circle
                      r="26"
                      fill="none"
                      stroke={node.color}
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}
                  {/* Node Circle */}
                  <circle
                    r="18"
                    fill={node.color}
                    fillOpacity={isSelected ? 0.95 : 0.75}
                    stroke="#020617"
                    strokeWidth="3"
                    className="transition-all duration-200 group-hover:scale-110"
                  />
                  {/* Inner Icon indicator */}
                  <text
                    x="0"
                    y="4"
                    fill="#020617"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono pointer-events-none"
                  >
                    {node.id.substring(0, 2).toUpperCase()}
                  </text>
                  {/* Label Text */}
                  <text
                    x="0"
                    y="32"
                    fill={isSelected ? '#14F1D9' : '#F8FAFC'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="font-sans pointer-events-none drop-shadow"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Relationship Detail Panel */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
              Entity Inspector
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Click any node
            </span>
          </div>

          {selectedNodeObj ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedNodeObj.color }}
                  />
                  <h4 className="font-heading font-bold text-base text-white">
                    {selectedNodeObj.label}
                  </h4>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Archetype: <span className="text-slate-200 capitalize">{selectedNodeObj.type}</span>
                </div>
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300">
                  Active Connections ({connectedEdges.length})
                </span>
                <div className="space-y-1.5">
                  {connectedEdges.map((edge, idx) => {
                    const otherNodeId = edge.from === selectedNode ? edge.to : edge.from;
                    const otherNode = nodes.find((n) => n.id === otherNodeId);
                    return (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-800/80 border border-white/5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          <ChevronRight className="h-3 w-3 text-teal-400" />
                          <span>{otherNode?.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                          {edge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 font-mono">
              Select a node in the Knowledge Graph to inspect relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
