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
                    <div className="h-7 text-lg font-semibold">
                        {started && (
                            <>
                                Found: {score}/50, Remaining: 50, Time: <span className={timer <= 10 ? 'text-red-600' : ''}>{formatTime(timer)}</span>
                                {finished && <span className="font-bold text-green-700">Game Over!</span>}
                            </>
                        )}
                    </div>
                </div>
                <div>
                    {!started ? (
                        <button
                            className="flex h-10 w-18 items-center justify-center rounded-lg bg-black font-light text-white hover:cursor-pointer hover:opacity-80"
                            onClick={startGame}
                        >
                            Start
                        </button>
                    ) : (
                        <button
                            className="flex h-10 w-18 items-center justify-center rounded-lg border-2 font-light hover:cursor-pointer hover:underline hover:opacity-80"
                            onClick={resetGame}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
                {started && !finished && currentState && (
                    <div className="absolute w-full text-center text-2xl font-semibold tracking-tight">
                        Find: <span className="text-4xl underline">{currentState}</span>
                    </div>
                )}
                <Map />
            </div>
        </main>
    )
}
