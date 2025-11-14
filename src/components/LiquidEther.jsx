import React, { useEffect, useRef } from 'react';
import WebGLManager from '../lib/fluid/FluidSimulator';

export default function LiquidEther() {
    const canvasRef = useRef(null);
    const managerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const manager = new WebGLManager(canvas);
        manager.init();
        managerRef.current = manager;

        const onResize = () => manager.resize(canvas.clientWidth, canvas.clientHeight);
        window.addEventListener('resize', onResize);

        let raf = null;
        const loop = () => {
            manager.step();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            manager.dispose();
            managerRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}