'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { createCartBooking } from '@/services/cartService'
import { useToast } from '@/components/ui/use-toast'
import { CartStepIndicator } from '@/components/cart/CartStepIndicator'
import { CartItemCard } from '@/components/cart/CartItemCard'
import { CartSummary } from '@/components/cart/CartSummary'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const QR_CODE_STORAGE_KEY = 'bazcar_qr_code'

export default function CartPage() {
	const router = useRouter()
	const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart()
	const { toast } = useToast()
	const [currentStep, setCurrentStep] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [whatsappLink, setWhatsappLink] = useState<string | null>(null)

	useEffect(() => {
		// Если корзина пуста и мы не на шаге подтверждения, перенаправляем
		if (cartItems.length === 0 && currentStep !== 2 && !whatsappLink) {
			router.push('/cars')
		}
	}, [cartItems.length, currentStep, router, whatsappLink])

	const handleProceedToConfirmation = () => {
		if (cartItems.length === 0) {
			toast({
				title: 'Корзина пуста',
				description: 'Добавьте автомобили в корзину перед оформлением заказа',
				variant: 'destructive',
			})
			return
		}
		// Проверяем, что у всех элементов корзины есть контактная информация
		const missingContacts = cartItems.some(item => !item.name || !item.phone)
		if (missingContacts) {
			toast({
				title: 'Неполные данные',
				description: 'У некоторых позиций отсутствует контактная информация. Пожалуйста, проверьте данные.',
				variant: 'destructive',
			})
			return
		}
		setCurrentStep(2)
	}

	const handleBackToCart = () => {
		setCurrentStep(1)
	}

	const handleCreateBooking = async () => {
		if (cartItems.length === 0) {
			toast({
				title: 'Корзина пуста',
				description: 'Добавьте автомобили в корзину перед оформлением заказа',
				variant: 'destructive',
			})
			return
		}

		// Используем контактную информацию из первого элемента корзины
		const firstItem = cartItems[0]
		if (!firstItem.name || !firstItem.phone) {
			toast({
				title: 'Ошибка',
				description: 'Контактная информация не заполнена',
				variant: 'destructive',
			})
			return
		}

		const contactInfo = {
			name: firstItem.name,
			phone: firstItem.phone,
			email: firstItem.email,
		}

		setIsSubmitting(true)

		try {
			// Получаем QR-код из localStorage, если есть
			let qrCodeData: { code: string; discount: number } | undefined
			if (typeof window !== 'undefined') {
				const stored = localStorage.getItem(QR_CODE_STORAGE_KEY)
				if (stored) {
					try {
						const parsed = JSON.parse(stored)
						if (parsed.code && parsed.discount) {
							qrCodeData = {
								code: parsed.code,
							discount: parsed.discount,
						}
					}
				} catch (e) {
					// Ошибка парсинга QR кода
				}
				}
			}

			const response = await createCartBooking(cartItems, contactInfo, qrCodeData)
			setWhatsappLink(response.whatsapp_link)

			toast({
				title: 'Заказ готов!',
				description: 'Вы будете перенаправлены в WhatsApp для отправки деталей заказа.',
			})

			// Открываем WhatsApp в новой вкладке
			window.open(response.whatsapp_link, '_blank')
		} catch (error: any) {
			toast({
				title: 'Ошибка',
				description: error.message || 'Не удалось создать заказ',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	// Если корзина пуста и нет WhatsApp ссылки
	if (cartItems.length === 0 && !whatsappLink) {
		return (
			<div className="container py-16">
				<motion.div
					className="text-center py-20 bg-card rounded-lg shadow-md border"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
				>
					<ShoppingBag className="h-20 w-20 text-primary mx-auto mb-6 opacity-40" />
					<h2 className="text-3xl font-semibold mb-3">Ваша корзина пуста</h2>
					<p className="text-muted-foreground mb-8">
						Похоже, вы еще не добавили ни одного автомобиля.
					</p>
					<Button asChild size="lg">
						<Link href="/cars" className="flex items-center">
							<ArrowLeft className="h-5 w-5 mr-2" /> К выбору автомобилей
						</Link>
					</Button>
				</motion.div>
			</div>
		)
	}

	return (
		<div className="container py-16">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="mb-10 text-center">
					<h1 className="text-5xl font-extrabold mb-3 flex items-center justify-center">
						<ShoppingBag className="h-12 w-12 mr-3 text-primary" /> Ваша Корзина
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Проверьте выбранные автомобили и опции. Когда будете готовы, переходите к оформлению.
					</p>
				</div>

				<CartStepIndicator currentStep={currentStep} />

				{/* Шаг 1: Просмотр корзины */}
				{currentStep === 1 && (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
					>
						<div className="lg:col-span-2 space-y-6">
							{cartItems.map((item) => (
								<CartItemCard key={item.id} item={item} onRemove={removeFromCart} />
							))}
						</div>

						<div className="lg:col-span-1">
							<CartSummary
								cartItems={cartItems}
								total={getCartTotal()}
								onClear={clearCart}
								onProceed={handleProceedToConfirmation}
								proceedLabel="Оформить заказ"
							/>
						</div>
					</motion.div>
				)}

				{/* Шаг 2: Подтверждение */}
				{currentStep === 2 && (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="max-w-4xl mx-auto space-y-6"
					>
						<Card>
							<CardHeader>
								<CardTitle>Подтверждение заказа</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<h3 className="font-semibold mb-3">Позиции в заказе:</h3>
									<div className="space-y-4">
										{cartItems.map((item) => (
											<div key={item.id} className="border-b pb-4 last:border-0">
												<p className="font-medium">{item.car.name}</p>
												<p className="text-sm text-muted-foreground">
													{item.pickupDate} - {item.returnDate} ({item.rentalDays} дн.)
												</p>
												<p className="text-sm font-medium">
													{item.totalPrice.toLocaleString('ru-RU')} ₽
												</p>
											</div>
										))}
									</div>
								</div>

								{cartItems.length > 0 && (
									<div>
										<h3 className="font-semibold mb-3">Контактная информация:</h3>
										<div className="space-y-1 text-sm">
											<p>
												<strong>Имя:</strong> {cartItems[0].name}
											</p>
											<p>
												<strong>Телефон:</strong> {cartItems[0].phone}
											</p>
											{cartItems[0].email && (
												<p>
													<strong>Email:</strong> {cartItems[0].email}
												</p>
											)}
										</div>
									</div>
								)}

								<div className="pt-4 border-t">
									<div className="flex justify-between items-center text-xl">
										<span className="font-medium">Итого к оплате:</span>
										<span className="font-bold text-primary text-2xl">
											{getCartTotal().toLocaleString('ru-RU')} ₽
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="flex gap-3">
							<Button variant="outline" onClick={handleBackToCart} className="flex-1">
								Назад
							</Button>
							<Button
								onClick={handleCreateBooking}
								disabled={isSubmitting}
								className="flex-1 bg-gradient-to-r from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										Обработка...
									</>
								) : (
									<>
										<CheckCircle2 className="h-4 w-4 mr-2" />
										Оформить через WhatsApp
									</>
								)}
							</Button>
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

