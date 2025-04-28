import ElapsedTime from './ElapsedTime'
import Map from './Map'
import { useGameStore } from './lib/store'

export default function App() {
    const { started, finished, current, answered, startGame, resetGame } = useGameStore()
    const answeredCount = Object.values(answered).length

    return (
        <main className="absolute inset-0 flex flex-col gap-6 p-6 select-none">
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h1 className="text-6xl font-bold tracking-tight">US States Quiz</h1>
                    <div className="h-7 font-mono text-lg font-semibold">
                        {started && !finished && (
                            <>
                                Found: {answeredCount < 10 && <span className="opacity-0">0</span>}
                                {Object.values(answered).filter((value) => value === 'correct').length}/50, Remaining:{' '}
                                {50 - answeredCount < 10 && <span className="opacity-0">0</span>}
                                {50 - answeredCount}, Time: <ElapsedTime />
                            </>
                        )}
                    </div>
                </div>
                <div>
                    {!started ? (
                        <button
                            className="flex h-10 w-18 items-center justify-center rounded-lg bg-black text-white hover:cursor-pointer hover:opacity-80"
                            onClick={startGame}
                        >
                            Start
                        </button>
                    ) : (
                        <button
                            className="flex h-10 w-18 items-center justify-center rounded-lg border-2 hover:cursor-pointer hover:underline hover:opacity-80"
                            onClick={resetGame}
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
            <div className="relative flex-1 overflow-hidden">
                {started && !finished && current && (
                    <div className="absolute w-full text-center text-2xl font-semibold tracking-tight">
                        Find: <span className="text-4xl underline">{current}</span>
                    </div>
                )}
                <Map />
            </div>
            {finished && (
                <div className="fixed inset-0 flex items-center justify-center bg-zinc-950/80 text-white">
                    <div className="flex flex-col items-start gap-4 rounded-lg p-6">
                        <h2 className="f text-4xl font-semibold">Results:</h2>
                        <div className="text-6xl font-bold">
                            Found: {Object.values(answered).filter((value) => value === 'correct').length}/50, Time: <ElapsedTime />
                        </div>
                        <button className="hover:cursor-pointer hover:underline" onClick={resetGame}>
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
