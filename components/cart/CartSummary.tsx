'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Info, Trash2 } from 'lucide-react'
import { type CartItem } from '@/context/CartContext'

type CartSummaryProps = {
	cartItems: CartItem[]
	total: number
	onClear: () => void
	onProceed?: () => void
	proceedLabel?: string
	showProceedButton?: boolean
}

export function CartSummary({
	cartItems,
	total,
	onClear,
	onProceed,
	proceedLabel = 'Продолжить',
	showProceedButton = true,
}: CartSummaryProps) {
	return (
		<Card className="sticky top-24">
			<CardHeader className="p-6">
				<CardTitle className="text-2xl font-bold text-center">Сумма заказа</CardTitle>
			</CardHeader>
			<CardContent className="p-6 space-y-3">
				<div className="flex justify-between text-md">
					<span className="text-muted-foreground">Позиций в корзине:</span>
					<span className="font-semibold">{cartItems.length}</span>
				</div>
				<Separator />
				<div className="flex justify-between items-center text-xl">
					<span className="font-medium">Общая стоимость:</span>
					<span className="font-bold text-primary text-2xl">
						{total.toLocaleString('ru-RU')} ₽
					</span>
				</div>
				<div className="text-xs text-muted-foreground pt-2 flex items-start">
					<Info size={16} className="mr-2 mt-0.5 shrink-0 text-primary/80" />
					<span>
						Контактные данные (имя, телефон, email) будут взяты из первой добавленной позиции в корзине для общего заказа.
					</span>
				</div>
			</CardContent>
			{showProceedButton && (
				<CardFooter className="p-6 flex flex-col space-y-3">
					{onProceed && (
						<Button
							size="lg"
							className="w-full text-base py-3 shadow-lg bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 text-primary-foreground"
							onClick={onProceed}
						>
							{proceedLabel}
						</Button>
					)}
					<Button
						variant="outline"
						size="lg"
						onClick={onClear}
						className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
					>
						<Trash2 className="h-4 w-4 mr-2" /> Очистить корзину
					</Button>
				</CardFooter>
			)}
		</Card>
	)
}

