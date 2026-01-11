'use client'

import React from "react";
import {motion} from "framer-motion";
import {Shield, Clock, MapPin, Award, UserCheck} from "lucide-react";

const featuresData = [
    {
        icon: <Shield className="h-6 w-6"/>,
        title: "Полностью застрахованы",
        description: "Все автомобили застрахованы для вашего спокойствия и уверенности в дороге."
    },
    {
        icon: <Clock className="h-6 w-6"/>,
        title: "Поддержка 24/7",
        description: "Наша команда на связи круглосуточно и всегда готова помочь вам по любым вопросам."
    },
    {
        icon: <MapPin className="h-6 w-6"/>,
        title: "Помощь с маршрутами",
        description: "Подскажем лучшие туристические маршруты по Дагестану и дорожные условия."
    },
    {
        icon: <Award className="h-6 w-6"/>,
        title: "Гарантия качества",
        description: "Мы приобретаем все автомобили новыми, напрямую из салона. Каждая машина регулярно проходит техническое обслуживание и находится в безупречном состоянии."
    },
    {
        icon: <UserCheck className="h-6 w-6"/>,
        title: "Условие аренды",
        description: "Возраст от 18 лет, паспорт и водительские права."
    }
];

const Features = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container">
                <motion.div
                    className="text-center mb-16"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5}}
                >
                    <h2 className="text-4xl font-bold text-foreground mb-3">Почему выбирают нас</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Мы предоставляем исключительный сервис и премиальные автомобили, чтобы ваше путешествие было
                        комфортным и запоминающимся.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-card rounded-lg p-8 shadow-xl border border-border/50 hover:shadow-2xl transition-shadow duration-300"
                            initial={{opacity: 0, y: 30, scale: 0.95}}
                            whileInView={{opacity: 1, y: 0, scale: 1}}
                            viewport={{once: true}}
                            transition={{duration: 0.5, delay: index * 0.1, ease: "easeOut" as const}}
                        >
                            <div className="feature-icon mb-6 w-16 h-16 flex items-center justify-center">
                                {React.cloneElement(feature.icon, {className: "h-8 w-8"})}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;