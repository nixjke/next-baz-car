import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { YandexMetrika } from '@/components/YandexMetrika'

export const metadata: Metadata = {
	metadataBase: new URL('https://baz-car.ru'),
	title: {
		default: 'BazCar — Аренда премиальных автомобилей в Дагестане',
		template: '%s | BazCar',
	},
	description:
		'Аренда премиальных автомобилей в Дагестане. LiXiang, Lexus, Toyota, Geely. Комфортные условия, прозрачные цены, скидки при длительной аренде.',
	keywords: [
		'аренда автомобилей Дагестан',
		'прокат машин Махачкала',
		'аренда авто',
		'премиальные автомобили',
		'BazCar',
	],
	authors: [{ name: 'BazCar' }],
	creator: 'BazCar',
	publisher: 'BazCar',
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		siteName: 'BazCar',
		title: 'BazCar — Аренда премиальных автомобилей в Дагестане',
		description:
			'Премиальная аренда автомобилей в Дагестане. Выбирайте комфорт и стиль для путешествий.',
		images: [
			{
				url: '/logo.png',
				width: 1200,
				height: 630,
				alt: 'BazCar — аренда автомобилей',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'BazCar — Аренда автомобилей в Дагестане',
		description: 'Премиальная аренда автомобилей в Дагестане. Комфорт и стиль.',
		images: ['/logo.png'],
	},
	robots: {
		index: true,
		follow: true,
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body>
				<YandexMetrika />
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
