import React, { useState, useEffect } from 'react';
import { getNext30Days, formatDate, isPastDate } from '../utils/timeUtils';
import { RefreshCw } from 'lucide-react';
import TimeRangeModal from './TimeRangeModal';
import CustomerDetailsModal from './CustomerDetailsModal';
import './AdminPanel.css';;

const AdminPanel = ({ availableDates, onAddDate, onRemoveDate, bookedSlots }) => {
  const [pendingDates, setPendingDates] = useState(new Set());
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDateForTime, setSelectedDateForTime] = useState(null);
  const [dateTimeRanges, setDateTimeRanges] = useState(new Map());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [createdSlots, setCreatedSlots] = useState(new Set());
  const [createdSlotsData, setCreatedSlotsData] = useState(new Map()); // Store date -> {id, date} mapping
  const [bookingsData, setBookingsData] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isRefreshingBookings, setIsRefreshingBookings] = useState(false);
  
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
    
    // Prevent selection of dates that already have created slots
    if (createdSlots.has(date)) return;
    
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

  const handleCancelAllDates = () => {
    // Clear all available dates
    availableDates.forEach(date => {
      onRemoveDate(date);
    });
    // Clear pending dates
    setPendingDates(new Set());
    // Clear time ranges
    setDateTimeRanges(new Map());
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000); // Hide after 5 seconds
  };

  // Fetch created slots from API
  const fetchCreatedSlots = async () => {
    try {
      const response = await fetch('/api/admin/dates/simple');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched created slots data:', data);
      
      if (data.success && data.data.availableDates) {
        const createdDates = new Set(
          data.data.availableDates.map(item => item.date)
        );
        const createdDataMap = new Map(
          data.data.availableDates.map(item => [item.date, { 
            id: item.id, 
            date: item.date, 
            slotDuration: item.slotDuration || 30,
            startTime: item.startTime,
            endTime: item.endTime 
          }])
        );
        console.log('Created dates set:', createdDates);
        console.log('Created data map:', createdDataMap);
        setCreatedSlots(createdDates);
        setCreatedSlotsData(createdDataMap);
      }
    } catch (error) {
      console.error('Error fetching created slots:', error);
      // Don't show toast for this error as it's not user-initiated
    }
  };

  // Fetch bookings data
  const fetchBookingsData = async () => {
    try {
      const response = await fetch('/api/admin/bookings/dates');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched bookings data:', data);
      
      if (data.success && data.data) {
        setBookingsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Don't show toast for this error as it's not user-initiated
    }
  };

  // Handle booking card click
  const handleBookingClick = (booking, date) => {
    setSelectedBooking({ ...booking, date });
    setShowCustomerModal(true);
  };

  // Refresh bookings data
  const handleRefreshBookings = async () => {
    setIsRefreshingBookings(true);
    try {
      await fetchBookingsData();
      showToastMessage('Bookings refreshed successfully', 'success');
    } catch (error) {
      showToastMessage('Failed to refresh bookings', 'error');
    } finally {
      setIsRefreshingBookings(false);
    }
  };

  // Delete a created slot
  const deleteCreatedSlot = async (slotId, date) => {
    try {
      console.log('Attempting to delete slot:', { slotId, date });
      setIsLoading(true);
      
      // Simple DELETE request without JSON body
      const response = await fetch(`/api/admin/dates/${slotId}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorDetails = '';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = JSON.stringify(errorData, null, 2);
          console.log('Delete error response JSON:', errorData);
        } catch (e) {
          try {
            errorDetails = await response.text();
            console.log('Delete error response text:', errorDetails);
          } catch (e2) {
            console.log('Could not read error response');
          }
        }
        
        // Handle specific status codes with more helpful messages
        if (response.status === 403) {
          throw new Error(`Access forbidden: ${errorMessage}`);
        } else if (response.status === 404) {
          throw new Error(`Slot not found: ${errorMessage}`);
        } else if (response.status === 405) {
          throw new Error(`Method not allowed: ${errorMessage}`);
        } else if (response.status === 500) {
          throw new Error(`Server error: There's an issue with the backend delete function. Please check the server logs.`);
        } else {
          throw new Error(`${errorMessage} (${response.status})`);
        }
      }

      const data = await response.json();
      console.log('Delete response data:', data);
      
      if (data.success) {
        showToastMessage(data.message, 'success');
        // Refetch created slots to update the calendar
        await fetchCreatedSlots();
      } else {
        showToastMessage(data.message || 'Failed to delete slot', 'error');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        showToastMessage('Unable to connect to server', 'error');
      } else if (error.message.includes('Cannot delete date with existing bookings')) {
        showToastMessage('Cannot delete date with existing bookings. Cancel bookings first.', 'error');
      } else if (error.message.includes('HTTP error')) {
        showToastMessage(`Server error: ${error.message}`, 'error');
      } else {
        // Extract the meaningful part of the error message
        const errorMessage = error.message.replace(/\s*\(\d+\)$/, ''); // Remove status code from end
        showToastMessage(errorMessage || 'Error occurred while deleting slot', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch created slots and bookings when component mounts
  useEffect(() => {
    fetchCreatedSlots();
    fetchBookingsData();
  }, []);

  // Convert 12-hour format (1:00 PM) to 24-hour format (13:00)
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "00:00";
    
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleConfirmBulkDates = async () => {
    if (availableDates.size === 0) {
      showToastMessage('No dates selected to confirm', 'warning');
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare the request payload
      const dates = Array.from(availableDates).map(date => {
        const timeRange = dateTimeRanges.get(date);
        return {
          date: date,
          startTime: timeRange?.from ? convertTo24Hour(timeRange.from) : "07:00",
          endTime: timeRange?.to ? convertTo24Hour(timeRange.to) : "21:00",
          slotDuration: timeRange?.slotDuration || 30, // Use selected duration or default 30 minutes
          notes: `Available slots for ${formatDate(date)} (${timeRange?.slotDuration || 30} min slots)`
        };
      });

      const requestBody = {
        dates: dates,
        skipExisting: true
      };

      console.log('Sending request to API:', requestBody);

      const response = await fetch('/api/admin/dates/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        showToastMessage(data.message, 'success');
        // Refetch created slots to update the calendar
        await fetchCreatedSlots();
        // Clear the dates after successful confirmation
        handleCancelAllDates();
      } else {
        showToastMessage(data.message || 'Failed to confirm dates', 'error');
      }
    } catch (error) {
      console.error('Error confirming dates:', error);
      
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        showToastMessage('Unable to connect to server. Please ensure the backend is running on http://localhost:5000', 'error');
      } else if (error.message.includes('HTTP error')) {
        showToastMessage(`Server error: ${error.message}`, 'error');
      } else {
        showToastMessage('Network error occurred while confirming dates', 'error');
      }
    } finally {
      setIsLoading(false);
    }
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

  const getTotalCreatedSlots = () => {
    return createdSlots.size;
  };

  const getTotalBookingsFromAPI = () => {
    return bookingsData ? bookingsData.summary.totalBookings : 0;
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
          <div className="stat-number">{getTotalCreatedSlots()}</div>
          <div className="stat-label">Total Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getTotalBookingsFromAPI()}</div>
          <div className="stat-label">Total Bookings</div>
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
              <span className="legend-color created"></span>
              <span>Slots already created</span>
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
              const isCreated = createdSlots.has(date);
              
              return (
                <div
                  key={date}
                  className={`admin-calendar-date ${
                    isPast ? 'past-date' : 
                    isCreated ? 'created-date' :
                    isAvailable ? 'available-date' : 
                    isPending ? 'pending-date' :
                    'clickable-date'
                  }`}
                  onClick={() => handleDateClick(date)}
                  title={
                    isPast ? 'Past date' :
                    isCreated ? `Slot already created for ${formatDate(date)} - Cannot modify` :
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
                  {isAvailable && !isPast && !isCreated && (
                    <div className="date-status">Available</div>
                  )}
                  {isPending && !isPast && !isCreated && (
                    <div className="date-status pending">Selected</div>
                  )}
                  {isCreated && !isPast && (
                    <div className="date-status-container">
                      <div className="date-status created">Created</div>
                      <button
                        className="delete-slot-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the date click
                          console.log('Delete button clicked for date:', date);
                          const slotData = createdSlotsData.get(date);
                          console.log('Slot data found:', slotData);
                          console.log('All created slots data:', createdSlotsData);
                          if (slotData) {
                            deleteCreatedSlot(slotData.id, date);
                          } else {
                            console.error('No slot data found for date:', date);
                            showToastMessage('Slot data not found for deletion', 'error');
                          }
                        }}
                        title="Delete this created slot"
                        disabled={isLoading}
                      >
                        🗑️
                      </button>
                    </div>
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
        <h3>Re check Selected Dates</h3>
        {getAvailableDatesArray().length === 0 ? (
          <p className="empty-state">No available dates. Click on dates in the calendar above to add them.</p>
        ) : (
          <div className="available-dates-summary">
            <p className="section-description">Click on any date to set custom time ranges</p>
            <div className="summary-grid">
              {getAvailableDatesArray().map(date => {
                const bookings = getBookingsForDate(date);
                const timeRange = dateTimeRanges.get(date);
                const isCreated = createdSlots.has(date);
                const createdSlotData = createdSlotsData.get(date);
                
                // Debug logging
                console.log(`Date ${date}:`, {
                  timeRange,
                  isCreated,
                  createdSlotData,
                  bookingsCount: bookings.length
                });
                
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
                        {timeRange && timeRange.slotDuration ? (
                          `${timeRange.slotDuration} min slots`
                        ) : isCreated && createdSlotData && createdSlotData.slotDuration ? (
                          `${createdSlotData.slotDuration} min slots`
                        ) : (
                          `30 min slots (default)`
                        )}
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
        
        {availableDates.size > 0 && (
          <div className="admin-actions">
            <button 
              className="btn btn-cancel"
              onClick={handleCancelAllDates}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-confirm"
              onClick={handleConfirmBulkDates}
              disabled={isLoading}
            >
              {isLoading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        )}
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h3>All Bookings</h3>
          <button 
            className="refresh-btn"
            onClick={handleRefreshBookings}
            disabled={isRefreshingBookings}
            title="Refresh bookings"
          >
            <RefreshCw 
              size={18} 
              className={`refresh-icon ${isRefreshingBookings ? 'spinning' : ''}`} 
            />
          </button>
        </div>
        {!bookingsData || bookingsData.bookedDates.length === 0 ? (
          <p className="empty-state">No bookings yet.</p>
        ) : (
          <div className="bookings-summary">
            <div className="booking-cards-container">
              {bookingsData.bookedDates.map(dateGroup => (
                <div key={dateGroup.date} className="booking-date-section">
                  <h4 className="booking-date-title">{formatDate(dateGroup.date)}</h4>
                  <div className="booking-cards-grid">
                    {dateGroup.bookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="booking-card"
                        onClick={() => handleBookingClick(booking, dateGroup.date)}
                      >
                        <div className="booking-card-header">
                          <span className="booking-time">{booking.timeSlot}</span>
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="booking-card-content">
                          <div className="customer-name">{booking.customer.name}</div>
                          <div className="customer-email">{booking.customer.email}</div>
                        </div>
                        <div className="booking-card-footer">
                          <span className="click-hint">Click for details</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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

      {showToast && (
        <div className="toast">
          <div className={`toast-content ${toastType}`}>
            <div className="toast-icon">
              {toastType === 'success' && '✓'}
              {toastType === 'error' && '✗'}
              {toastType === 'warning' && '⚠'}
              {toastType === 'info' && 'ℹ'}
            </div>
            <div className="toast-message">{toastMessage}</div>
            <button 
              className="toast-close"
              onClick={() => setShowToast(false)}
              title="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showCustomerModal && selectedBooking && (
        <CustomerDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;