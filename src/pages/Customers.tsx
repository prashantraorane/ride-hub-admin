import { useState } from 'react';
import { Plus, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { customers as initialCustomers, bookings } from '@/data/mockData';
import { Customer } from '@/types';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Customers() {
  const [customerList, setCustomerList] = useState<Customer[]>(initialCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});

  const handleAdd = () => {
    setSelectedCustomer(null);
    setFormData({ verified: false });
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    setIsFormOpen(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewOpen(true);
  };

  const toggleVerification = (customerId: string) => {
    setCustomerList(customerList.map((c) =>
      c.id === customerId ? { ...c, verified: !c.verified } : c
    ));
    const customer = customerList.find((c) => c.id === customerId);
    toast({
      title: customer?.verified ? 'Verification removed' : 'Customer verified',
      description: `${customer?.name} verification status updated.`,
    });
  };

  const handleSubmit = () => {
    if (selectedCustomer) {
      // Edit
      setCustomerList(customerList.map((c) =>
        c.id === selectedCustomer.id ? { ...c, ...formData } as Customer : c
      ));
      toast({
        title: 'Customer updated',
        description: `${formData.name} has been updated.`,
      });
    } else {
      // Add
      const newCustomer: Customer = {
        id: String(Date.now()),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        licenseNumber: formData.licenseNumber || '',
        verified: formData.verified || false,
        joinedDate: format(new Date(), 'yyyy-MM-dd'),
        totalRentals: 0,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || '')}&background=random`,
      };
      setCustomerList([newCustomer, ...customerList]);
      toast({
        title: 'Customer added',
        description: `${newCustomer.name} has been added.`,
      });
    }
    setIsFormOpen(false);
    setFormData({});
    setSelectedCustomer(null);
  };

  const getCustomerBookings = (customerId: string) => {
    return bookings.filter((b) => b.customerId === customerId);
  };

  const columns = [
    {
      key: 'avatar',
      label: '',
      render: (customer: Customer) => (
        <img
          src={customer.avatar}
          alt={customer.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'totalRentals', label: 'Rentals', sortable: true },
    {
      key: 'verified',
      label: 'Verified',
      render: (customer: Customer) => (
        <Badge
          variant={customer.verified ? 'default' : 'secondary'}
          className={customer.verified ? 'bg-status-available-bg text-status-available' : ''}
          onClick={() => toggleVerification(customer.id)}
          style={{ cursor: 'pointer' }}
        >
          {customer.verified ? (
            <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
          ) : (
            <><XCircle className="h-3 w-3 mr-1" /> Unverified</>
          )}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(customer)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers"
        description="Manage customer accounts and verification"
        action={{
          label: 'Add Customer',
          icon: Plus,
          onClick: handleAdd,
        }}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <DataTable
            data={customerList}
            columns={columns}
            searchPlaceholder="Search customers..."
            searchKeys={['name', 'email', 'phone']}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Anderson"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="license">License Number</Label>
              <Input
                id="license"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="DL-2024-12345"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="verified">Verified Customer</Label>
              <Switch
                id="verified"
                checked={formData.verified || false}
                onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="gradient-accent text-accent-foreground">
              {selectedCustomer ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <Badge
                    variant={selectedCustomer.verified ? 'default' : 'secondary'}
                    className={selectedCustomer.verified ? 'bg-status-available-bg text-status-available' : ''}
                  >
                    {selectedCustomer.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-medium">{selectedCustomer.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{selectedCustomer.joinedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rentals</p>
                  <p className="font-medium">{selectedCustomer.totalRentals}</p>
                </div>
              </div>
              
              {/* Rental History */}
              <div>
                <h4 className="font-semibold mb-3">Rental History</h4>
                <div className="space-y-2">
                  {getCustomerBookings(selectedCustomer.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No rental history</p>
                  ) : (
                    getCustomerBookings(selectedCustomer.id).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{booking.motorcycleName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.startDate} - {booking.endDate}
                          </p>
                        </div>
                        <p className="font-medium">${booking.totalAmount}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
