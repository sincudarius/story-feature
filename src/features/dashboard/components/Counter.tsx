import { useCounterStore } from '../hooks/useCounterStore'

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="w-full max-w-md text-center">
      <p className="mb-2 text-sm font-medium tracking-wide text-sky-400 uppercase">
        Vite · React · Tailwind · Zustand
      </p>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">
        Story Feature
      </h1>

      <p className="mb-6 text-6xl font-bold tabular-nums text-white">{count}</p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={decrement}
          className="rounded-lg bg-slate-800 px-4 py-2 text-lg font-medium transition hover:bg-slate-700"
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-700"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={increment}
          className="rounded-lg bg-sky-600 px-4 py-2 text-lg font-medium transition hover:bg-sky-500"
        >
          +
        </button>
      </div>
    </div>
  )
}
