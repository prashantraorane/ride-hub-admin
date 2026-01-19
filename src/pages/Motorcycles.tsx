import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motorcycles as initialMotorcycles } from '@/data/mockData';
import { Motorcycle, BikeStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Motorcycles() {
  const [bikes, setBikes] = useState<Motorcycle[]>(initialMotorcycles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(null);
  const [formData, setFormData] = useState<Partial<Motorcycle>>({});

  const handleAdd = () => {
    setSelectedBike(null);
    setFormData({});
    setIsFormOpen(true);
  };

  const handleEdit = (bike: Motorcycle) => {
    setSelectedBike(bike);
    setFormData(bike);
    setIsFormOpen(true);
  };

  const handleView = (bike: Motorcycle) => {
    setSelectedBike(bike);
    setIsViewOpen(true);
  };

  const handleDelete = (bike: Motorcycle) => {
    setSelectedBike(bike);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBike) {
      setBikes(bikes.filter((b) => b.id !== selectedBike.id));
      toast({
        title: 'Motorcycle deleted',
        description: `${selectedBike.name} has been removed from inventory.`,
      });
    }
    setIsDeleteOpen(false);
    setSelectedBike(null);
  };

  const handleSubmit = () => {
    if (selectedBike) {
      // Edit
      setBikes(bikes.map((b) => (b.id === selectedBike.id ? { ...b, ...formData } as Motorcycle : b)));
      toast({
        title: 'Motorcycle updated',
        description: `${formData.name} has been updated.`,
      });
    } else {
      // Add
      const newBike: Motorcycle = {
        id: String(Date.now()),
        name: formData.name || '',
        model: formData.model || '',
        category: formData.category || '',
        pricePerDay: formData.pricePerDay || 0,
        status: (formData.status as BikeStatus) || 'available',
        image: formData.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400',
        year: formData.year || new Date().getFullYear(),
        engineCC: formData.engineCC || 0,
        fuelType: formData.fuelType || 'Petrol',
        mileage: formData.mileage || 0,
      };
      setBikes([...bikes, newBike]);
      toast({
        title: 'Motorcycle added',
        description: `${newBike.name} has been added to inventory.`,
      });
    }
    setIsFormOpen(false);
    setFormData({});
    setSelectedBike(null);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (bike: Motorcycle) => (
        <img
          src={bike.image}
          alt={bike.name}
          className="w-16 h-12 object-cover rounded-md"
        />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'pricePerDay',
      label: 'Price/Day',
      sortable: true,
      render: (bike: Motorcycle) => `$${bike.pricePerDay}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (bike: Motorcycle) => <StatusBadge status={bike.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (bike: Motorcycle) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(bike)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(bike)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(bike)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Motorcycles"
        description="Manage your motorcycle inventory"
        action={{
          label: 'Add Motorcycle',
          icon: Plus,
          onClick: handleAdd,
        }}
      />

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <DataTable
            data={bikes}
            columns={columns}
            searchPlaceholder="Search motorcycles..."
            searchKeys={['name', 'model', 'category']}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBike ? 'Edit Motorcycle' : 'Add Motorcycle'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Harley Davidson Iron 883"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Iron 883"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sport">Sport</SelectItem>
                    <SelectItem value="Cruiser">Cruiser</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Naked">Naked</SelectItem>
                    <SelectItem value="Classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Day ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.pricePerDay || ''}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                  placeholder="120"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'available'}
                  onValueChange={(value) => setFormData({ ...formData, status: value as BikeStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  placeholder="2024"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engineCC">Engine (CC)</Label>
                <Input
                  id="engineCC"
                  type="number"
                  value={formData.engineCC || ''}
                  onChange={(e) => setFormData({ ...formData, engineCC: Number(e.target.value) })}
                  placeholder="883"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="gradient-accent text-accent-foreground">
              {selectedBike ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Motorcycle Details</DialogTitle>
          </DialogHeader>
          {selectedBike && (
            <div className="space-y-4">
              <img
                src={selectedBike.image}
                alt={selectedBike.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedBike.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-medium">{selectedBike.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedBike.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price/Day</p>
                  <p className="font-medium">${selectedBike.pricePerDay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{selectedBike.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engine</p>
                  <p className="font-medium">{selectedBike.engineCC}cc</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-medium">{selectedBike.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={selectedBike.status} />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Motorcycle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedBike?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
