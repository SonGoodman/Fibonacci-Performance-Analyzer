'use client';

import { useAlgorithm } from '@/app/context/AlgorithmContext';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  id: string;
  value: number;
  children: TreeNode[];
}

function generateRecursionTree(n: number, depth = 0, maxDepth = 8): TreeNode {
  const id = `${n}-${depth}`;
  if (depth > maxDepth || n < 0) {
    return { id, value: n, children: [] };
  }
  if (n <= 1) {
    return { id, value: n, children: [] };
  }
  return {
    id,
    value: n,
    children: [
      generateRecursionTree(n - 1, depth + 1, maxDepth),
      generateRecursionTree(n - 2, depth + 1, maxDepth),
    ],
  };
}

export function RecursionTreeVisualization() {
  const { recursionResult, n, isRunningRecursion } = useAlgorithm();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef<any>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!recursionResult || !containerRef.current) return;

    const vizN = Math.min(n, 15);
    const tree = generateRecursionTree(vizN, 0, 10);

    // Fixed dimensions and spacing for readability
    const width = 1200;
    const height = 600;
    const nodeRadius = 24;
    const nodeSpacing = 100;
    const levelHeight = 120;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll('svg').remove();

    // Create SVG
    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add dark background
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', '#0f172a');

    // Create main group for zoom
    const mainGroup = svg.append('g').attr('class', 'main-group');

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>().nodeSize([nodeSpacing, levelHeight]);

    const root = d3.hierarchy(tree);
    const treeData = treeLayout(root);

    // Find the root node for reset focus
    const rootNode = treeData.descendants()[0] as any;

    // Center the tree
    const bounds = treeData.descendants().reduce(
      (acc, node: any) => ({
        minX: Math.min(acc.minX, node.x),
        maxX: Math.max(acc.maxX, node.x),
        minY: Math.min(acc.minY, node.y),
        maxY: Math.max(acc.maxY, node.y),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    const centerX = (width - (bounds.maxX - bounds.minX)) / 2 - bounds.minX;
    const centerY = (height - (bounds.maxY - bounds.minY)) / 2 - bounds.minY;

    const contentGroup = mainGroup
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`)
      .attr('class', 'content-group');

    // Draw links
    contentGroup
      .selectAll('line')
      .data(treeData.links())
      .enter()
      .append('line')
      .attr('x1', (d) => (d.source as any).x)
      .attr('y1', (d) => (d.source as any).y)
      .attr('x2', (d) => (d.target as any).x)
      .attr('y2', (d) => (d.target as any).y)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2);

    // Draw nodes
    contentGroup
      .selectAll('circle')
      .data(treeData.descendants())
      .enter()
      .append('circle')
      .attr('cx', (d) => (d as any).x)
      .attr('cy', (d) => (d as any).y)
      .attr('r', nodeRadius)
      .attr('fill', (d) => (d.data.value <= 1 ? '#10b981' : '#3b82f6'))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2);

    // Draw labels
    contentGroup
      .selectAll('text')
      .data(treeData.descendants())
      .enter()
      .append('text')
      .attr('x', (d) => (d as any).x)
      .attr('y', (d) => (d as any).y)
      .attr('dy', '.3em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text((d) => d.data.value);

    // Setup zoom behavior with wheel event prevention
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
        setIsZoomed(event.transform.k !== 1 || event.transform.x !== 0 || event.transform.y !== 0);
      });

    zoomRef.current = {
      zoom,
      svg: svg.node() as SVGSVGElement,
      rootNode,
      centerX,
      centerY,
      width,
      height,
    };

    svg.call(zoom);

    // Prevent scroll from scrolling page when over SVG
    svg.on('wheel', function (event) {
      event.preventDefault();
    });

    // Auto-fit initial view
    const scale = Math.min(width / 1200, height / 600, 1);
    svg.call(zoom.transform as any, d3.zoomIdentity.translate(0, 0).scale(scale));
  }, [recursionResult, n]);

  const handleResetZoom = () => {
    if (!zoomRef.current) return;
    const { zoom, svg, rootNode, centerX, centerY, width, height } = zoomRef.current;

    // Focus on root node at top
    const targetX = rootNode.x + centerX;
    const targetY = rootNode.y + centerY;

    // Calculate zoom to nicely frame the root node
    const padding = 100;
    const scale = Math.min((width - padding) / 200, (height - padding) / 200, 1.5);

    // Center on root node
    const tx = width / 2 - targetX * scale;
    const ty = height / 4 - targetY * scale;

    d3.select(svg)
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity.translate(tx, ty).scale(scale)
      );

    setIsZoomed(false);
  };

  if (isRunningRecursion) {
    return (
      <div className="recursion-tree-container flex items-center justify-center">
        <p className="text-slate-500">Computing recursion tree...</p>
      </div>
    );
  }

  if (!recursionResult) {
    return (
      <div className="recursion-tree-container flex items-center justify-center">
        <p className="text-slate-500">Run recursion algorithm to see tree visualization</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">Recursion Call Tree (Fib({n}))</h3>
        {isZoomed && (
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reset View
          </button>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-3">
        Light gray: recursive calls | Dark gray: base cases. Scroll to zoom, drag to pan.
      </p>
      <div
        ref={containerRef}
        className="recursion-tree-container"
        style={{
          border: '1px solid #334155',
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%',
          height: '400px',
          backgroundColor: '#0f172a',
        }}
      />
    </div>
  );
}
