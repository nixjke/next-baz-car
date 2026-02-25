'use client'

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const attractionsData = [
  {
    name: "Сулакский каньон",
    description: "Один из самых глубоких каньонов в мире, поражающий своими масштабами и красотой.",
    imageKey: "sulak-canyon",
    src: "/attractions/sulaksky-kanyon.webp",
    accentColor: "hsl(190, 70%, 50%)" 
  },
  {
    name: "Дербентская крепость Нарын-Кала",
    description: "Древняя цитадель, входящая в список Всемирного наследия ЮНЕСКО.",
    imageKey: "naryn-kala",
    src: "/attractions/derbent.webp",
    accentColor: "hsl(30, 70%, 50%)"
  },
  {
    name: "Аул-призрак Гамсутль",
    description: "Заброшенное высокогорное село с уникальной архитектурой и атмосферой.",
    imageKey: "gamsutl",
    src: "/attractions/gamsutl.webp",
    accentColor: "hsl(70, 30%, 45%)"
  },
  {
    name: "Бархан Сарыкум",
    description: "Уникальный песчаный массив, крупнейший в Европе, кусочек пустыни среди гор.",
    imageKey: "sarykum",
    src: "/attractions/barhan.webp",
    accentColor: "hsl(40, 80%, 60%)"
  },
  {
    name: "Хунзахское плато и водопад Тобот",
    description: "Живописное плато с отвесными скалами и мощным водопадом.",
    imageKey: "tobot-waterfall",
    src: "/attractions/tabot.webp",
    accentColor: "hsl(220, 60%, 60%)"
  },
  {
    name: "Карадахская теснина",
    description: "Узкое и извилистое ущелье, создающее впечатление сказочного мира.",
    imageKey: "karadakh-gorge",
    src: "/attractions/kardah-tesina.webp",
    accentColor: "hsl(160, 40%, 40%)"
  }
];

const cardVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9, 
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 200, damping: 25 },
      opacity: { duration: 0.4, ease: "easeOut" as const },
      scale: { duration: 0.4, ease: "easeOut" as const },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9,
    zIndex: 0,
    transition: {
      x: { type: "spring" as const, stiffness: 200, damping: 25 },
      opacity: { duration: 0.3, ease: "easeIn" as const },
      scale: { duration: 0.3, ease: "easeIn" as const },
    },
  }),
};

const DagestanAttractions = () => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  const currentAttraction = attractionsData[page];

  const paginate = useCallback((newPage: number, newDirection: number) => {
    setPage([newPage, newDirection]);
  }, []);

  const changePage = (newDirection: number) => {
    let newPage = page + newDirection;
    if (newPage < 0) {
      newPage = attractionsData.length - 1;
    } else if (newPage >= attractionsData.length) {
      newPage = 0;
    }
    paginate(newPage, newDirection);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; 
    const velocityThreshold = 300;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x > 0) {
        changePage(-1); 
      } else {
        changePage(1); 
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <motion.section 
      className="py-20 bg-secondary overflow-hidden relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      style={{ "--accent-color": currentAttraction.accentColor } as React.CSSProperties}
    >
      <div className="absolute inset-0 transition-colors duration-700 ease-in-out" style={{ backgroundColor: "var(--accent-color)", opacity: 0.08 }}></div>
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div variants={itemVariants} className="flex items-center text-primary mb-2">
            <MapPin className="h-6 w-6 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">Откройте для себя</span>
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Куда поехать в Дагестане
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl px-2 sm:px-0">
            Исследуйте невероятные красоты и уникальные места Дагестана на автомобилях BazCar.
          </motion.p>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="relative w-full flex justify-center">
            <motion.div 
              className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(-1)}
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>

            <div className="w-[calc(100%-2rem)] max-w-[360px] sm:max-w-[420px] md:max-w-[450px] relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="relative bg-card rounded-xl shadow-2xl overflow-hidden border border-border/50 cursor-grab active:cursor-grabbing"
                >
                  <div className="w-full aspect-[16/10] sm:aspect-[3/2] overflow-hidden">
                    <img  
                      className="w-full h-full object-cover"
                      alt={currentAttraction.name} 
                      src={currentAttraction.src}
                      draggable="false"
                    />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
                      {currentAttraction.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {currentAttraction.description}
                    </p>
                    <div className="mt-3 text-xs text-primary font-semibold">
                      {page + 1} / {attractionsData.length}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div 
              className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer p-3 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(1)}
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>
          </div>

          <div className="mt-4 flex items-center gap-3 md:hidden">
            <motion.button
              type="button"
              className="cursor-pointer p-2.5 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(-1)}
              aria-label="Предыдущая локация"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>
            <motion.button
              type="button"
              className="cursor-pointer p-2.5 bg-card/80 backdrop-blur-sm rounded-full shadow-xl hover:bg-card transition-colors"
              onClick={() => changePage(1)}
              aria-label="Следующая локация"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default DagestanAttractions;