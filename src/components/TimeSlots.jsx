import React from 'react';
import { generateTimeSlots } from '../utils/timeUtils';
import './TimeSlots.css';

const TimeSlots = ({ selectedDate, selectedSlot, bookedSlots, onSlotSelect, isSlotBooked }) => {
  const timeSlots = generateTimeSlots();

  const handleSlotClick = (slot) => {
    if (!isSlotBooked(selectedDate, slot)) {
      onSlotSelect(slot);
    }
  };

  const getSlotClassName = (slot) => {
    let className = 'time-slot';
    
    if (isSlotBooked(selectedDate, slot)) {
      className += ' booked-slot';
    } else {
      className += ' available-slot';
      if (slot === selectedSlot) {
        className += ' selected-slot';
      }
    }
    
    return className;
  };

  const getSlotStatus = (slot) => {
    if (isSlotBooked(selectedDate, slot)) {
      return 'Booked';
    }
    if (slot === selectedSlot) {
      return 'Selected';
    }
    return 'Available';
  };

  return (
    <div className="time-slots">
      <div className="slots-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Booked</span>
        </div>
      </div>
      
      <div className="slots-grid">
        {timeSlots.map(slot => (
          <div
            key={slot}
            className={getSlotClassName(slot)}
            onClick={() => handleSlotClick(slot)}
            title={`${slot} - ${getSlotStatus(slot)}`}
          >
            <div className="slot-time">{slot}</div>
            <div className="slot-status">{getSlotStatus(slot)}</div>
          </div>
        ))}
      </div>
      
      {selectedSlot && (
        <div className="selected-slot-info">
          <strong>Selected Time: {selectedSlot}</strong>
          <p>Click "Complete Your Booking" below to proceed.</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlots;