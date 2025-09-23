import React, { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import ConfirmationModal from './components/ConfirmationModal';
import { useBookingState } from './hooks/useBookingState';
import './App.css';

function App() {
  const [confirmationData, setConfirmationData] = useState(null);

  const {
    availableDates,
    bookedSlots,
    addAvailableDate,
    removeAvailableDate,
    bookSlot,
    isSlotBooked
  } = useBookingState();

  const closeConfirmation = () => {
    setConfirmationData(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>SmartSlot</h1>
        </div>
      </header>

      <main className="app-main">
        <AdminPanel
          availableDates={availableDates}
          onAddDate={addAvailableDate}
          onRemoveDate={removeAvailableDate}
          bookedSlots={bookedSlots}
        />
      </main>

      {confirmationData && (
        <ConfirmationModal
          booking={confirmationData}
          onClose={closeConfirmation}
        />
      )}
    </div>
  );
}

export default App;
