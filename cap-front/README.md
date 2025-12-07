# Authentication System

A modern, responsive authentication system built with React that supports multiple user types including General Users, Police Officers, and Doctors.

## Features

### 🔐 Multi-Role Authentication
- **General Users**: Complete profile with Aadhar number, address, date of birth, and gender
- **Police Officers**: Badge number, station name, jurisdiction area, and rank
- **Doctors**: Specialization, license number, hospital name, and location

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Beautiful gradient backgrounds and smooth animations
- Role-based form fields that dynamically appear
- Password visibility toggle
- Form validation with real-time error feedback

### 📱 Responsive Design
- Mobile-first approach
- Optimized for tablets and desktop
- Touch-friendly interface
- Adaptive layouts for different screen sizes

### 🔒 Security Features
- Password confirmation
- Email validation
- Required field validation
- Role-specific validation rules

## User Types & Required Fields

### General User
- Name, Email, Phone, Password
- Aadhar Number (12 digits)
- Complete Address
- Date of Birth
- Gender

### Police Officer
- Name, Email, Phone, Password
- Badge Number
- Station Name
- Jurisdiction Area
- Rank (Constable, Sub Inspector, Inspector, DSP, SP)

### Doctor
- Name, Email, Phone, Password
- Medical Specialization
- License Number
- Hospital Name
- Location

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

### Login Page
- Select your account type (User, Police, Doctor)
- Enter your email and password
- Toggle password visibility
- Use "Remember me" option
- Access "Forgot Password" link
- Navigate to signup if you don't have an account

### Signup Page
- Choose your account type from the dropdown
- Fill in common fields (name, email, phone, password)
- Complete role-specific fields that appear based on your selection
- All fields are validated in real-time
- Submit to create your account

## Database Schema Support

The application is designed to work with the following database schemas:

### Users Table
```sql
CREATE TABLE users_table (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash TEXT NOT NULL,
  aadhar_number VARCHAR(20) UNIQUE,
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Police Table
```sql
CREATE TABLE police_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash TEXT NOT NULL,
  badge_number VARCHAR(50) UNIQUE,
  station_name VARCHAR(100),
  jurisdiction_area VARCHAR(100),
  rank VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE
);
```

### Doctors Table
```sql
CREATE TABLE doctors_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash TEXT NOT NULL,
  specialization VARCHAR(100),
  license_number VARCHAR(50) UNIQUE,
  hospital_name VARCHAR(100),
  location VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE
);
```

## API Integration

To connect with your backend API, update the form submission handlers in:

- `src/Components/Login/index.js` - `handleSubmit` function
- `src/Components/Signup/index.js` - `handleSubmit` function

Replace the console.log statements with actual API calls to your backend endpoints.

## Customization

### Styling
- Modify CSS files in each component directory
- Update color schemes in the gradient backgrounds
- Adjust responsive breakpoints as needed

### Validation
- Update validation rules in the `validateForm` functions
- Add custom validation for specific business requirements

### Fields
- Add or remove fields by updating the form state
- Modify role-specific field rendering functions

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
