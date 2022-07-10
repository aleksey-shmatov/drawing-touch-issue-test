import React, { useCallback, useMemo, useRef, useState } from 'react';

const canvasWidth = 4000;
const canvasHeight = 3000;

type Point = {
    x: number;
    y: number;
}

export const getCanvasPoint = (
    svg: SVGSVGElement,
    clientX: number,
    clientY: number
) => {
    let point = svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    point = point.matrixTransform(svg.getScreenCTM()?.inverse())
    return {
        x: point.x,
        y: point.y,
    }
}

const Polyline = ({points}: {points: Point[]}) => {
    const pathData = useMemo(() => {
        return points.map((p) => `${p.x},${p.y}`).join(' ')
    }, [points])
    return <polyline fill='none' strokeWidth={2}  points={pathData} stroke='#666666'/>;
}


export const Canvas = () => {
    const canvasRef = useRef<SVGSVGElement>(null)

    const [strokes, setStrokes] = useState<Point[][]>([])
    const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null)

    const handlePointerDown = useCallback(
        (event: React.MouseEvent) => {
            const start = getCanvasPoint(
                canvasRef.current,
                event.clientX,
                event.clientY
            )
            setCurrentStroke([start])
            const handlePointerMove = (event: MouseEvent) => {
                const point = getCanvasPoint(
                    canvasRef.current,
                    event.clientX,
                    event.clientY
                )
                setCurrentStroke(x => [...x, point])
            }
            const handlePointerUp = () => {
                setCurrentStroke(x => {
                    setStrokes(strokes => [...strokes, x])
                    return null;
                })
                document.removeEventListener(
                    'pointermove',
                    handlePointerMove
                )
                document.removeEventListener('pointerup', handlePointerUp)
                document.removeEventListener(
                    'pointercancel',
                    handlePointerUp
                )
            }
            document.addEventListener('pointermove', handlePointerMove)
            document.addEventListener('pointerup', handlePointerUp)
            document.addEventListener('pointercancel', handlePointerUp)
        },
        []
    )

    return <svg
    className="main-canvas"
    width={canvasWidth}
    height={canvasHeight}
    ref={canvasRef}
    onPointerDown={handlePointerDown}
    >
        {strokes.map((x, i) =>  <Polyline points={x} key={i} />)}
        {currentStroke ? <Polyline  points={currentStroke}/> : null}
    </svg>
}
