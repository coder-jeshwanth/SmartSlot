import React, { useState } from 'react';
import { formatDate, generateTimeSlots } from '../utils/timeUtils';
import './TimeRangeModal.css';

const TimeRangeModal = ({ date, currentTimeRange, onConfirm, onCancel }) => {
  const timeSlots = generateTimeSlots();
  const [fromTime, setFromTime] = useState(currentTimeRange?.from || '12:00 AM');
  const [toTime, setToTime] = useState(currentTimeRange?.to || '11:30 PM');
  const [error, setError] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const validateTimeRange = () => {
    const fromIndex = timeSlots.indexOf(fromTime);
    const toIndex = timeSlots.indexOf(toTime);
    
    if (fromIndex >= toIndex) {
      setError('End time must be after start time');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleConfirm = () => {
    if (validateTimeRange()) {
      onConfirm({ from: fromTime, to: toTime });
    }
  };

  const handleFromChange = (newFromTime) => {
    setFromTime(newFromTime);
    setError('');
  };

  const handleToChange = (newToTime) => {
    setToTime(newToTime);
    setError('');
  };

  const getAvailableToTimes = () => {
    const fromIndex = timeSlots.indexOf(fromTime);
    return timeSlots.slice(fromIndex + 1);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="time-modal-content">
        <div className="time-modal-header">
          <h2>Set Time Range</h2>
          <p>Configure available hours for {formatDate(date)}</p>
        </div>
        
        <div className="time-modal-body">
          <div className="time-range-form">
            <div className="time-input-group">
              <label htmlFor="from-time" className="time-label">
                From Time
              </label>
              <select
                id="from-time"
                value={fromTime}
                onChange={(e) => handleFromChange(e.target.value)}
                className="time-select"
              >
                {timeSlots.slice(0, -1).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="time-separator">
              <span>to</span>
            </div>

            <div className="time-input-group">
              <label htmlFor="to-time" className="time-label">
                To Time
              </label>
              <select
                id="to-time"
                value={toTime}
                onChange={(e) => handleToChange(e.target.value)}
                className="time-select"
              >
                {getAvailableToTimes().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="time-preview">
            <h4>Preview</h4>
            <p>Available slots will be generated from <strong>{fromTime}</strong> to <strong>{toTime}</strong></p>
            <p className="slots-count">
              This will create approximately {Math.max(0, timeSlots.indexOf(toTime) - timeSlots.indexOf(fromTime))} time slots
            </p>
          </div>
        </div>
        
        <div className="time-modal-footer">
          <button 
            className="btn btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleConfirm}
          >
            Confirm Time Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeModal;