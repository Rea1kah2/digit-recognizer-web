import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Canvas = forwardRef(({ onDrawStart }, ref) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // setup canvas saat pertama kali component render
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
    }, []);

    // Helper -> konversi koordinat mouse ke koordinat canvas
    const getPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    };

    const startDraw = (e) => {
        e.preventDefault();
        isDrawing.current = true;
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.beginPath();
        ctx.moveTo(x, y);

        if(!hasDrawn){
            setHasDrawn(true);
            onDrawStart?.();
        }
    };

    const draw = (e) => {
        if(!isDrawing.current) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const {x, y} = getPos(e);
        ctx.lineTo(x,y);
        ctx.stroke();
    };

    const stopDraw = (e) => {
        isDrawing.current = false;
        canvasRef.current.getContext('2d').beginPath();
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    // Expose clear method to parent component
    useImperativeHandle(ref, () => ({
        clear,
        hasDrawn: () => hasDrawn,
        getImageData: () => {
            const canvas = canvasRef.current;

            // composite diatas background putih
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            tempCtx.fillStyle = 'white';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);

            return tempCanvas.toDataURL('image/png');
        },
    }));

    return (
        <div className='canvas-wrapper'>
            <canvas 
                ref={canvasRef}
                width={280} 
                height={280}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
            />
            {!hasDrawn && (
                <div className='canvas-hint'>Mulai gambar disini!</div>
            )}
        </div>
    );
});

export default Canvas;