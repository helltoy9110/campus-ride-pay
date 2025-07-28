import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  MapPin, 
  CreditCard, 
  Clock, 
  Bus, 
  Navigation,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BusLocation {
  lat: number;
  lng: number;
  speed: number;
  lastUpdated: Date;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [feeAmount, setFeeAmount] = useState(1250);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'overdue'>('pending');
  const [estimatedArrival, setEstimatedArrival] = useState('8 minutes');

  useEffect(() => {
    // Simulate real-time bus location updates
    const interval = setInterval(() => {
      setBusLocation({
        lat: 28.7041 + Math.random() * 0.01,
        lng: 77.1025 + Math.random() * 0.01,
        speed: Math.random() * 60,
        lastUpdated: new Date()
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = () => {
    // Simulate payment process
    toast.loading('Processing payment...', { duration: 2000 });
    setTimeout(() => {
      setPaymentStatus('paid');
      toast.success('Payment successful!');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-payment-success text-white';
      case 'pending': return 'bg-payment-pending text-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center space-y-2 animate-slide-up">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Track your bus and manage payments</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-payment-pending">₹{feeAmount}</div>
            <p className="text-xs text-muted-foreground">Based on distance traveled</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            {paymentStatus === 'paid' ? 
              <CheckCircle className="h-4 w-4 text-payment-success" /> :
              <AlertCircle className="h-4 w-4 text-payment-pending" />
            }
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(paymentStatus)} animate-pulse-glow`}>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentStatus === 'paid' ? 'All good!' : 'Payment required'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ETA</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-route-active">{estimatedArrival}</div>
            <p className="text-xs text-muted-foreground">To your stop</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Tracking */}
        <Card className="shadow-card animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Bus Location
            </CardTitle>
            <CardDescription>
              Track your bus in real-time on {user?.busRoute}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-map rounded-lg p-6 text-center shadow-map">
              <Bus className="h-16 w-16 mx-auto text-primary animate-pulse-glow" />
              <h3 className="mt-4 font-semibold">Bus Location</h3>
              {busLocation && (
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Lat: {busLocation.lat.toFixed(6)}</p>
                  <p>Lng: {busLocation.lng.toFixed(6)}</p>
                  <p>Speed: {busLocation.speed.toFixed(1)} km/h</p>
                  <p className="text-xs">
                    Last updated: {busLocation.lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            <Button className="w-full" variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Open in Maps
            </Button>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card className="shadow-card animate-bounce-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Fee Payment
            </CardTitle>
            <CardDescription>
              Manage your bus fee payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Monthly Fee</p>
                  <p className="text-sm text-muted-foreground">Distance-based calculation</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-payment-pending">₹{feeAmount}</p>
                  <Badge className={getStatusColor(paymentStatus)}>
                    {paymentStatus}
                  </Badge>
                </div>
              </div>

              {paymentStatus !== 'paid' && (
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-gradient-payment hover:opacity-90 transition-all"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now - ₹{feeAmount}
                </Button>
              )}

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Fee calculated based on 15.2 km distance
                </p>
                <Button variant="link" className="text-xs p-0 h-auto">
                  View calculation details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Information */}
      <Card className="shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle>Route Information - {user?.busRoute}</CardTitle>
          <CardDescription>Your bus route details and stops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Bus className="h-8 w-8 mx-auto text-route-active mb-2" />
              <h4 className="font-medium">Main Campus</h4>
              <p className="text-sm text-muted-foreground">Starting point</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Navigation className="h-8 w-8 mx-auto text-route-active mb-2" />
              <h4 className="font-medium">Your Stop</h4>
              <p className="text-sm text-muted-foreground">15.2 km away</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-route-active mb-2" />
              <h4 className="font-medium">Journey Time</h4>
              <p className="text-sm text-muted-foreground">~25 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}