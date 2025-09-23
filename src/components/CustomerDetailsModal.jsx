import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, User, Mail, Phone, FileText } from 'lucide-react';
import './CustomerDetailsModal.css';

const CustomerDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="status-icon" size={16} />;
      case 'pending':
        return <AlertCircle className="status-icon" size={16} />;
      case 'cancelled':
        return <XCircle className="status-icon" size={16} />;
      default:
        return <AlertCircle className="status-icon" size={16} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <User size={24} />
            </div>
            <div className="header-text">
              <h3>Customer Booking Details</h3>
              <p className="header-subtitle">Complete booking information</p>
            </div>
          </div>
        </div>
        
        <div className="modal-content">
          <div className="booking-info-section">
            <h4>
              <Calendar size={20} />
              Booking Information
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <div className="label-with-icon">
                  <Calendar size={16} />
                  <span className="label">Date</span>
                </div>
                <span className="value">{formatDate(booking.date)}</span>
              </div>
              <div className="info-item">
                <div className="label-with-icon">
                  <Clock size={16} />
                  <span className="label">Time</span>
                </div>
                <span className="value">{formatTime(booking.timeSlot)}</span>
              </div>
              <div className="info-item">
                <div className="label-with-icon">
                  {getStatusIcon(booking.status)}
                  <span className="label">Status</span>
                </div>
                <span className={`status ${booking.status}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div className="customer-info-section">
            <h4>
              <User size={20} />
              Customer Information
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <div className="label-with-icon">
                  <User size={16} />
                  <span className="label">Name</span>
                </div>
                <span className="value">{booking.customer.name}</span>
              </div>
              <div className="info-item">
                <div className="label-with-icon">
                  <Mail size={16} />
                  <span className="label">Email</span>
                </div>
                <span className="value">{booking.customer.email}</span>
              </div>
              <div className="info-item">
                <div className="label-with-icon">
                  <Phone size={16} />
                  <span className="label">Phone</span>
                </div>
                <span className="value">{booking.customer.phone}</span>
              </div>
              {booking.customer.notes && (
                <div className="info-item notes">
                  <div className="label-with-icon">
                    <FileText size={16} />
                    <span className="label">Notes</span>
                  </div>
                  <span className="value">{booking.customer.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;