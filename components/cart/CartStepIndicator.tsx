'use client'

import { Check } from 'lucide-react'

type CartStepIndicatorProps = {
	currentStep: number
}

const steps = [
	{ number: 1, label: 'Корзина' },
	{ number: 2, label: 'Подтверждение' },
]

export function CartStepIndicator({ currentStep }: CartStepIndicatorProps) {
	const step1 = steps[0]
	const step2 = steps[1]
	const isStep1Completed = step1.number < currentStep
	const isStep1Current = step1.number === currentStep
	const isStep2Completed = step2.number < currentStep
	const isStep2Current = step2.number === currentStep
	const isLineActive = isStep1Completed || isStep1Current

	return (
		<div className="w-full mb-8">
			<div className="flex items-center justify-between">
				{/* Шаг 1 */}
				<div className="flex flex-col items-center flex-1">
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
							isStep1Completed
								? 'bg-primary border-primary text-primary-foreground'
								: isStep1Current
								? 'bg-primary border-primary text-primary-foreground'
								: 'bg-background border-muted-foreground/30 text-muted-foreground'
						}`}
					>
						{isStep1Completed ? (
							<Check className="h-5 w-5" />
						) : (
							<span className="font-semibold">{step1.number}</span>
						)}
					</div>
					<span
						className={`mt-2 text-sm font-medium ${
							isStep1Current || isStep1Completed
								? 'text-foreground'
								: 'text-muted-foreground'
						}`}
					>
						{step1.label}
					</span>
				</div>

				{/* Линия между шагами */}
				<div
					className={`h-0.5 flex-1 mx-4 transition-colors ${
						isLineActive ? 'bg-primary' : 'bg-muted-foreground/30'
					}`}
				/>

				{/* Шаг 2 */}
				<div className="flex flex-col items-center flex-1">
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
							isStep2Completed
								? 'bg-primary border-primary text-primary-foreground'
								: isStep2Current
								? 'bg-primary border-primary text-primary-foreground'
								: 'bg-background border-muted-foreground/30 text-muted-foreground'
						}`}
					>
						{isStep2Completed ? (
							<Check className="h-5 w-5" />
						) : (
							<span className="font-semibold">{step2.number}</span>
						)}
					</div>
					<span
						className={`mt-2 text-sm font-medium ${
							isStep2Current || isStep2Completed
								? 'text-foreground'
								: 'text-muted-foreground'
						}`}
					>
						{step2.label}
					</span>
				</div>
			</div>
		</div>
	)
}

