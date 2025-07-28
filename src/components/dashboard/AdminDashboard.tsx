import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  Users, 
  Bus, 
  DollarSign, 
  Settings,
  MapPin,
  CreditCard,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface BusData {
  id: string;
  route: string;
  students: number;
  location: { lat: number; lng: number };
  status: 'active' | 'inactive' | 'maintenance';
}

interface PaymentData {
  studentId: string;
  studentName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [buses, setBuses] = useState<BusData[]>([
    { id: 'BUS001', route: 'Route-A', students: 45, location: { lat: 28.7041, lng: 77.1025 }, status: 'active' },
    { id: 'BUS002', route: 'Route-B', students: 38, location: { lat: 28.7141, lng: 77.1125 }, status: 'active' },
    { id: 'BUS003', route: 'Route-C', students: 52, location: { lat: 28.6941, lng: 77.0925 }, status: 'maintenance' },
    { id: 'BUS004', route: 'Route-D', students: 41, location: { lat: 28.7241, lng: 77.1225 }, status: 'active' },
  ]);

  const [payments, setPayments] = useState<PaymentData[]>([
    { studentId: 'STU001', studentName: 'John Doe', amount: 1250, status: 'paid', dueDate: '2024-01-15' },
    { studentId: 'STU002', studentName: 'Jane Smith', amount: 1100, status: 'pending', dueDate: '2024-01-15' },
    { studentId: 'STU003', studentName: 'Bob Johnson', amount: 1300, status: 'overdue', dueDate: '2024-01-10' },
    { studentId: 'STU004', studentName: 'Alice Brown', amount: 1150, status: 'paid', dueDate: '2024-01-15' },
  ]);

  const [fareRules, setFareRules] = useState({
    basePrice: 500,
    pricePerKm: 50,
    maxDistance: 30
  });

  const totalStudents = buses.reduce((sum, bus) => sum + bus.students, 0);
  const totalRevenue = payments.reduce((sum, payment) => payment.status === 'paid' ? sum + payment.amount : sum, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue').length;
  const activeBuses = buses.filter(b => b.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-route-active text-white';
      case 'paid': return 'bg-payment-success text-white';
      case 'pending': return 'bg-payment-pending text-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'maintenance': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center space-y-2 animate-slide-up">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage buses, routes, and student payments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-route-active">{activeBuses}/{buses.length}</div>
            <p className="text-xs text-muted-foreground">Operational status</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-payment-success">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-payment-pending">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Fleet Management */}
        <Card className="shadow-card animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Bus Fleet Status
            </CardTitle>
            <CardDescription>Monitor all buses in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{bus.id}</p>
                      <p className="text-sm text-muted-foreground">{bus.route} • {bus.students} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(bus.status)} mb-1`}>
                      {bus.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {bus.location.lat.toFixed(4)}, {bus.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              View All on Map
            </Button>
          </CardContent>
        </Card>

        {/* Payment Management */}
        <Card className="shadow-card animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Overview
            </CardTitle>
            <CardDescription>Monitor student payments and fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {payments.map((payment) => (
                <div key={payment.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-sm text-muted-foreground">{payment.studentId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{payment.amount}</p>
                    <Badge className={`${getStatusColor(payment.status)} text-xs`}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Fare Configuration */}
      <Card className="shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Fare Configuration
          </CardTitle>
          <CardDescription>Configure distance-based fare calculation rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input
                id="basePrice"
                type="number"
                value={fareRules.basePrice}
                onChange={(e) => setFareRules({...fareRules, basePrice: parseInt(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground">Minimum fare for any distance</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerKm">Price per KM (₹)</Label>
              <Input
                id="pricePerKm"
                type="number"
                value={fareRules.pricePerKm}
                onChange={(e) => setFareRules({...fareRules, pricePerKm: parseInt(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground">Additional cost per kilometer</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxDistance">Max Distance (KM)</Label>
              <Input
                id="maxDistance"
                type="number"
                value={fareRules.maxDistance}
                onChange={(e) => setFareRules({...fareRules, maxDistance: parseInt(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground">Maximum distance for calculation</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Calculation Formula</h4>
            <p className="text-sm text-muted-foreground">
              Fare = Base Price (₹{fareRules.basePrice}) + (Distance × ₹{fareRules.pricePerKm}/km)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Example: 15 km = ₹{fareRules.basePrice} + (15 × ₹{fareRules.pricePerKm}) = ₹{fareRules.basePrice + (15 * fareRules.pricePerKm)}
            </p>
          </div>
          
          <Button className="mt-4 bg-gradient-primary hover:opacity-90">
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}