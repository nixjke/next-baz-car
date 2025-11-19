'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
	Phone,
} from 'lucide-react'

const Footer = () => {
	const footerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const, staggerChildren: 0.2 } },
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
	};

	const quickLinks = [
		{ label: 'Главная', href: '/' },
		{ label: 'Автопарк', href: '/cars' },
		{ label: 'О Дагестане', href: '/about-dagestan' },
	]

	const currentYear = new Date().getFullYear()

  return (
    <motion.footer 
      className="bg-card text-card-foreground border-t border-border/50 pt-16 pb-8"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-12">
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
			<Link
				href="/"
				className="flex items-center gap-2 text-2xl font-bold text-primary"
			>
				<img src="/logo.png" alt="BazCar Logo" className="h-10 w-auto" />
				<span className="hidden sm:inline gradient-text">
					BazCar
				</span>
			</Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ваш надежный партнер по аренде премиальных автомобилей в Дагестане. Путешествуйте с комфортом и стилем.
            </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div>
            <p className="text-lg font-semibold text-foreground mb-5">Быстрые ссылки</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
				<Link
					href={link.href}
					className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-200"
				>
					{link.label}
				</Link>
                </li>
              ))}
            </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div>
            <p className="text-lg font-semibold text-foreground mb-5">Контакты</p>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href="tel:+79894413888" className="hover:text-primary hover:underline transition-colors duration-200">+7 989 441-38-88</a>
            </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants} 
          className="border-t border-border/50 pt-8 text-center"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} BazCar. Все права защищены.
            Разработано с ❤️ в Дагестане.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
