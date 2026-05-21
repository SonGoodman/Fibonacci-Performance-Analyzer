#!/bin/bash
# Quick Start Guide for Fibonacci Performance Visualizer

echo "🚀 Fibonacci Performance Visualizer - Quick Start"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "Starting development server..."
echo "🌐 Open http://localhost:3000 in your browser"
echo ""

npm run dev
