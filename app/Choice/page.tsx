'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';

// Описываем тип данных, которые мы теперь ждем от FastAPI
interface Card {
  id: number;
  name: string;
  gender: string;
}

export default function Home() {
  // Изначально карточек нет, они грузятся с бэка
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  
  const activeCard = cards[0];

  const controls = useAnimation();
  const x = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // 1. Загрузка карточек (ID, имя, пол) с бэкенда при старте страницы
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://127.0.0');
        if (!response.ok) throw new Error('Ошибка загрузки карточек');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Не удалось загрузить анкеты:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // 2. Отправка решения (YES/NO) на бэкенд FastAPI
  const sendSwipeDecision = async (cardId: number, decision: 'YES' | 'NO') => {
    try {
      await fetch('http://127.0.0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardId,
          decision: decision,
        }),
      });
    } catch (error) {
      console.error('Ошибка при отправке свайпа на бэк:', error);
    }
  };

  const onSwipeLeft = (cardId: number) => {
    console.log(`ID(${cardId}): NO`);
    sendSwipeDecision(cardId, 'NO'); // отправляем в FastAPI
  };

  const onSwipeRight = (cardId: number) => {
    console.log(`ID(${cardId}): YES`);
    sendSwipeDecision(cardId, 'YES'); // отправляем в FastAPI
  };

  const removeTopCard = (direction: 'left' | 'right') => {
    if (!activeCard) return;

    if (direction === 'left') onSwipeLeft(activeCard.id);
    if (direction === 'right') onSwipeRight(activeCard.id);

    // Удаляем карточку, которую только что свайпнули
    setCards((prevCards) => prevCards.slice(1));

    controls.set({ x: 0, opacity: 1 });
  };

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 120;

    if (info.offset.x > threshold) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      removeTopCard('right');
    } else if (info.offset.x < -threshold) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      removeTopCard('left');
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  // Состояния загрузки и отсутствия карточек
  if (loading) {
    return (
      <main className="neon-main-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h3>Загрузка анкет...</h3>
      </main>
    );
  }

  if (cards.length === 0) {
    return (
      <main className="neon-main-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        <h3>Анкеты закончились! Приходите позже.</h3>
      </main>
    );
  }

  return (
    <main className="neon-main-layout">
      <div className="neon-app-container">
        <header className="neon-app-header">
          <Link href="/.." className="neon-btn-link">GL</Link>
        </header>

        <div style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          userSelect: 'none',
          background: 'radial-gradient(circle at center, #0b112c 0%, #05070f 100%)'
        }}>

          {activeCard && (
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '360px',
              height: '85vh',
              maxHeight: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1000px',
              boxSizing: 'border-box'
            }}>
              <motion.div
                key={activeCard.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                animate={controls}
                onDragEnd={handleDragEnd}
                whileDrag={{ cursor: "grabbing" }}
                style={{
                  x,
                  rotate,
                  opacity,
                  width: '100%',
                  height: '100%',
                  background: '#090d1a',
                  borderRadius: '24px',
                  boxShadow: '0 0 20px #0044ff, 0 0 40px rgba(0, 240, 255, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.2)',
                  border: '2px solid #00f0ff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'flex-start',
                  color: '#ffffff',
                  cursor: 'grab',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  touchAction: 'none'
                }}
              >
                {/* Верхняя часть (заглушка-градиент по умолчанию) */}
                <div style={{
                  width: '100%',
                  height: '65%',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #0d1530 0%, #05070f 100%)',
                  pointerEvents: 'none',
                  borderBottom: '2px solid #00f0ff',
                  boxShadow: '0 4px 15px rgba(0, 240, 255, 0.3)'
                }}>
                  {/* Если в будущем FastAPI начнет присылать imageUrl */}
                  {/* @ts-ignore */}
                  {activeCard.imageUrl && (
                    <Image
                      // @ts-ignore
                      src={activeCard.imageUrl}
                      alt={activeCard.name}
                      fill
                      sizes="(max-width: 480px) 100vw, 360px"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>

                {/* Нижняя текстовая часть карточки */}
                <div style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  textAlign: 'left',
                  pointerEvents: 'none',
                  flexGrow: 1,
                  justifyContent: 'center',
                  backgroundColor: '#060914'
                }}>
                  {/* Отображаем Имя с бэкенда */}
                  <h3 style={{
                    fontSize: '26px',
                    fontWeight: '900',
                    margin: 0,
                    color: '#ffffff',
                    textShadow: '0 0 2px #ffffff, 0 0 15px #00f0ff, 0 0 30px #0044ff',
                    letterSpacing: '0.5px'
                  }}>
                    {activeCard.name}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#8fa0dd',
                    margin: 0,
                    textShadow: '0 0 2px rgba(143, 160, 221, 0.3)'
                  }}>
                    Пол: {activeCard.gender === 'male' ? 'Мужской' : activeCard.gender === 'female' ? 'Женский' : activeCard.gender}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
