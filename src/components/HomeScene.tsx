import React, { useState } from 'react';
import Character from './Character';
import { Wallet, Zap, Gift, Ticket, Pickaxe } from 'lucide-react';
import WalletPopup from './WalletPopup';
import BoostersPopup from './BoostersPopup';
import RewardsPopup from './RewardsPopup';
import TicketPopup from './TicketPopup';

interface HomeSceneProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  setCurrentScene: React.Dispatch<React.SetStateAction<string>>;
  miningRate: number;
  backgroundColor: string;
  level: number;
  progress: number;
  tickets: number;
  setTickets: React.Dispatch<React.SetStateAction<number>>;
}

const HomeScene: React.FC<HomeSceneProps> = ({
  coins,
  setCoins,
  setCurrentScene,
  miningRate,
  backgroundColor,
  level,
  progress,
  tickets,
  setTickets,
}) => {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [showBoostersPopup, setShowBoostersPopup] = useState(false);
  const [showRewardsPopup, setShowRewardsPopup] = useState(false);
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [extraClicks, setExtraClicks] = useState(0);

  const addCoins = (amount: number) => {
    setCoins((prevCoins) => prevCoins + amount);
    setTickets((prevTickets) => prevTickets + 1);
    playSound('coin');
  };

  const addExtraClicks = (amount: number) => {
    setExtraClicks((prev) => prev + amount);
  };

  const usdtAmount = (coins / 100).toFixed(2); // 100 puntos = 1$ USDT

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  };

  return (
    <div className="flex flex-col top-10 items-center justify-center relative ">
      <div className="absolute top-4 left-2 right-2 flex justify-between items-center bg-white bg-opacity-80 rounded-lg p-2">
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/fCJCdsy/pngwing-com-34.png"
            alt="USDT"
            className="w-4 h-4 mr-1"
          />
          <span className="text-sm">{usdtAmount} USDT</span>
        </div>
        <div className="flex items-center">
          <img
            src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png"
            alt="Coin"
            className="w-6 h-6 mr-2"
          />
          <span className="text-xl font-bold">{coins.toFixed(2)}</span>
        </div>
        <div className="flex items-center text-sm">
          <Pickaxe size={16} className="mr-1" />
          <span className="font-bold">{(miningRate * 3600).toFixed(2)}</span>
          /hora
        </div>
      </div>
    
      <div
        className="relative flex-grow flex items-center justify-center"
        style={{
          marginTop: 'calc(1.20cm + 1.2cm)',
          marginLeft: 'calc(-0.05cm)',
        }}
      >
        <Character
          addCoins={addCoins}
          coins={coins}
          miningRate={miningRate}
          level={level}
          progress={progress}
          extraClicks={extraClicks}
          setExtraClicks={setExtraClicks}
        />

        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4"
          style={{ marginTop: 'calc(-0.200cm)', right: 'calc(-1cm)' }}
        >
          <button
            onClick={() => setShowWalletPopup(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            <Wallet size={24} />
          </button>
          <button
            onClick={() => setShowBoostersPopup(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            <Zap size={24} />
          </button>
          <button
            onClick={() => setShowRewardsPopup(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            <Gift size={24} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowTicketPopup(true)}
        className="absolute left-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-9 rounded-full flex items-center"
     style={{ top: 'calc(2.1cm + 1rem)', left: 'calc(4.1cm + -8rem)' }}
      >
        <Ticket size={18} className="mr-1" />
        {tickets}
      </button>

      {showWalletPopup && (
        <WalletPopup
          onClose={() => setShowWalletPopup(false)}
          coins={coins}
          setCoins={setCoins}
          addExtraClicks={addExtraClicks}
          extraClicks={extraClicks}
        />
      )}
      {showBoostersPopup && (
        <BoostersPopup onClose={() => setShowBoostersPopup(false)} />
      )}
      {showRewardsPopup && (
        <RewardsPopup onClose={() => setShowRewardsPopup(false)} />
      )}
      {showTicketPopup && (
        <TicketPopup onClose={() => setShowTicketPopup(false)} tickets={tickets} />
      )}
    </div>
  );
};

export default HomeScene;