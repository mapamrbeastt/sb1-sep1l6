import React, { useState, useEffect } from 'react';
import { X, RefreshCw, MousePointer, Zap } from 'lucide-react';

interface WalletPopupProps {
  onClose: () => void;
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  addExtraClicks: (amount: number) => void;
  extraClicks: number;
}

const WalletPopup: React.FC<WalletPopupProps> = ({
  onClose,
  coins,
  setCoins,
  addExtraClicks,
  extraClicks,
}) => {
  const [hasPlus3Booster, setHasPlus3Booster] = useState(false);
  const [hasPlus7Booster, setHasPlus7Booster] = useState(false);
  const [nextFreeClickTime, setNextFreeClickTime] = useState<number | null>(null);

  useEffect(() => {
    const storedTime = localStorage.getItem('nextFreeClickTime');
    if (storedTime) {
      setNextFreeClickTime(parseInt(storedTime, 10));
    }

    const storedPlus3 = localStorage.getItem('hasPlus3Booster');
    if (storedPlus3) {
      setHasPlus3Booster(JSON.parse(storedPlus3));
    }

    const storedPlus7 = localStorage.getItem('hasPlus7Booster');
    if (storedPlus7) {
      setHasPlus7Booster(JSON.parse(storedPlus7));
    }
  }, []);

  useEffect(() => {
    if (nextFreeClickTime) {
      localStorage.setItem('nextFreeClickTime', nextFreeClickTime.toString());
    }
  }, [nextFreeClickTime]);

  const handlePlus3Purchase = () => {
    if (coins >= 3000 && !hasPlus3Booster) {
      setCoins(prevCoins => prevCoins - 3000);
      setHasPlus3Booster(true);
      localStorage.setItem('hasPlus3Booster', 'true');
      addExtraClicks(3);
      playSound('upgrade');
    }
  };

  const handlePlus7Purchase = () => {
    if (coins >= 7000 && hasPlus3Booster && !hasPlus7Booster) {
      setCoins(prevCoins => prevCoins - 7000);
      setHasPlus7Booster(true);
      localStorage.setItem('hasPlus7Booster', 'true');
      addExtraClicks(7);
      playSound('upgrade');
    }
  };

  const handleFreeClicks = () => {
    const now = Date.now();
    if (!nextFreeClickTime || now >= nextFreeClickTime) {
      addExtraClicks(7);
      setNextFreeClickTime(now + 24 * 60 * 60 * 1000); // 24 hours from now
      playSound('free-clicks');
    }
  };

  const getTimeRemaining = () => {
    if (!nextFreeClickTime) return '00:00:00';
    const now = Date.now();
    const remaining = Math.max(0, nextFreeClickTime - now);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Potenciadores</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Gratis</h3>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              onClick={handleFreeClicks}
              disabled={nextFreeClickTime && Date.now() < nextFreeClickTime}
            >
              <RefreshCw size={20} className="mr-2" />
              <span>Recarga 7 clicks, cada 24 hs</span>
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">{getTimeRemaining()} restantes</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Potenciadores de pago</h3>
            <button
              className={`w-full mb-2 ${
                coins >= 3000 && !hasPlus3Booster
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white font-bold py-2 px-4 rounded flex items-center justify-center`}
              onClick={handlePlus3Purchase}
              disabled={coins < 3000 || hasPlus3Booster}
            >
              <MousePointer size={20} className="mr-2" />
              <span>+3 Clicks Extra</span>
              <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Crypto" className="w-5 h-5 ml-2 mr-1" />
              <span>3000</span>
            </button>
            <button
              className={`w-full ${
                coins >= 7000 && hasPlus3Booster && !hasPlus7Booster
                  ? 'bg-purple-500 hover:bg-purple-600'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white font-bold py-2 px-4 rounded flex items-center justify-center`}
              onClick={handlePlus7Purchase}
              disabled={coins < 7000 || !hasPlus3Booster || hasPlus7Booster}
            >
              <Zap size={20} className="mr-2" />
              <span>+7 Clicks Extra</span>
              <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Crypto" className="w-5 h-5 ml-2 mr-1" />
              <span>7000</span>
            </button>
            {hasPlus3Booster && <p className="text-sm text-green-600 mt-2">¡Potenciador +3 activo!</p>}
            {hasPlus7Booster && <p className="text-sm text-purple-600 mt-2">¡Potenciador +7 activo!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPopup;