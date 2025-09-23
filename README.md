# SmartSlot - Calendar + Time Based Slot Booking

A modern, responsive React.js application for slot booking with calendar integration. This frontend-only application allows administrators to release available dates and customers to book 30-minute time slots.

## Features

### 🗓️ Calendar UI
- Interactive calendar view with selectable dates
- Admin can mark which dates are open for booking
- Customers can only pick from released dates
- Visual indicators for available, selected, and unavailable dates

### ⏰ Time Slot Selection
- 30-minute time slots from 12:00 AM to 11:30 PM
- Real-time availability checking
- Booked slots are automatically disabled and greyed out
- Clear visual feedback for slot status

### 📝 Booking Flow
- Simple 3-step process: Select Date → Choose Time → Complete Booking
- Booking form with name and email validation
- Confirmation popup with booking details
- No backend required - all state managed locally

### 👨‍💼 Admin Panel
- Toggle between customer and admin views
- Add/remove available dates
- View all bookings organized by date and time
- Real-time statistics dashboard

### 📱 Responsive Design
- Mobile-first approach
- Professional and modern UI
- Smooth animations and transitions
- Accessible design patterns

## Technology Stack

- **Frontend**: React.js 19.1.1
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Grid and Flexbox
- **State Management**: React Hooks (useState, useCallback)
- **Icons**: SVG icons
- **No Backend**: Pure frontend application

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx          # Calendar component with date selection
│   ├── Calendar.css
│   ├── TimeSlots.jsx         # Time slot grid component
│   ├── TimeSlots.css
│   ├── BookingForm.jsx       # Customer booking form
│   ├── BookingForm.css
│   ├── ConfirmationModal.jsx # Booking confirmation popup
│   ├── ConfirmationModal.css
│   ├── AdminPanel.jsx        # Admin management interface
│   └── AdminPanel.css
├── hooks/
│   └── useBookingState.js    # Custom hook for booking state management
├── utils/
│   └── timeUtils.js          # Time and date utility functions
├── App.jsx                   # Main application component
├── App.css                   # Global application styles
├── index.css                 # Root styles and CSS variables
└── main.jsx                  # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smartslot
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

### For Administrators

1. Click "Admin Panel" in the header
2. Add available dates using the date selector
3. View booking statistics in the dashboard
4. Monitor all bookings organized by date and time
5. Remove dates if needed (this will also cancel existing bookings)

### For Customers

1. Ensure you're in "Customer View" (default)
2. Select an available date from the calendar
3. Choose from available 30-minute time slots
4. Fill out the booking form with your name and email
5. Confirm your booking and receive a confirmation popup

## Features in Detail

### State Management
The application uses a custom React hook (`useBookingState`) to manage:
- Available dates (Set)
- Booked slots (Map of Maps: date → time → booking data)
- Real-time slot availability checking

### Time Slot Generation
Automatically generates 48 time slots per day (30-minute intervals) from 12:00 AM to 11:30 PM using utility functions.

### Responsive Design
- Mobile-first CSS with breakpoints at 768px and 480px
- Grid layouts that adapt to screen size
- Touch-friendly button sizes and spacing

### Data Persistence
Currently uses in-memory state management. For production use, consider:
- Local Storage for client-side persistence
- Backend integration for multi-user scenarios
- Database for permanent data storage

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Local Storage persistence
- [ ] Export bookings to CSV
- [ ] Email notifications (with backend)
- [ ] Multiple time slot durations
- [ ] Recurring availability patterns
- [ ] Booking cancellation
- [ ] User authentication
- [ ] Backend API integration+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
