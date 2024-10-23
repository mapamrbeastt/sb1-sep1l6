import React from 'react';
import { X, Ticket } from 'lucide-react';

interface TicketPopupProps {
  onClose: () => void;
  tickets: number;
}

const TicketPopup: React.FC<TicketPopupProps> = ({ onClose, tickets }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tus Tickets</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center justify-center mb-4">
          <Ticket size={48} className="text-yellow-500 mr-4" />
          <span className="text-4xl font-bold">{tickets}</span>
        </div>
        <p className="text-center">
          Tienes {tickets} ticket{tickets !== 1 ? 's' : ''} para participar en sorteos y eventos especiales.
        </p>
        {/* Aquí puedes agregar más información sobre cómo usar los tickets */}
      </div>
    </div>
  );
};

export default TicketPopup;