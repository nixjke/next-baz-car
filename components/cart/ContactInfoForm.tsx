'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Phone, Mail } from 'lucide-react'

type ContactInfoFormProps = {
	initialData?: {
		name: string
		phone: string
		email?: string
	}
	onSubmit: (data: { name: string; phone: string; email?: string }) => void
	onBack?: () => void
}

export function ContactInfoForm({ initialData, onSubmit, onBack }: ContactInfoFormProps) {
	const [formData, setFormData] = useState({
		name: initialData?.name || '',
		phone: initialData?.phone || '',
		email: initialData?.email || '',
	})

	const [errors, setErrors] = useState<{
		name?: string
		phone?: string
		email?: string
	}>({})

	const validate = () => {
		const newErrors: typeof errors = {}

		if (!formData.name.trim()) {
			newErrors.name = 'Имя обязательно'
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Телефон обязателен'
		} else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
			newErrors.phone = 'Неверный формат телефона'
		}

		if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Неверный формат email'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (validate()) {
			onSubmit({
				name: formData.name.trim(),
				phone: formData.phone.trim(),
				email: formData.email?.trim() || undefined,
			})
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Контактная информация</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name" className="flex items-center">
							<User className="h-4 w-4 mr-2 text-primary" />
							Имя <span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							placeholder="Введите ваше имя"
							className={errors.name ? 'border-destructive' : ''}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone" className="flex items-center">
							<Phone className="h-4 w-4 mr-2 text-primary" />
							Телефон <span className="text-destructive ml-1">*</span>
						</Label>
						<Input
							id="phone"
							type="tel"
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							placeholder="+7 (999) 123-45-67"
							className={errors.phone ? 'border-destructive' : ''}
						/>
						{errors.phone && (
							<p className="text-sm text-destructive">{errors.phone}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="flex items-center">
							<Mail className="h-4 w-4 mr-2 text-primary" />
							Email (необязательно)
						</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							placeholder="example@mail.com"
							className={errors.email ? 'border-destructive' : ''}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email}</p>
						)}
					</div>

					<div className="flex gap-3 pt-4">
						{onBack && (
							<Button type="button" variant="outline" onClick={onBack} className="flex-1">
								Назад
							</Button>
						)}
						<Button type="submit" className="flex-1">
							Продолжить
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}

