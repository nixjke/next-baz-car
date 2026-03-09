'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type FaqItem = {
	id: string
	question: string
	answer: string
}

const FAQ_ITEMS: FaqItem[] = [
	{
		id: 'documents',
		question: 'Какие документы нужны для аренды автомобиля?',
		answer:
			'Для оформления аренды понадобятся паспорт и водительское удостоверение. В отдельных случаях мы можем дополнительно запросить подтверждение личности.',
	},
	{
		id: 'delivery',
		question: 'Есть ли доставка автомобиля в аэропорт или отель?',
		answer:
			'Да, мы можем доставить автомобиль в аэропорт, отель или любое другое удобное для вас место. Стоимость доставки зависит от локации и уточняется при бронировании.',
	},
	{
		id: 'deposit',
		question: 'Какой залог нужен при аренде?',
		answer:
			'Размер залога зависит от выбранного автомобиля. Наш менеджер заранее сообщит точную сумму и подробно расскажет об условиях возврата.',
	},
	{
		id: 'outside',
		question: 'Можно ли выезжать за пределы Дагестана?',
		answer:
			'Да, выезд за пределы Дагестана возможен. Условия и стоимость выезда согласовываются с менеджером при оформлении аренды.',
	},
	{
		id: 'insurance',
		question: 'Все ли автомобили застрахованы?',
		answer: 'Да, все автомобили застрахованы и имеют страховку ОСАГО.',
	},
]

export default function FaqSection() {
	const [openId, setOpenId] = useState<string | null>(null)

	return (
		<section className="relative z-10 py-16 md:py-24">
			<div className="container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.45 }}
					className="mx-auto max-w-5xl"
				>
					<div className="mb-8 text-center md:mb-10">
						<div className="mb-4 inline-flex items-center rounded-full border border-emerald-300/60 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 backdrop-blur-md dark:border-emerald-300/40 dark:bg-emerald-400/10 dark:text-emerald-100">
							FAQ
						</div>
						<h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl dark:text-white">
							Ответы на частые вопросы
						</h2>
						<p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-xl dark:text-slate-200/90">
							Собрали самые популярные вопросы по аренде автомобилей,
							условиям, доставке и залогу.
						</p>
					</div>

					<div className="relative overflow-hidden rounded-3xl border border-emerald-300/45 bg-white/70 p-3 backdrop-blur-md md:p-4 dark:border-emerald-200/15 dark:bg-slate-950/50">
						<div className="pointer-events-none absolute inset-0 rounded-3xl border border-emerald-300/25 dark:border-white/10" />
						<div className="pointer-events-none absolute -left-20 top-12 h-44 w-44 animate-pulse rounded-full bg-emerald-300/20 blur-[75px] dark:bg-emerald-300/30" />
						<div className="pointer-events-none absolute -right-16 bottom-10 h-40 w-40 animate-pulse rounded-full bg-cyan-300/18 blur-[72px] dark:bg-cyan-300/25" />

						<div className="relative space-y-2">
							{FAQ_ITEMS.map((item) => {
								const isOpen = openId === item.id
								return (
									<div
										key={item.id}
										className={cn(
											'overflow-hidden rounded-2xl border transition-all duration-300',
											'bg-white/75 backdrop-blur-sm dark:bg-slate-950/65',
											isOpen
												? 'border-emerald-400/50 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_0_22px_rgba(16,185,129,0.14)] dark:border-emerald-200/45 dark:shadow-[0_0_0_1px_rgba(74,222,128,0.22),0_0_25px_rgba(16,185,129,0.22)]'
												: 'border-emerald-200/40 hover:border-emerald-300/60 hover:shadow-[0_0_14px_rgba(16,185,129,0.14)] dark:border-white/12 dark:hover:border-emerald-200/35 dark:hover:shadow-[0_0_18px_rgba(16,185,129,0.2)]'
										)}
									>
										<button
											type="button"
											onClick={() =>
												setOpenId((prev) => (prev === item.id ? null : item.id))
											}
											className="group flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-6"
											aria-expanded={isOpen}
										>
											<span className="pr-2 text-base font-medium leading-snug text-slate-900 md:text-[1.6rem] dark:text-white">
												{item.question}
											</span>
											<span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-500/10 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.14)] transition-transform duration-300 group-hover:scale-[1.03] dark:border-emerald-200/35 dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-[0_0_15px_rgba(16,185,129,0.22)]">
												<Plus
													className={cn(
														'h-5 w-5 transition-transform duration-300',
														isOpen && 'rotate-45'
													)}
												/>
											</span>
										</button>

										<div
											className={cn(
												'grid transition-all duration-300',
												isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
											)}
										>
											<div className="overflow-hidden">
												<p className="px-4 pb-5 text-sm leading-relaxed text-slate-700 md:px-6 md:text-lg dark:text-slate-200/90">
													{item.answer}
												</p>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
