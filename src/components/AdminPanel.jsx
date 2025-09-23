import React, { useState } from 'react';
import { getNext30Days, formatDate, isPastDate } from '../utils/timeUtils';
import TimeRangeModal from './TimeRangeModal';
import './AdminPanel.css';

const AdminPanel = ({ availableDates, onAddDate, onRemoveDate, bookedSlots }) => {
  const [pendingDates, setPendingDates] = useState(new Set());
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDateForTime, setSelectedDateForTime] = useState(null);
  const [dateTimeRanges, setDateTimeRanges] = useState(new Map());
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get calendar dates for the current month/year view
  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    
    // Generate only the dates for this specific month (1st to last day)
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getCurrentMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const canNavigatePrevious = () => {
    const currentViewMonth = currentDate.getMonth();
    const currentViewYear = currentDate.getFullYear();
    
    // Can only go back if we're viewing a month after the current month
    return currentViewYear > currentYear || 
           (currentViewYear === currentYear && currentViewMonth > currentMonth);
  };

  const handleDateClick = (date) => {
    if (isPastDate(date)) return;
    
    const isAvailable = availableDates.has(date);
    const isPending = pendingDates.has(date);
    
    if (isAvailable) {
      // If already available, remove it
      onRemoveDate(date);
      setDateTimeRanges(prev => {
        const newRanges = new Map(prev);
        newRanges.delete(date);
        return newRanges;
      });
    } else if (isPending) {
      // If pending, remove from pending
      setPendingDates(prev => {
        const newPending = new Set(prev);
        newPending.delete(date);
        return newPending;
      });
    } else {
      // Add to pending
      setPendingDates(prev => new Set([...prev, date]));
    }
  };

  const handleConfirmDates = () => {
    pendingDates.forEach(date => {
      onAddDate(date);
    });
    setPendingDates(new Set());
  };

  const handleCancelPendingDates = () => {
    setPendingDates(new Set());
  };

  const handleDateTimeClick = (date) => {
    setSelectedDateForTime(date);
    setShowTimeModal(true);
  };

  const handleTimeRangeConfirm = (timeRange) => {
    setDateTimeRanges(prev => new Map(prev.set(selectedDateForTime, timeRange)));
    setShowTimeModal(false);
    setSelectedDateForTime(null);
  };

  const handleAddDate = (date) => {
    if (date && !isPastDate(date)) {
      onAddDate(date);
    }
  };

  const handleRemoveDate = (date) => {
    onRemoveDate(date);
  };

  const getBookingsForDate = (date) => {
    const dateSlots = bookedSlots.get(date);
    return dateSlots ? Array.from(dateSlots.entries()) : [];
  };

  const getTotalBookings = () => {
    let total = 0;
    bookedSlots.forEach(dateSlots => {
      total += dateSlots.size;
    });
    return total;
  };

  const getAvailableDatesArray = () => {
    return Array.from(availableDates).sort();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage available dates and view bookings</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{availableDates.size}</div>
          <div className="stat-label">Available Dates</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getTotalBookings()}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{bookedSlots.size}</div>
          <div className="stat-label">Dates with Bookings</div>
        </div>
      </div>

      <div className="admin-section">
        <h3>Add Available Dates</h3>
        <p className="section-description">Click on dates below to select them, then confirm your selection</p>
        
        <div className="admin-calendar">
          {/* Calendar Navigation */}
          <div className="calendar-navigation">
            <div className="nav-controls">
              <button 
                className={`nav-btn month-nav ${!canNavigatePrevious() ? 'disabled' : ''}`}
                onClick={() => navigateMonth(-1)}
                disabled={!canNavigatePrevious()}
                title={canNavigatePrevious() ? "Previous Month" : "Cannot go to past months"}
              >
                ←
              </button>
              
              <div className="current-month-year">
                <span className="month-year-text">{getCurrentMonthYear()}</span>
              </div>
              
              <button 
                className="nav-btn month-nav"
                onClick={() => navigateMonth(1)}
                title="Next Month"
              >
                →
              </button>
            </div>
          </div>

          <div className="admin-calendar-legend">
            <div className="legend-item">
              <span className="legend-color available"></span>
              <span>Available for booking</span>
            </div>
            <div className="legend-item">
              <span className="legend-color pending"></span>
              <span>Pending selection</span>
            </div>
            <div className="legend-item">
              <span className="legend-color clickable"></span>
              <span>Click to select</span>
            </div>
            <div className="legend-item">
              <span className="legend-color past"></span>
              <span>Past dates</span>
            </div>
          </div>
          
          <div className="admin-calendar-grid">
            {getCalendarDates().map(date => {
              const dateObj = new Date(date + 'T00:00:00'); // Add time to avoid timezone issues
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = dateObj.getDate();
              const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
              const isAvailable = availableDates.has(date);
              const isPending = pendingDates.has(date);
              const isPast = isPastDate(date);
              
              return (
                <div
                  key={date}
                  className={`admin-calendar-date ${
                    isPast ? 'past-date' : 
                    isAvailable ? 'available-date' : 
                    isPending ? 'pending-date' :
                    'clickable-date'
                  }`}
                  onClick={() => handleDateClick(date)}
                  title={
                    isPast ? 'Past date' :
                    isAvailable ? `Click to remove ${formatDate(date)}` : 
                    isPending ? `Click to unselect ${formatDate(date)}` :
                    `Click to select ${formatDate(date)}`
                  }
                >
                  <div className="date-header">
                    <span className="day-name">{dayName}</span>
                    <span className="month-name">{monthName}</span>
                  </div>
                  <div className="day-number">{dayNumber}</div>
                  {isAvailable && !isPast && (
                    <div className="date-status">Available</div>
                  )}
                  {isPending && !isPast && (
                    <div className="date-status pending">Selected</div>
                  )}
                </div>
              );
            })}
          </div>
          
          {pendingDates.size > 0 && (
            <div className="confirmation-section">
              <div className="pending-info">
                <strong>{pendingDates.size} date{pendingDates.size !== 1 ? 's' : ''} selected</strong>
                <p>Review your selection and confirm to make these dates available for booking</p>
              </div>
              <div className="confirmation-buttons">
                <button
                  onClick={handleCancelPendingDates}
                  className="btn btn-cancel"
                >
                  Cancel Selection
                </button>
                <button
                  onClick={handleConfirmDates}
                  className="btn btn-confirm"
                >
                  Confirm Dates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h3>Available Dates Summary</h3>
        {getAvailableDatesArray().length === 0 ? (
          <p className="empty-state">No available dates. Click on dates in the calendar above to add them.</p>
        ) : (
          <div className="available-dates-summary">
            <p className="section-description">Click on any date to set custom time ranges</p>
            <div className="summary-grid">
              {getAvailableDatesArray().map(date => {
                const bookings = getBookingsForDate(date);
                const timeRange = dateTimeRanges.get(date);
                return (
                  <div 
                    key={date} 
                    className="date-summary-item clickable"
                    onClick={() => handleDateTimeClick(date)}
                    title={`Click to set time range for ${formatDate(date)}`}
                  >
                    <div className="date-info">
                      <div className="date-name">{formatDate(date)}</div>
                      <div className="date-stats">
                        {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                      </div>
                      {timeRange && (
                        <div className="time-range">
                          ⏰ {timeRange.from} - {timeRange.to}
                        </div>
                      )}
                      {!timeRange && (
                        <div className="time-range default">
                          ⏰ All day (12:00 AM - 11:30 PM)
                        </div>
                      )}
                    </div>
                    <div className="click-indicator">
                      <span>⚙️</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="admin-section">
        <h3>All Bookings</h3>
        {getTotalBookings() === 0 ? (
          <p className="empty-state">No bookings yet.</p>
        ) : (
          <div className="bookings-list">
            {Array.from(bookedSlots.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, dateSlots]) => (
                <div key={date} className="booking-date-group">
                  <h4 className="booking-date-header">{formatDate(date)}</h4>
                  <div className="booking-slots">
                    {Array.from(dateSlots.entries())
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([time, booking]) => (
                        <div key={time} className="booking-item">
                          <div className="booking-time">{time}</div>
                          <div className="booking-details">
                            <div className="booking-name">{booking.name}</div>
                            <div className="booking-email">{booking.email}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {showTimeModal && selectedDateForTime && (
        <TimeRangeModal
          date={selectedDateForTime}
          currentTimeRange={dateTimeRanges.get(selectedDateForTime)}
          onConfirm={handleTimeRangeConfirm}
          onCancel={() => {
            setShowTimeModal(false);
            setSelectedDateForTime(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;