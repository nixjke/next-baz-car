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
