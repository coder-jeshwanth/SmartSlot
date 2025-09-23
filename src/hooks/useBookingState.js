import { useState, useCallback } from 'react';

export const useBookingState = () => {
  const [availableDates, setAvailableDates] = useState(new Set());
  const [bookedSlots, setBookedSlots] = useState(new Map());

  const addAvailableDate = useCallback((date) => {
    setAvailableDates(prev => new Set([...prev, date]));
  }, []);

  const removeAvailableDate = useCallback((date) => {
    setAvailableDates(prev => {
      const newDates = new Set(prev);
      newDates.delete(date);
      return newDates;
    });
    
    // Also remove any booked slots for this date
    setBookedSlots(prev => {
      const newBookedSlots = new Map(prev);
      newBookedSlots.delete(date);
      return newBookedSlots;
    });
  }, []);

  const bookSlot = useCallback((date, time, bookingData) => {
    setBookedSlots(prev => {
      const newBookedSlots = new Map(prev);
      const dateSlots = newBookedSlots.get(date) || new Map();
      dateSlots.set(time, bookingData);
      newBookedSlots.set(date, dateSlots);
      return newBookedSlots;
    });
  }, []);

  const isSlotBooked = useCallback((date, time) => {
    const dateSlots = bookedSlots.get(date);
    return dateSlots ? dateSlots.has(time) : false;
  }, [bookedSlots]);

  const getBookingForSlot = useCallback((date, time) => {
    const dateSlots = bookedSlots.get(date);
    return dateSlots ? dateSlots.get(time) : null;
  }, [bookedSlots]);

  return {
    availableDates,
    bookedSlots,
    addAvailableDate,
    removeAvailableDate,
    bookSlot,
    isSlotBooked,
    getBookingForSlot
  };
};