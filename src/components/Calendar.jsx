import React from 'react';
import { getNext30Days, formatDate, isPastDate } from '../utils/timeUtils';
import './Calendar.css';

const Calendar = ({ availableDates, selectedDate, onDateSelect }) => {
  const next30Days = getNext30Days();

  const handleDateClick = (date) => {
    if (availableDates.has(date) && !isPastDate(date)) {
      onDateSelect(date);
    }
  };

  const getDateClassName = (date) => {
    let className = 'calendar-date';
    
    if (isPastDate(date)) {
      className += ' past-date';
    } else if (availableDates.has(date)) {
      className += ' available-date';
      if (date === selectedDate) {
        className += ' selected-date';
      }
    } else {
      className += ' unavailable-date';
    }
    
    return className;
  };

  return (
    <div className="calendar">
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        {next30Days.map(date => {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = dateObj.getDate();
          const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
          
          return (
            <div
              key={date}
              className={getDateClassName(date)}
              onClick={() => handleDateClick(date)}
              title={formatDate(date)}
            >
              <div className="date-header">
                <span className="day-name">{dayName}</span>
                <span className="month-name">{monthName}</span>
              </div>
              <div className="day-number">{dayNumber}</div>
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="selected-date-info">
          <strong>Selected: {formatDate(selectedDate)}</strong>
        </div>
      )}
    </div>
  );
};

export default Calendar;