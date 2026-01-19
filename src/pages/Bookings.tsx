import { useState } from 'react';
import { Plus, Eye, Edit } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { bookings as initialBookings, customers, motorcycles } from '@/data/mockData';
import { Booking, BookingStatus } from '@/types';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Bookings() {
  const [bookingList, setBookingList] = useState<Booking[]>(initialBookings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({});

  const handleAdd = () => {
    setSelectedBooking(null);
    setFormData({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'pending',
      paymentStatus: 'pending',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormData(booking);
    setIsFormOpen(true);
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewOpen(true);
  };

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    setBookingList(bookingList.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    ));
    toast({
      title: 'Status updated',
      description: `Booking ${bookingId} status changed to ${newStatus}.`,
    });
  };

  const handleSubmit = () => {
    if (selectedBooking) {
      // Edit
      setBookingList(bookingList.map((b) =>
        b.id === selectedBooking.id ? { ...b, ...formData } as Booking : b
      ));
      toast({
        title: 'Booking updated',
        description: `Booking ${selectedBooking.id} has been updated.`,
      });
    } else {
      // Add
      const customer = customers.find((c) => c.id === formData.customerId);
      const bike = motorcycles.find((m) => m.id === formData.motorcycleId);
      
      if (!customer || !bike) {
        toast({
          title: 'Error',
          description: 'Please select a customer and motorcycle.',
          variant: 'destructive',
        });
        return;
      }

      const startDate = new Date(formData.startDate || '');
      const endDate = new Date(formData.endDate || '');
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = days * bike.pricePerDay;

      const newBooking: Booking = {
        id: `BK-${String(Date.now()).slice(-3)}`,
        customerId: formData.customerId || '',
        customerName: customer.name,
        motorcycleId: formData.motorcycleId || '',
        motorcycleName: bike.name,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        status: (formData.status as BookingStatus) || 'pending',
        totalAmount,
        paymentStatus: 'pending',
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      setBookingList([newBooking, ...bookingList]);
      toast({
        title: 'Booking created',
        description: `Booking ${newBooking.id} has been created.`,
      });
    }
    setIsFormOpen(false);
    setFormData({});
    setSelectedBooking(null);
  };

  const columns = [
    { key: 'id', label: 'Booking ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'motorcycleName', label: 'Motorcycle', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (booking: Booking) => `$${booking.totalAmount}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking: Booking) => (
        <Select
          value={booking.status}
          onValueChange={(value) => handleStatusChange(booking.id, value as BookingStatus)}
        >
          <SelectTrigger className="w-32">
            <StatusBadge status={booking.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (booking: Booking) => <StatusBadge status={booking.paymentStatus} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (booking: Booking) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(booking)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(booking)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Bookings"
        description="Manage rental bookings and reservations"
        action={{
          label: 'New Booking',
          icon: Plus,
          onClick: handleAdd,
        }}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <DataTable
            data={bookingList}
            columns={columns}
            searchPlaceholder="Search bookings..."
            searchKeys={['id', 'customerName', 'motorcycleName']}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBooking ? 'Edit Booking' : 'New Booking'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select
                value={formData.customerId || ''}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motorcycle">Motorcycle</Label>
              <Select
                value={formData.motorcycleId || ''}
                onValueChange={(value) => setFormData({ ...formData, motorcycleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select motorcycle" />
                </SelectTrigger>
                <SelectContent>
                  {motorcycles.filter((m) => m.status === 'available').map((bike) => (
                    <SelectItem key={bike.id} value={bike.id}>
                      {bike.name} - ${bike.pricePerDay}/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            {selectedBooking && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'pending'}
                  onValueChange={(value) => setFormData({ ...formData, status: value as BookingStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="gradient-accent text-accent-foreground">
              {selectedBooking ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-lg font-semibold">{selectedBooking.id}</span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Motorcycle</p>
                  <p className="font-medium">{selectedBooking.motorcycleName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{selectedBooking.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{selectedBooking.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-lg">${selectedBooking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <StatusBadge status={selectedBooking.paymentStatus} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{selectedBooking.createdAt}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
