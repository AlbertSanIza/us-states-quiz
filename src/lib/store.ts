import { create } from 'zustand'

type AnswerStatus = 'correct' | 'incorrect'

const US_STATES = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
]

function getRandomState(remaining: string[]) {
    return remaining[Math.floor(Math.random() * remaining.length)]
}

export const useGameStore = create<{
    started: boolean
    finished: boolean
    current: string | null
    answered: Record<string, AnswerStatus>
    startGame: () => void
    resetGame: () => void
    answer: (state: string) => void
    states: string[]
    timer: number // seconds left
    tick: () => void
    setStates: (states: string[]) => void
}>((set, get) => ({
    started: false,
    finished: false,
    current: null,
    answered: {},
    timer: 300,
    states: [],

    startGame: () => {
        set({ started: true, finished: false, current: getRandomState(US_STATES), answered: {} })
    },

    resetGame: () => {
        set({ started: false, finished: false, current: null, answered: {} })
    },

    answer: (state: string) => {
        const { current, answered } = get()
        if (!current || answered[current]) {
            return
        }
        let status: AnswerStatus = 'incorrect'
        let newAnswered = { ...answered }
        if (state === current) {
            status = 'correct'
            newAnswered[state] = status
        } else {
            // Mark the actual state-to-find as incorrect
            newAnswered[current] = 'incorrect'
        }
        const remaining = US_STATES.filter((s) => !newAnswered[s])
        set({ answered: newAnswered, current: remaining.length > 0 ? getRandomState(remaining) : null, finished: remaining.length === 0 })
    },

    tick: () => {
        const { timer, finished, started } = get()
        if (!started || finished) return
        if (timer > 0) {
            set({ timer: timer - 1 })
            if (timer - 1 === 0) set({ finished: true })
        }
    },

    setStates: (states: string[]) => {
        set({ states })
    }
}))
