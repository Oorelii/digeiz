import './App.css'
import React, { useEffect, useRef, useState } from 'react'
import data from './data.json'

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function App() {
    const canvasRef = useRef()

    const [lines, setLines] = useState([])

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        for (const person of data) {
            if (lines.includes(person.id)) {
                ctx.beginPath()
                for (const [index, point] of person.points.entries()) {
                    if (index === 0) {
                        ctx.moveTo(point.x * 40, point.y * 40)
                    } else {
                        ctx.lineTo(point.x * 40, point.y * 40)
                        ctx.strokeStyle = getRandomColor()
                        ctx.lineWidth = 5
                    }
                }
                ctx.stroke()
            }
        }
    }, [lines])

    return (
        <div className="App">
            {data.map((person) => {
                const idx = lines.findIndex((l) => {
                    if (l === person.id) return true
                    return false
                })
                return (
                    <button
                        key={'display-' + person.id}
                        onClick={(e) => {
                            e.preventDefault()
                            const newLines = [...lines]
                            if (idx === -1) {
                                newLines.push(person.id)
                            } else {
                                newLines.splice(idx, 1)
                            }
                            setLines(newLines)
                        }}
                    >
                        {person.id}
                    </button>
                )
            })}
            <div>
                <canvas
                    ref={canvasRef}
                    width="500"
                    height="500"
                    style={{ background: '#F2F2F2' }}
                ></canvas>
            </div>
            {data
                .filter((person) => {
                    const idx = lines.findIndex((l) => {
                        if (l === person.id) return true
                        return false
                    })
                    return idx !== -1
                })
                .map((person) => {
                    const totalPoints = person.points.reduce(
                        (previous, currentValue) => {
                            return {
                                time: previous.time + currentValue.time,
                                x: previous.x + currentValue.x,
                                y: previous.y + currentValue.y
                            }
                        },
                        { time: 0, x: 0, y: 0 }
                    )
                    return (
                        <div>
                            <h3>person: {person.id}</h3>
                            <p>time id: {totalPoints.time} ms</p>
                            <p>total x: {totalPoints.x}</p>
                            <p>total y: {totalPoints.y}</p>
                        </div>
                    )
                })}
        </div>
    )
}
export default App
