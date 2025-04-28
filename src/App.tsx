import { useEffect } from 'react'

import Map from './Map'
import { useGameStore } from './lib/store'
import { formatTime } from './lib/utils'

export default function App() {
    const { started, finished, timer, score, currentState, tick, startGame, resetGame } = useGameStore()

    useEffect(() => {
        if (!started || finished) {
            return
        }
        const id = setInterval(() => tick(), 1000)
        return () => clearInterval(id)
    }, [started, finished, tick])

    return (
        <main className="absolute inset-0 flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h1 className="text-6xl font-bold tracking-tight">US States Quiz</h1>
                    <div className="h-7 text-sm">
                        <span className="font-mono text-lg">
                            Time: <span className={timer <= 10 ? 'text-red-600' : ''}>{formatTime(timer)}</span>
                        </span>{' '}
                        <span className="font-mono text-lg">Score: {score}/50</span>
                        {finished && <span className="ml-4 text-xl font-bold text-green-700">Game Over!</span>}
                    </div>
                </div>
                <div>
                    {!started ? (
                        <button
                            className="flex h-10 items-center rounded-lg bg-black px-4 text-white hover:cursor-pointer hover:opacity-90"
                            onClick={startGame}
                        >
                            Start
                        </button>
                    ) : (
                        <button className="flex h-10 items-center rounded-lg border-2 px-4 hover:cursor-pointer hover:opacity-90" onClick={resetGame}>
                            Reset
                        </button>
                    )}
                </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
                {started && !finished && currentState && (
                    <div className="absolute w-full text-center text-3xl font-semibold tracking-tight">
                        Find: <span className="text-4xl underline">{currentState}</span>
                    </div>
                )}
                <Map />
            </div>
        </main>
    )
}
