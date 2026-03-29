export const YANDEX_METRIKA_ID = 106290811

export function reachGoal(
	goal: string,
	params?: Record<string, string | number>
): void {
	if (typeof window === 'undefined') return
	const ym = (window as any).ym
	if (typeof ym !== 'function') return
	ym(YANDEX_METRIKA_ID, 'reachGoal', goal, params)
}

export function reachGoalOncePerSession(
	goal: string,
	params?: Record<string, string | number>,
	storageKey?: string
): void {
	if (typeof window === 'undefined') return

	const key = storageKey || `metrika_goal_once:${goal}`
	try {
		if (window.sessionStorage.getItem(key) === '1') return
		reachGoal(goal, params)
		window.sessionStorage.setItem(key, '1')
	} catch {
		// If storage is unavailable (privacy mode, denied access), send goal without session guard.
		reachGoal(goal, params)
	}
}
