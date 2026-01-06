'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Brush,
    Eraser,
    ZoomIn,
    ZoomOut,
    Undo2,
    Redo2,
    RotateCcw,
    Download,
    Check,
    Loader2,
    Minus,
    Plus
} from 'lucide-react';
import clsx from 'clsx';

/**
 * ImageEditor - Canvas-based manual eraser tool for marking text areas
 * 
 * @param {string} imageSrc - URL of the image to edit
 * @param {function} onSaveMask - Callback when mask is saved (receives mask data URL)
 * @param {function} onApplyEraser - Callback to apply eraser with mask
 * @param {boolean} isProcessing - Whether eraser is being processed
 */
export default function ImageEditor({
    imageSrc,
    onSaveMask,
    onApplyEraser,
    isProcessing = false
}) {
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const containerRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('brush'); // 'brush' or 'eraser'
    const [brushSize, setBrushSize] = useState(20);
    const [zoom, setZoom] = useState(1);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // Load image on mount
    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            setImageLoaded(true);

            // Initialize canvases
            const canvas = canvasRef.current;
            const maskCanvas = maskCanvasRef.current;

            if (canvas && maskCanvas) {
                canvas.width = img.width;
                canvas.height = img.height;
                maskCanvas.width = img.width;
                maskCanvas.height = img.height;

                // Draw image on main canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Initialize mask canvas (transparent)
                const maskCtx = maskCanvas.getContext('2d');
                maskCtx.clearRect(0, 0, img.width, img.height);

                // Save initial state
                saveToHistory();
            }
        };
        img.src = imageSrc;
    }, [imageSrc]);

    // Save current mask state to history
    const saveToHistory = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const maskData = maskCanvas.toDataURL('image/png');
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(maskData);

        // Limit history size
        if (newHistory.length > 50) {
            newHistory.shift();
        }

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    // Get mouse position relative to canvas
    const getMousePos = useCallback((e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }, []);

    // Drawing handlers
    const startDrawing = useCallback((e) => {
        setIsDrawing(true);
        const pos = getMousePos(e);
        draw(pos.x, pos.y);
    }, [getMousePos, tool, brushSize]);

    const draw = useCallback((x, y) => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const ctx = maskCanvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;

        if (tool === 'brush') {
            // Draw semi-transparent red for mask visualization
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        } else {
            // Eraser mode - clear the mask
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        }

        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }, [tool, brushSize]);

    const handleMouseMove = useCallback((e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        draw(pos.x, pos.y);
    }, [isDrawing, getMousePos, draw]);

    const stopDrawing = useCallback(() => {
        if (isDrawing) {
            setIsDrawing(false);
            saveToHistory();
        }
    }, [isDrawing, saveToHistory]);

    // Touch handlers for mobile
    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
        startDrawing(mouseEvent);
    }, [startDrawing]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = { clientX: touch.clientX, clientY: touch.clientY };
        handleMouseMove(mouseEvent);
    }, [handleMouseMove]);

    // Undo
    const undo = useCallback(() => {
        if (historyIndex <= 0) return;

        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);

        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas && history[newIndex]) {
            const img = new Image();
            img.onload = () => {
                const ctx = maskCanvas.getContext('2d');
                ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[newIndex];
        }
    }, [historyIndex, history]);

    // Redo
    const redo = useCallback(() => {
        if (historyIndex >= history.length - 1) return;

        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);

        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas && history[newIndex]) {
            const img = new Image();
            img.onload = () => {
                const ctx = maskCanvas.getContext('2d');
                ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[newIndex];
        }
    }, [historyIndex, history]);

    // Clear all
    const clearAll = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        if (maskCanvas) {
            const ctx = maskCanvas.getContext('2d');
            ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            saveToHistory();
        }
    }, [saveToHistory]);

    // Get mask as black/white image for LaMa
    const getMaskForLama = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return null;

        // Create a new canvas with black background and white mask
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = maskCanvas.width;
        exportCanvas.height = maskCanvas.height;
        const ctx = exportCanvas.getContext('2d');

        // Black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

        // Get mask image data
        const maskCtx = maskCanvas.getContext('2d');
        const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

        // Convert red areas to white
        for (let i = 0; i < maskData.data.length; i += 4) {
            if (maskData.data[i + 3] > 0) { // If pixel has any alpha
                maskData.data[i] = 255;     // R
                maskData.data[i + 1] = 255; // G
                maskData.data[i + 2] = 255; // B
                maskData.data[i + 3] = 255; // A
            } else {
                maskData.data[i] = 0;
                maskData.data[i + 1] = 0;
                maskData.data[i + 2] = 0;
                maskData.data[i + 3] = 255;
            }
        }

        ctx.putImageData(maskData, 0, 0);
        return exportCanvas.toDataURL('image/png');
    }, []);

    // Handle apply eraser
    const handleApplyEraser = useCallback(() => {
        const maskData = getMaskForLama();
        if (maskData && onApplyEraser) {
            onApplyEraser(maskData);
        }
    }, [getMaskForLama, onApplyEraser]);

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

    // Brush size controls
    const increaseBrushSize = () => setBrushSize(prev => Math.min(prev + 5, 100));
    const decreaseBrushSize = () => setBrushSize(prev => Math.max(prev - 5, 5));

    if (!imageSrc) {
        return (
            <div className="flex items-center justify-center h-64 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-[var(--text-tertiary)]">Pilih gambar untuk diedit</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
                {/* Tool Selection */}
                <div className="flex items-center gap-1 border-r border-[var(--border-primary)] pr-3">
                    <button
                        onClick={() => setTool('brush')}
                        className={clsx(
                            'p-2 rounded-lg transition-colors',
                            tool === 'brush'
                                ? 'bg-[var(--primary-500)] text-white'
                                : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'
                        )}
                        title="Brush - Tandai area untuk dihapus"
                    >
                        <Brush size={20} />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        className={clsx(
                            'p-2 rounded-lg transition-colors',
                            tool === 'eraser'
                                ? 'bg-[var(--primary-500)] text-white'
                                : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]'
                        )}
                        title="Eraser - Hapus marking"
                    >
                        <Eraser size={20} />
                    </button>
                </div>

                {/* Brush Size */}
                <div className="flex items-center gap-2 border-r border-[var(--border-primary)] pr-3">
                    <button
                        onClick={decreaseBrushSize}
                        className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title="Kecilkan brush"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-sm text-[var(--text-secondary)] w-12 text-center">
                        {brushSize}px
                    </span>
                    <button
                        onClick={increaseBrushSize}
                        className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title="Besarkan brush"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-1 border-r border-[var(--border-primary)] pr-3">
                    <button
                        onClick={handleZoomOut}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title="Zoom Out"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span className="text-sm text-[var(--text-tertiary)] w-12 text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                        title="Zoom In"
                    >
                        <ZoomIn size={18} />
                    </button>
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 border-r border-[var(--border-primary)] pr-3">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-50"
                        title="Undo"
                    >
                        <Undo2 size={18} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] disabled:opacity-50"
                        title="Redo"
                    >
                        <Redo2 size={18} />
                    </button>
                </div>

                {/* Clear All */}
                <button
                    onClick={clearAll}
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"
                    title="Clear All"
                >
                    <RotateCcw size={18} />
                </button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Apply Eraser Button */}
                <button
                    onClick={handleApplyEraser}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Check size={18} />
                            Apply Eraser
                        </>
                    )}
                </button>
            </div>

            {/* Canvas Container */}
            <div
                ref={containerRef}
                className="relative overflow-auto bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]"
                style={{ maxHeight: '70vh' }}
            >
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-[var(--primary-500)]" />
                    </div>
                )}

                <div
                    className="relative inline-block"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                        cursor: tool === 'brush' ? 'crosshair' : 'pointer'
                    }}
                >
                    {/* Main Image Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="block"
                        style={{ imageRendering: 'auto' }}
                    />

                    {/* Mask Canvas (overlay) */}
                    <canvas
                        ref={maskCanvasRef}
                        className="absolute top-0 left-0"
                        style={{ imageRendering: 'auto' }}
                        onMouseDown={startDrawing}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={stopDrawing}
                    />
                </div>
            </div>

            {/* Instructions */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                    <strong>Instruksi:</strong> Gunakan brush untuk menandai area text yang ingin dihapus (area merah).
                    Setelah selesai, klik "Apply Eraser" untuk menghapus text menggunakan AI.
                </p>
            </div>
        </div>
    );
}
