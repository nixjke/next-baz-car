'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Headphones, MapPin, Route, ShieldCheck, MessageCircle, Send } from 'lucide-react'

const SOCIAL_LINKS = {
	telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/bazrent',
	whatsapp: 'https://wa.me/79894413888',
}

const Hero = () => {
	const heroVariants = {
		initial: { opacity: 0, y: 20 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.7, ease: 'easeOut' as const },
		},
	}

	const textVariants = {
		initial: { opacity: 0, y: 14 },
		animate: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
		}),
	}

	const features = [
		{ icon: MapPin, text: 'Доставка в аэропорт и отель' },
		{ icon: ShieldCheck, text: 'Все авто застрахованы' },
		{ icon: Headphones, text: 'Всегда на связи' },
		{ icon: Route, text: 'Поможем с маршрутами по Дагестану' },
	]

	return (
		<section className="relative overflow-hidden min-h-[78vh] md:min-h-[84vh]">
			<div className="absolute inset-0 z-0">
				<img
					className="w-full h-full object-cover"
					alt="Премиальные автомобили на фоне гор Дагестана"
					src="/hero/hero-bg.JPEG"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/50" />
			</div>

			<motion.div
				className="container relative z-10 pt-20 md:pt-28 pb-16 md:pb-20 h-full min-h-[78vh] md:min-h-[84vh] flex flex-col justify-between"
				variants={heroVariants}
				initial="initial"
				animate="animate"
			>
				<div className="max-w-6xl">
					<motion.h1
						custom={0}
						variants={textVariants}
						className="text-4xl md:text-6xl font-bold text-white leading-tight"
					>
						<span>Аренда премиальных автомобилей</span>{' '}
						<span className="block md:whitespace-nowrap">в Дагестане от 7 900 ₽ в сутки</span>
					</motion.h1>

					<motion.p
						custom={1}
						variants={textVariants}
						className="mt-5 text-base md:text-xl text-white/90"
					>
						Geely • LiXiang • BMW • Toyota | Доставка авто в аэропорт Махачкалы
					</motion.p>

					<motion.div
						custom={2}
						variants={textVariants}
						className="mt-8 flex flex-col items-start gap-3"
					>
						<Button
							size="lg"
							asChild
							className="min-w-[230px] text-base font-semibold shadow-lg"
						>
							<Link href="/cars">Выбрать автомобиль</Link>
						</Button>
						<div className="flex flex-wrap items-center gap-2">
							<a
								href={SOCIAL_LINKS.telegram}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Telegram"
								className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
							>
								<Send className="h-3.5 w-3.5" />
								Telegram
							</a>
							<a
								href={SOCIAL_LINKS.whatsapp}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="WhatsApp"
								className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:text-primary"
							>
								<MessageCircle className="h-3.5 w-3.5" />
								WhatsApp
							</a>
						</div>
					</motion.div>
				</div>

				<motion.div
					custom={3}
					variants={textVariants}
					className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
				>
					{features.map((item) => (
						<div
							key={item.text}
							className="rounded-xl border border-white/20 bg-black/35 backdrop-blur-md p-4 text-white flex items-center gap-3"
						>
							<item.icon className="h-6 w-6 text-primary shrink-0" />
							<p className="text-sm leading-snug">{item.text}</p>
						</div>
					))}
				</motion.div>
			</motion.div>
		</section>
	)
}

export default Hero;
