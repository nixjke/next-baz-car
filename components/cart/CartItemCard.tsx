'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit3, Baby, UserCheck, User, Gamepad2, Settings, Tag } from 'lucide-react'
import { type CartItem } from '@/context/CartContext'
import { serviceFees } from '@/config/bookingOptions'
import { getServerBaseUrl } from '@/utils/constants'
import Link from 'next/link'

type CartItemCardProps = {
	item: CartItem
	onRemove: (itemId: string) => void
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
	const carImage = item.car.images && item.car.images.length > 0 
		? item.car.images[0] 
		: null

	return (
		<Card className="overflow-hidden">
			<CardHeader className="p-5 bg-secondary/30">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-xl font-bold">{item.car.name}</CardTitle>
						<p className="text-xs text-muted-foreground">ID: {item.id}</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onRemove(item.id)}
						className="text-destructive hover:bg-destructive/10"
					>
						<Trash2 className="h-5 w-5" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-5">
				<div className="flex gap-4">
					{carImage && (
						<div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
							<img
								src={carImage.startsWith('http') ? carImage : `${getServerBaseUrl()}${carImage}`}
								alt={item.car.name}
								className="w-full h-full object-cover"
							/>
						</div>
					)}
					<div className="flex-1 space-y-2 text-sm">
						<div>
							<p>
								<strong>Даты:</strong> {item.pickupDate} - {item.returnDate} ({item.rentalDays} дн.)
							</p>
							<p>
								<strong>Цена за день:</strong> {item.dailyPrice.toLocaleString('ru-RU')} ₽
							</p>
							{item.rentalDays >= 3 && (
								<p className="text-green-600 text-xs flex items-center">
									<Tag className="inline h-3 w-3 mr-1" />
									Скидка за длит. аренду
								</p>
							)}
						</div>
						<div>
							<p>
								<strong>Доставка:</strong> {item.deliveryOption.label}{' '}
								({item.deliveryOption.price > 0 ? `+${item.deliveryOption.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно'})
							</p>
						</div>
						{(item.childSeat || item.personalDriver || item.ps5 || item.transmission || item.youngDriver) && (
							<div className="pt-2 border-t">
								<p className="font-semibold mb-1.5">Доп. услуги:</p>
								<ul className="space-y-0.5">
									{item.youngDriver && (
										<li className="flex items-center text-muted-foreground">
											<User className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
											Молодой водитель (+{serviceFees.youngDriver.toLocaleString('ru-RU')} ₽)
										</li>
									)}
									{item.childSeat && (
										<li className="flex items-center text-muted-foreground">
											<Baby className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
											Детское кресло (+{serviceFees.childSeat.toLocaleString('ru-RU')} ₽)
										</li>
									)}
									{item.personalDriver && (
										<li className="flex items-center text-muted-foreground">
											<UserCheck className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
											Личный водитель (+{serviceFees.personalDriver.toLocaleString('ru-RU')} ₽)
										</li>
									)}
									{item.ps5 && (
										<li className="flex items-center text-muted-foreground">
											<Gamepad2 className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
											PlayStation 5 (+{serviceFees.ps5.toLocaleString('ru-RU')} ₽)
										</li>
									)}
									{item.transmission && (
										<li className="flex items-center text-muted-foreground">
											<Settings className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
											Передача руля (+{serviceFees.transmission.toLocaleString('ru-RU')} ₽)
										</li>
									)}
								</ul>
							</div>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter className="p-5 bg-secondary/30 flex justify-between items-center">
				<Link
					href={`/cars/${item.car.id}?edit=${item.id}`}
					className="text-xs text-primary hover:underline flex items-center"
				>
					<Edit3 className="h-3.5 w-3.5 mr-1.5" /> Изменить параметры
				</Link>
				<p className="text-lg font-semibold text-primary">
					Итого: {item.totalPrice.toLocaleString('ru-RU')} ₽
				</p>
			</CardFooter>
		</Card>
	)
}

