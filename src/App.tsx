import Map from './Map'

export default function App() {
    return (
        <main className="absolute inset-0 flex flex-col gap-6 p-6">
            <h1 className="text-4xl font-bold tracking-tight">US States Quiz</h1>
            <div className="flex-1 overflow-hidden">
                <Map />
            </div>
        </main>
    )
}
