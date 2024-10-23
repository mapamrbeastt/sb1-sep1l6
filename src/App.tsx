import React, { useState, useEffect } from 'react';
import { Settings, Info } from 'lucide-react';
import Config from './components/Config';
import Navbar from './components/Navbar';
import MiningScene from './components/MiningScene';
import TasksScene from './components/TasksScene';
import TokenInfoScene from './components/TokenInfoScene';
import FriendsScene from './components/FriendsScene';
import HomeScene from './components/HomeScene';
import ErrorBoundary from './components/ErrorBoundary';
import LevelUpPopup from './components/LevelUpPopup';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [coins, setCoins] = useState(0);
  const [miningRate, setMiningRate] = useState(1);
  const [currentScene, setCurrentScene] = useState('home');
  const [showNavbar, setShowNavbar] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppDisabled, setIsAppDisabled] = useState(false);
  const [tickets, setTickets] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#81d4fa');

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) => prevCoins + miningRate);
    }, 1000);
    return () => clearInterval(interval);
  }, [miningRate]);

  useEffect(() => {
    const updateBackgroundColor = () => {
      let newColor = '#81d4fa';
      let progress = 0;
      let newLevel = 1;

      if (coins < 1000) {
        newColor = interpolateColor('#81d4fa', '#a3e1ff', coins / 1000);
        progress = (coins / 1000) * 100;
        newLevel = 1;
      } else if (coins < 5000) {
        newColor = interpolateColor(
          '#25b6ee',
          '#48caff',
          (coins - 1000) / 4000
        );
        progress = ((coins - 1000) / 4000) * 100;
        newLevel = 2;
      } else if (coins < 10000) {
        newColor = interpolateColor(
          '#4caf50',
          '#6cd96f',
          (coins - 5000) / 5000
        );
        progress = ((coins - 5000) / 5000) * 100;
        newLevel = 3;
      } else if (coins < 30000) {
        newColor = interpolateColor(
          '#e8cd3f',
          '#f3e064',
          (coins - 10000) / 20000
        );
        progress = ((coins - 10000) / 20000) * 100;
        newLevel = 4;
      } else if (coins < 100000) {
        newColor = interpolateColor(
          '#9a13f8',
          '#b139ff',
          (coins - 30000) / 70000
        );
        progress = Math.min(((coins - 30000) / 70000) * 100, 100);
        newLevel = 5;
      } else {
        newColor = '#b139ff';
        progress = 100;
        newLevel = 5;
      }

      setBackgroundColor(newColor);
      setLevelProgress(progress);

      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        setShowLevelUp(true);
        setShowNavbar(false);
        setIsAppDisabled(true);
        playSound('level-up');
      }
    };

    updateBackgroundColor();
  }, [coins, currentLevel]);

  useEffect(() => {
    console.log('Iniciando carga...');
    const timer = setTimeout(() => {
      console.log('Carga completada');
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const showTopBar = !['mining', 'tasks', 'friends'].includes(currentScene);

  const getCharacterImage = () => {
    if (currentLevel >= 5) return 'https://i.ibb.co/72fNh7F/lv5.png';
    if (currentLevel >= 4) return 'https://i.ibb.co/N9Bc1b6/lv4.png';
    if (currentLevel >= 3) return 'https://i.ibb.co/j52pYWw/lv3.png';
    if (currentLevel >= 2) return 'https://i.ibb.co/L6WD8md/lv2.png';
    return 'https://i.ibb.co/zs4W2SP/lv1.png';
  };

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  };

  const renderScene = () => {
    switch (currentScene) {
      case 'home':
        return (
          <HomeScene
            coins={coins}
            setCoins={setCoins}
            setCurrentScene={setCurrentScene}
            miningRate={miningRate}
            backgroundColor={backgroundColor}
            level={currentLevel}
            progress={levelProgress}
            tickets={tickets}
            setTickets={setTickets}
          />
        );
      case 'mining':
        return (
          <MiningScene
            coins={coins}
            setCoins={setCoins}
            miningRate={miningRate}
            setMiningRate={setMiningRate}
          />
        );
      case 'tasks':
        return <TasksScene coins={coins} setCoins={setCoins} />;
      case 'friends':
        return <FriendsScene coins={coins} setCoins={setCoins} />;
      case 'tokenInfo':
        return <TokenInfoScene setCurrentScene={setCurrentScene} />;
      case 'config':
        return <Config onClose={() => setCurrentScene('home')} />;
      default:
        return (
          <HomeScene
            coins={coins}
            setCoins={setCoins}
            setCurrentScene={setCurrentScene}
            miningRate={miningRate}
            backgroundColor={backgroundColor}
            level={currentLevel}
            progress={levelProgress}
            tickets={tickets}
            setTickets={setTickets}
          />
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div
        className="h-screen flex flex-col items-center p-4 overflow-hidden"
        style={{ backgroundColor }}
      >
        {showTopBar && currentScene !== 'tokenInfo' && !isAppDisabled && (
          <div className="w-full flex justify-between items-center mb-2">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentScene('config')}
                className="text-white mr-2"
              >
                <Settings size={24} />
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setCurrentScene('tokenInfo')}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <Info className="mr-2" size={18} />
                Acerca del Token
              </button>
            </div>
          </div>
        )}
        <div
          className={`w-full max-w-md flex-grow ${
            isAppDisabled ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {renderScene()}
        </div>
        {showNavbar && currentScene !== 'tokenInfo' && !isAppDisabled && (
          <Navbar
            setCurrentScene={setCurrentScene}
            currentScene={currentScene}
          />
        )}
        {showLevelUp && (
          <LevelUpPopup
            level={currentLevel}
            skinUrl={getCharacterImage()}
            onClose={() => {
              setShowLevelUp(false);
              setShowNavbar(true);
              setIsAppDisabled(false);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

// Helper function to interpolate colors
function interpolateColor(color1: string, color2: string, factor: number) {
  const result = color1
    .slice(1)
    .match(/.{2}/g)!
    .map((hex, i) => {
      const int1 = parseInt(hex, 16);
      const int2 = parseInt(color2.slice(1).match(/.{2}/g)![i], 16);
      const int = Math.round(int1 * (1 - factor) + int2 * factor);
      return int.toString(16).padStart(2, '0');
    })
    .join('');
  return `#${result}`;
}

export default App;