export type Car = {
	id: number
	name: string
	category?: string
	price: number
	price_3plus_days?: number
	images?: string[]
	description?: string
	features?: string[]
	specifications?: {
		engine?: string
		power?: string
		acceleration?: string
		topSpeed?: string
		range?: string
		seating?: string
		cargo?: string
		fuelEconomy?: string
	}
	available?: boolean
	rating?: number
	fuelType?: string
	fuel_type?: string
	restrictions?: {
		age?: string
		experience?: string
		deposit?: string
		mountainDriving?: string
	}
	[key: string]: any
}

export const mockCars: Car[] = [
	{
		id: 1,
		name: 'LiXiang L6 Pro (Cлоновья кость)',
		category: 'Premium Electric',
		price: 15900,
		price_3plus_days: 14300,
		images: [
			'/li6-white/13G08602.webp',
			'/li6-white/13G08521.webp',
			'/li6-white/13G08565.webp',
			'/li6-white/13G08621.webp',
			'/li6-white/13G08643.webp',
		],
		description:
			'Luxury electric sedan with premium comfort and advanced technology. Elegant ivory color.',
		features: [
			'Long-range battery (700+ km)',
			'Air suspension',
			'Premium leather interior',
			'Advanced driver assistance',
			'Panoramic sunroof',
		],
		specifications: {
			engine: 'Dual Motor AWD',
			power: '500 hp',
			acceleration: '4.5 seconds (0-100 km/h)',
			topSpeed: '250 km/h',
			range: '710 km',
			seating: '5 adults',
			cargo: '450 liters',
		},
		available: true,
		rating: 4.8,
		fuelType: 'Электро',
		fuel_type: 'Электро',
	},
	{
		id: 3,
		name: 'LiXiang L7',
		category: 'Luxury SUV',
		price: 17900,
		price_3plus_days: 16110,
		images: [
			'/li7-black/13G08240.webp',
			'/li7-black/13G07765.webp',
			'/li7-black/13G07881.webp',
			'/li7-black/13G07910.webp',
			'/li7-black/13G08229.webp',
		],
		description:
			'Flagship luxury electric SUV with spacious interior and cutting-edge technology in elegant black.',
		features: [
			'Executive rear seating',
			'Electrochromic roof',
			'Massage seats',
			'28-speaker audio system',
			'Rear-wheel steering',
		],
		specifications: {
			engine: 'Tri-Motor AWD',
			power: '650 hp',
			acceleration: '3.8 seconds (0-100 km/h)',
			topSpeed: '270 km/h',
			range: '750 km',
			seating: '5 adults',
			cargo: '550 liters',
		},
		available: true,
		rating: 5.0,
		fuelType: 'Электро',
		fuel_type: 'Электро',
	},
	{
		id: 4,
		name: 'Toyota Land Cruiser 200 (Черный)',
		category: 'Luxury SUV',
		price: 12500,
		price_3plus_days: 11250,
		images: [
			'/land-cruiser-200/13G07972.webp',
			'/land-cruiser-200/13G08009.webp',
			'/land-cruiser-200/13G08038.webp',
			'/land-cruiser-200/13G08067.webp',
			'/land-cruiser-200/13G08077.webp',
			'/land-cruiser-200/13G08089.webp',
			'/land-cruiser-200/13G08094.webp',
		],
		description:
			'Legendary off-road capability combined with premium comfort and reliability.',
		features: [
			'Full-time 4WD',
			'KDSS suspension',
			'Cooled front seats',
			'Premium leather interior',
			'Multi-terrain select',
		],
		specifications: {
			engine: '4.6L V8',
			power: '309 hp',
			acceleration: '7.5 seconds (0-100 km/h)',
			topSpeed: '210 km/h',
			fuelEconomy: '13.5 l/100km',
			seating: '7 adults',
			cargo: '620 liters',
		},
		available: true,
		rating: 4.9,
		fuelType: 'Бензин',
		fuel_type: 'Бензин',
	},
	{
		id: 5,
		name: 'Geely Monjaro',
		category: 'Hybrid SUV',
		price: 8500,
		price_3plus_days: 7650,
		images: [
			'/geely-monjaro/13G08098.webp',
			'/geely-monjaro/13G08114.webp',
			'/geely-monjaro/13G08116.webp',
		],
		description:
			'Modern hybrid SUV with bold design, advanced tech, and efficient powertrain.',
		features: [
			'Hybrid 1.5L Turbo + Electric Motor',
			'Panoramic sunroof',
			'12.3-inch touchscreen',
			'Adaptive cruise control',
			'360-degree camera',
		],
		specifications: {
			engine: '1.5L Turbo Hybrid',
			power: '190 hp',
			acceleration: '8.9 seconds (0-100 km/h)',
			topSpeed: '200 km/h',
			fuelEconomy: '5.2 l/100km',
			seating: '5 adults',
			cargo: '480 liters',
		},
		available: true,
		rating: 4.7,
		fuelType: 'Гибрид',
		fuel_type: 'Гибрид',
	},
	{
		id: 6,
		name: 'Lexus IS F',
		category: 'Premium Sedan',
		price: 23000,
		price_3plus_days: 20700,
		images: [
			'/lexus-is-f/13G08882.webp',
			'/lexus-is-f/13G08862.webp',
			'/lexus-is-f/13G08895.webp',
			'/lexus-is-f/13G08837.webp',
			'/lexus-is-f/13G08958.webp',
			'/lexus-is-f/13G08972.webp',
			'/lexus-is-f/13G08979.webp',
			'/lexus-is-f/13G08996.webp',
			'/lexus-is-f/13G09004.webp',
		],
		description:
			'High-performance luxury sedan with a powerful V8 engine and sport-tuned suspension.',
		features: [
			'5.0L V8 Engine',
			'Premium leather interior',
			'Mark Levinson audio system',
		],
		specifications: {
			engine: '5.0L V8',
			power: '423 hp',
			acceleration: '4.7 seconds (0-100 km/h)',
			topSpeed: '270 km/h',
			fuelEconomy: '12.5 l/100km',
			seating: '5 adults',
			cargo: '378 liters',
		},
		available: true,
		rating: 4.9,
		fuelType: 'Бензин',
		fuel_type: 'Бензин',
		restrictions: {
			age: 'от 25 лет',
			experience: '5 лет',
			deposit: 'автомобиль',
			mountainDriving: 'запрещено',
		},
	},
	{
		id: 7,
		name: 'Li L6 (Серая)',
		category: 'Premium Electric',
		price: 15900,
		price_3plus_days: 14310,
		images: [
			'/li-6-gray/imhcwng5asti2dh10wtn.webp',
			'/li-6-gray/d6g5obv5ruuomyfnxpoa.webp',
			'/li-6-gray/hxoqqiffxq5lnjsfn2tb.webp',
			'/li-6-gray/cvk5wwmyfizyorgimorw.webp',
			'/li-6-gray/oq5jrfijrjkyajga5alk.webp',
			'/li-6-gray/qvhrvv5nyi60bmbs2xzu.webp',
			'/li-6-gray/regqet6cspaeebnqjf0j.webp',
			'/li-6-gray/ushyqci4hf8qm1xrvcci.webp',
			'/li-6-gray/vajjdgygkf9cuzmxoo8d.webp',
		],
		description:
			'Luxury electric sedan with premium comfort and advanced technology. Elegant gray color.',
		features: [
			'Long-range battery (700+ km)',
			'Air suspension',
			'Premium leather interior',
			'Advanced driver assistance',
			'Panoramic sunroof',
		],
		specifications: {
			engine: 'Dual Motor AWD',
			power: '500 hp',
			acceleration: '4.5 seconds (0-100 km/h)',
			topSpeed: '250 km/h',
			range: '710 km',
			seating: '5 adults',
			cargo: '450 liters',
		},
		available: true,
		rating: 4.8,
		fuelType: 'Электро',
		fuel_type: 'Электро',
	},
	{
		id: 8,
		name: 'Lexus 570',
		category: 'Luxury SUV',
		price: 11000,
		price_3plus_days: 9900,
		images: [
			'/lexus-570/curhh7impfkenfbnsp0y.webp',
			'/lexus-570/da81uiarnrmxxtcmsr0t.webp',
			'/lexus-570/k1pj0espsjlhscdsrtck.webp',
			'/lexus-570/kybtleesc9dnzfvgt8iw.webp',
			'/lexus-570/ll6bkptej8b611wfdhhj.webp',
			'/lexus-570/nypqzkcxbga61pa8zhfe.webp',
			'/lexus-570/siyr2hzrcnyfthrjpvhi.webp',
			'/lexus-570/ufv6rw6zfcjxiqe6s3ac.webp',
			'/lexus-570/xsl9isga8u6y2zn1ygf7.webp',
		],
		description:
			'Luxury full-size SUV with powerful V8 engine and premium comfort features.',
		features: [
			'5.7L V8 Engine',
			'Premium leather interior',
			'Mark Levinson audio system',
			'Multi-terrain monitor',
			'Semi-aniline leather seats',
		],
		specifications: {
			engine: '5.7L V8',
			power: '383 hp',
			acceleration: '7.3 seconds (0-100 km/h)',
			topSpeed: '220 km/h',
			fuelEconomy: '14.7 l/100km',
			seating: '8 adults',
			cargo: '1200 liters',
		},
		available: true,
		rating: 4.9,
		fuelType: 'Бензин',
		fuel_type: 'Бензин',
	},
]

