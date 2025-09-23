// Generate 30-minute time slots from 12:00 AM to 11:30 PM
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = formatTime(hour, minute);
      slots.push(time);
    }
  }
  return slots;
};

// Format time to 12-hour format with AM/PM
export const formatTime = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

// Format date to a readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Check if a date is in the past
export const isPastDate = (dateString) => {
  const today = new Date();
  const inputDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate < today;
};

// Generate array of date strings for the next 30 days
export const getNext30Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};