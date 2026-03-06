export type CarTagColorKey =
	| 'green'
	| 'blue'
	| 'orange'
	| 'purple'
	| 'red'
	| 'teal'
	| 'yellow'

export const DEFAULT_CAR_TAG_COLOR: CarTagColorKey = 'green'

// Source of truth for allowed tag colors on frontend.
// Admin should use the same keys so frontend can map key -> class directly.
export const CAR_TAG_COLOR_META: Record<CarTagColorKey, { label: string; hex: string }> = {
	green: { label: 'Зеленый', hex: '#15803d' },
	blue: { label: 'Синий', hex: '#1d4ed8' },
	orange: { label: 'Оранжевый', hex: '#c2410c' },
	purple: { label: 'Фиолетовый', hex: '#7e22ce' },
	red: { label: 'Красный', hex: '#be123c' },
	teal: { label: 'Бирюзовый', hex: '#0f766e' },
	yellow: { label: 'Желтый', hex: '#ca8a04' },
}

export const CAR_TAG_BADGE_CLASS_MAP: Record<CarTagColorKey, string> = {
	green:
		'!bg-emerald-700/82 !border-emerald-300/45 text-emerald-50 ring-1 ring-emerald-200/45 shadow-[0_7px_16px_-10px_rgba(16,185,129,0.8)] hover:!bg-emerald-700/82',
	blue:
		'!bg-blue-700/82 !border-blue-300/45 text-blue-50 ring-1 ring-blue-200/45 shadow-[0_7px_16px_-10px_rgba(59,130,246,0.8)] hover:!bg-blue-700/82',
	orange:
		'!bg-orange-700/82 !border-orange-300/45 text-orange-50 ring-1 ring-orange-200/45 shadow-[0_7px_16px_-10px_rgba(249,115,22,0.82)] hover:!bg-orange-700/82',
	purple:
		'!bg-violet-700/82 !border-violet-300/45 text-violet-50 ring-1 ring-violet-200/45 shadow-[0_7px_16px_-10px_rgba(139,92,246,0.8)] hover:!bg-violet-700/82',
	red:
		'!bg-rose-700/82 !border-rose-300/45 text-rose-50 ring-1 ring-rose-200/45 shadow-[0_7px_16px_-10px_rgba(244,63,94,0.82)] hover:!bg-rose-700/82',
	teal:
		'!bg-teal-700/82 !border-teal-300/45 text-teal-50 ring-1 ring-teal-200/45 shadow-[0_7px_16px_-10px_rgba(20,184,166,0.82)] hover:!bg-teal-700/82',
	yellow:
		'!bg-amber-500/88 !border-amber-200/55 text-zinc-900 ring-1 ring-amber-100/55 shadow-[0_7px_16px_-10px_rgba(251,191,36,0.82)] hover:!bg-amber-500/88',
}

export const isCarTagColorKey = (value: unknown): value is CarTagColorKey => {
	return (
		typeof value === 'string' &&
		(value === 'green' ||
			value === 'blue' ||
			value === 'orange' ||
			value === 'purple' ||
			value === 'red' ||
			value === 'teal' ||
			value === 'yellow')
	)
}

const HEX_TO_CAR_TAG_COLOR_KEY: Record<string, CarTagColorKey> = {
	'#15803d': 'green',
	'#1d4ed8': 'blue',
	'#c2410c': 'orange',
	'#7e22ce': 'purple',
	'#be123c': 'red',
	'#0f766e': 'teal',
	'#ca8a04': 'yellow',
}

export const normalizeCarTagColor = (value: unknown): CarTagColorKey => {
	if (typeof value !== 'string') return DEFAULT_CAR_TAG_COLOR
	const normalized = value.trim().toLowerCase()
	if (isCarTagColorKey(normalized)) return normalized
	return HEX_TO_CAR_TAG_COLOR_KEY[normalized] || DEFAULT_CAR_TAG_COLOR
}

const hexToRgba = (hex: string, alpha: number): string => {
	const sanitized = hex.replace('#', '')
	const r = parseInt(sanitized.slice(0, 2), 16)
	const g = parseInt(sanitized.slice(2, 4), 16)
	const b = parseInt(sanitized.slice(4, 6), 16)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const getCarTagBadgeStyle = (colorKey: CarTagColorKey): { backgroundColor: string; borderColor: string; color: string } => {
	const hex = CAR_TAG_COLOR_META[colorKey].hex
	return {
		backgroundColor: hexToRgba(hex, 0.35),
		borderColor: hexToRgba(hex, 0.3),
		color: '#f8fafc',
	}
}
