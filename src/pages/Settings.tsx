import { useState } from 'react';
import { Save, Building, DollarSign, Users, Bell } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const [businessSettings, setBusinessSettings] = useState({
    name: 'MotoRent',
    email: 'contact@motorent.com',
    phone: '+1 (555) 000-0000',
    address: '123 Main Street, City, State 12345',
    taxId: 'TAX-123456789',
  });

  const [pricingSettings, setPricingSettings] = useState({
    depositPercentage: 20,
    lateFeePerHour: 15,
    cancellationFee: 50,
    insuranceDaily: 25,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookings: true,
    emailPayments: true,
    emailReturns: true,
    smsBookings: false,
    smsPayments: false,
  });

  const handleSave = (section: string) => {
    toast({
      title: 'Settings saved',
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Configure your business settings and preferences"
      />

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Manage your company details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={businessSettings.name}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={businessSettings.taxId}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, taxId: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                />
              </div>
              <Separator />
              <Button onClick={() => handleSave('Business')} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Settings */}
        <TabsContent value="pricing">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Pricing Rules</CardTitle>
              <CardDescription>Configure fees, deposits, and pricing policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit Percentage (%)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={pricingSettings.depositPercentage}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, depositPercentage: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">Percentage of total booking amount required as deposit</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFee">Late Fee ($/hour)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    value={pricingSettings.lateFeePerHour}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, lateFeePerHour: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">Charged for each hour past the return time</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellation">Cancellation Fee ($)</Label>
                  <Input
                    id="cancellation"
                    type="number"
                    value={pricingSettings.cancellationFee}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, cancellationFee: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">Flat fee for cancelled bookings</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance ($/day)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={pricingSettings.insuranceDaily}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, insuranceDaily: Number(e.target.value) })}
                  />
                  <p className="text-sm text-muted-foreground">Optional daily insurance fee</p>
                </div>
              </div>
              <Separator />
              <Button onClick={() => handleSave('Pricing')} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive updates and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Bookings</p>
                      <p className="text-sm text-muted-foreground">Receive email when a new booking is made</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailBookings}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailBookings: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Updates</p>
                      <p className="text-sm text-muted-foreground">Receive email for payment confirmations</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailPayments}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailPayments: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vehicle Returns</p>
                      <p className="text-sm text-muted-foreground">Receive email when a vehicle is returned</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailReturns}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailReturns: checked })}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">SMS Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Bookings</p>
                      <p className="text-sm text-muted-foreground">Receive SMS for urgent booking updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsBookings}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsBookings: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive SMS for payment issues</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsPayments}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsPayments: checked })}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <Button onClick={() => handleSave('Notification')} className="gradient-accent text-accent-foreground">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage admin users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Admin User', email: 'admin@motorent.com', role: 'Super Admin' },
                  { name: 'John Manager', email: 'john@motorent.com', role: 'Manager' },
                  { name: 'Sarah Staff', email: 'sarah@motorent.com', role: 'Staff' },
                ].map((user) => (
                  <div key={user.email} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm px-2 py-1 bg-muted rounded">{user.role}</span>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <Button className="gradient-accent text-accent-foreground">
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
