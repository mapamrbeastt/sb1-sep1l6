import React, { useState, useEffect } from 'react';
import { Pickaxe, Rocket } from 'lucide-react';

interface MiningSceneProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  miningRate: number;
  setMiningRate: React.Dispatch<React.SetStateAction<number>>;
}

interface MiningCard {
  id: number;
  name: string;
  levels: number[];
  prices: number[];
  currentLevel: number;
  production: number;
  image: string;
}

const initialCards: MiningCard[] = [
  { id: 1, name: "Minero Novato", levels: [10, 15, 25], prices: [1000, 2000, 4000], currentLevel: 0, production: 0, image: "https://i.ibb.co/K0pBF5q/minero-1.png" },
  { id: 2, name: "Minero Avanzado", levels: [30, 35, 45], prices: [5000, 7000, 10000], currentLevel: 0, production: 0, image: "https://i.ibb.co/DfVyTRm/fsddss.png" },
  { id: 3, name: "Minero Experto", levels: [50, 55, 65], prices: [12000, 15000, 20000], currentLevel: 0, production: 0, image: "https://i.ibb.co/9r9nJs4/minero-3.png" },
  { id: 4, name: "Minero Maestro", levels: [70, 75, 100], prices: [22000, 25000, 30000], currentLevel: 0, production: 0, image: "https://i.ibb.co/qrp84Qh/minero-4.png" },
];

const MiningScene: React.FC<MiningSceneProps> = ({ coins, setCoins, miningRate, setMiningRate }) => {
  const [cards, setCards] = useState<MiningCard[]>(() => {
    const savedCards = localStorage.getItem('miningCards');
    return savedCards ? JSON.parse(savedCards) : initialCards;
  });
  const [lastUpgradeTime, setLastUpgradeTime] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem('miningCards', JSON.stringify(cards));
    const totalProduction = cards.reduce((total, card) => total + card.production, 0);
    setMiningRate(totalProduction / 3600); // Convertir producción por hora a por segundo
  }, [cards, setMiningRate]);

  const handleUpgrade = (cardId: number) => {
    const now = Date.now();
    if (now - lastUpgradeTime < 5000) {
      alert("Por favor, espera 5 segundos entre mejoras.");
      return;
    }

    setCards(prevCards => prevCards.map(card => {
      if (card.id === cardId && card.currentLevel < 3) {
        const nextLevel = card.currentLevel + 1;
        const upgradeCost = card.prices[card.currentLevel];
        if (coins >= upgradeCost) {
          setCoins(prevCoins => prevCoins - upgradeCost);
          const newProduction = card.levels[card.currentLevel];
          setLastUpgradeTime(now);
          playSound('upgrade');
          return { 
            ...card, 
            currentLevel: nextLevel, 
            production: card.production + newProduction 
          };
        }
      }
      return card;
    }));
  };

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  };

  const usdtAmount = (coins / 100).toFixed(2); // 100 puntos = 1$ USDT

  return (
    <div className="w-full max-w-md">
      <div className="bg-white bg-opacity-80 rounded-lg p-4 w-full mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Coin" className="w-6 h-6 mr-2" />
            <span className="text-2xl font-bold text-black">{coins.toFixed(2)}</span>
          </div>
       
          <div className="flex items-center bg-white px-2 py-1 rounded">
            <Pickaxe size={14} className="text-yellow-500 mr-1" />
            <span className="text-sm text-black">{Math.floor(miningRate * 3600)} / total x hora</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(card => (
          <div key={card.id} className="bg-white rounded-lg p-2">
            <h3 className="text-sm font-bold text-black mb-1 text-center">{card.name}</h3>
            <div className="w-full h-24 flex items-center justify-center mb-2">
              <img src={card.image} alt={card.name} className="max-w-full max-h-full object-contain scale-120" />
            </div>
            <p className="text-xs text-black mb-1">
              Nivel: {card.currentLevel} / 3
            </p>
            <p className="text-xs text-black mb-1">
              Producción: {card.production} /hora
            </p>
            {card.currentLevel < 3 ? (
              <>
                <p className="text-xs text-black mb-1">
                  Mejora: +{card.levels[card.currentLevel]} /hora
                </p>
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded w-full ${coins < card.prices[card.currentLevel] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleUpgrade(card.id)}
                  disabled={coins < card.prices[card.currentLevel]}
                >
                  {coins < card.prices[card.currentLevel] ? (
                    <span className="flex items-center justify-center">
                      Insuficiente 
                      <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Coin" className="w-4 h-4 ml-1 mr-1" />
                      {card.prices[card.currentLevel]}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Comprar
                      <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Coin" className="w-4 h-4 ml-1 mr-1" />
                      {card.prices[card.currentLevel]}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <div className="mt-4" style={{ marginTop: 'calc(1rem + 0.12cm)' }}>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-2 rounded w-full flex items-center justify-center"
                  disabled
                >
                  Minero al máximo <Rocket size={16} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiningScene;