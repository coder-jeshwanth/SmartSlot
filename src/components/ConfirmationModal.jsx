import React from 'react';
import { formatDate } from '../utils/timeUtils';
import './ConfirmationModal.css';

const ConfirmationModal = ({ booking, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
              <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Booking Confirmed!</h2>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-message">
            Your slot has been successfully booked. Here are your booking details:
          </p>
          
          <div className="booking-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{booking.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{booking.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(booking.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{booking.time}</span>
            </div>
          </div>
          
          <div className="confirmation-note">
            <p>
              <strong>Important:</strong> Please save these details for your records. 
              You will need this information for your appointment.
            </p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;