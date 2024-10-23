import React, { useState } from 'react';
import { Users, Share2 } from 'lucide-react';

interface FriendsSceneProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
}

const FriendsScene: React.FC<FriendsSceneProps> = ({ coins, setCoins }) => {
  const [referralCode, setReferralCode] = useState('ABC123'); // Este código debería generarse dinámicamente

  const handleInvite = () => {
    // Aquí iría la lógica para compartir el código de referido
    alert(`Comparte tu código de referido: ${referralCode}`);
  };

  const playSound = (soundName: string) => {
    const audio = new Audio(`/sounds/${soundName}.mp3`);
    audio.play();
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-black mb-4">Invita y gana</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-black mb-2">Beneficios</h3>
        <ul className="list-disc list-inside text-black">
          <li className="flex items-center">
            <img src="https://i.ibb.co/Q9NNLK5/tu-ruta-moneda-amarilla.png" alt="Crypto" className="w-5 h-5 mr-2" />
            Gana 300 por cada amigo que invites
          </li>
          <li>5% de bonus en tu tasa de minería por cada amigo</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-black mb-2">Tu Código de Referido</h3>
        <div className="flex items-center justify-between bg-gray-100 rounded p-2">
          <span className="text-black font-mono">{referralCode}</span>
          <button 
            onClick={() => {
              handleInvite();
              playSound('invite');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded flex items-center"
          >
            <Share2 size={16} className="mr-1" />
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsScene;