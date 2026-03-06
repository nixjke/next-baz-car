'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Headphones, MapPin, Route, ShieldCheck } from 'lucide-react'

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
		{ icon: Headphones, text: 'Поддержка 24/7' },
		{ icon: Route, text: 'Поможем с маршрутами по Дагестану' },
	]

	return (
		<section className="relative overflow-hidden min-h-[78vh] md:min-h-[84vh]">
			<div className="absolute inset-0 z-0">
				<img
					className="w-full h-full object-cover"
					alt="Премиальные автомобили на фоне гор Дагестана"
					src="/hero/hero-bg.png"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/50" />
			</div>

			<motion.div
				className="container relative z-10 pt-20 md:pt-28 pb-14 md:pb-16"
				variants={heroVariants}
				initial="initial"
				animate="animate"
			>
				<div className="max-w-3xl">
					<motion.h1
						custom={0}
						variants={textVariants}
						className="text-4xl md:text-6xl font-bold text-white leading-tight"
					>
						Аренда премиальных автомобилей в Дагестане от 7 900 ₽ в сутки
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
						className="mt-8 flex flex-wrap items-center gap-4"
					>
						<Button
							size="lg"
							asChild
							className="min-w-[230px] text-base font-semibold shadow-lg"
						>
							<Link href="/cars">Выбрать автомобиль</Link>
						</Button>
					</motion.div>
				</div>

				<motion.div
					custom={3}
					variants={textVariants}
					className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
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
