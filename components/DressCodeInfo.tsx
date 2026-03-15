'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Info, ChevronLeft, ChevronRight } from 'lucide-react'

const DressCodeInfo = () => {
  const [mobileIndex, setMobileIndex] = useState(0)

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const, staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const recommendations = [
    {
      title: "Для женщин",
      points: ["Одежда ниже колен", "Закрытые плечи", "Не обтягивающее"],
      imageKey: "woman-modest-dress-mountains",
      src: "/dress/dress-2.webp",
      bgColor: "bg-pink-100/70",
      textColor: "text-pink-700",
      borderColor: "border-pink-300"
    },
    {
      title: "Для мужчин",
      points: ["Брюки или длинные шорты", "Рубашки/футболки", "В храмах – длинный рукав"],
      imageKey: "man-respectful-attire-city",
      src: "/dress/dress-3.webp",
      bgColor: "bg-blue-100/70",
      textColor: "text-blue-700",
      borderColor: "border-blue-300"
    },
    {
      title: "Общие правила",
      points: ["Избегать: коротких юбок/шорт", "Избегать: глубоких декольте", "Уважение к традициям"],
      imageKey: "cultural-symbols-fabric",
      src: "/dress/dress-1.webp",
      bgColor: "bg-green-100/70",
      textColor: "text-green-700",
      borderColor: "border-green-300"
    },
    {
      title: "Пляжный этикет",
      points: ["Купальники – только на пляже", "Скромность при выходе в город", "Прикрываться при необходимости"],
      imageKey: "beach-sunset-silhouette-modest",
      src: "/dress/dress-4.webp",
      bgColor: "bg-yellow-100/70",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300"
    }
  ];

  const mobilePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? recommendations.length - 1 : prev - 1))
  }

  const mobileNext = () => {
    setMobileIndex((prev) => (prev === recommendations.length - 1 ? 0 : prev + 1))
  }

  return (
    <motion.section
      className="py-16 md:py-20 bg-background"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container">
        <motion.div
          className="text-center mb-16"
          variants={{ hidden: { opacity: 0, y:30 }, visible: { opacity:1, y:0, transition: {duration: 0.5}} }}
        >
          <div className="inline-flex items-center text-primary mb-2">
            <Info className="h-6 w-6 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Ваш гид по стилю</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Дресс-код в Дагестане
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Путешествуйте с комфортом и уважением, следуя этим простым визуальным подсказкам.
          </p>
        </motion.div>

        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {recommendations.map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-xl shadow-lg overflow-hidden border transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 ${item.bgColor} ${item.borderColor}`}
              variants={cardVariants}
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110 object-cover object-top"
                  alt={item.title}
                  src={item.src} />
              </div>
              <div className="p-5">
                <h3 className={`text-xl font-semibold ${item.textColor} mb-3`}>{item.title}</h3>
                <ul className="space-y-1.5">
                  {item.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-start">
                      <Sparkles className={`h-4 w-4 ${item.textColor} mr-2 mt-1 flex-shrink-0`} />
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="sm:hidden">
          <div className="relative mx-auto max-w-[340px]">
            <button
              type="button"
              aria-label="Предыдущая карточка"
              onClick={mobilePrev}
              className="absolute left-[-42px] top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>

            <motion.div
              key={recommendations[mobileIndex].title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-xl shadow-lg overflow-hidden border ${recommendations[mobileIndex].bgColor} ${recommendations[mobileIndex].borderColor}`}
            >
              <div className="h-[320px] w-full overflow-hidden">
                <img
                  className="h-full w-full object-cover object-top"
                  alt={recommendations[mobileIndex].title}
                  src={recommendations[mobileIndex].src}
                />
              </div>
              <div className="p-5">
                <h3 className={`text-2xl font-semibold ${recommendations[mobileIndex].textColor} mb-3`}>
                  {recommendations[mobileIndex].title}
                </h3>
                <ul className="space-y-2">
                  {recommendations[mobileIndex].points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-start">
                      <Sparkles className={`h-4 w-4 ${recommendations[mobileIndex].textColor} mr-2 mt-1 flex-shrink-0`} />
                      <span className="text-[15px] text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-center gap-2">
                  {recommendations.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMobileIndex(idx)}
                      aria-label={`Перейти к карточке ${idx + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        idx === mobileIndex ? 'bg-primary' : 'bg-primary/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <button
              type="button"
              aria-label="Следующая карточка"
              onClick={mobileNext}
              className="absolute right-[-42px] top-1/2 z-10 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/80 text-foreground shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </div>
          <p className="mt-4 text-center text-muted-foreground">
            {mobileIndex + 1} / {recommendations.length}
          </p>
        </div>
         <motion.p
            variants={{ hidden: { opacity: 0}, visible: { opacity:1, transition: {delay: recommendations.length * 0.15 + 0.3, duration: 0.5}} }}
            className="text-center mt-12 text-muted-foreground text-sm max-w-3xl mx-auto"
          >
            Простые правила для приятного путешествия. Наслаждайтесь гостеприимством Дагестана!
        </motion.p>
      </div>
    </motion.section>
  );
};

export default DressCodeInfo;