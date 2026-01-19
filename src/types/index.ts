export type BikeStatus = 'available' | 'rented' | 'maintenance';
export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Motorcycle {
  id: string;
  name: string;
  model: string;
  category: string;
  pricePerDay: number;
  status: BikeStatus;
  image: string;
  year: number;
  engineCC: number;
  fuelType: string;
  mileage: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  verified: boolean;
  joinedDate: string;
  totalRentals: number;
  avatar: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  motorcycleId: string;
  motorcycleName: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  date: string;
}

export interface DashboardMetrics {
  totalBikes: number;
  activeRentals: number;
  todayRevenue: number;
  pendingBookings: number;
}
