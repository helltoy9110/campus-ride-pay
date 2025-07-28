import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  studentId?: string;
  busRoute?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: 'student' | 'admin', additionalData?: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('busTrackingUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data - replace with actual API response
    const userData: User = {
      id: '1',
      email,
      name: email.includes('admin') ? 'Admin User' : 'Student User',
      role: email.includes('admin') ? 'admin' : 'student',
      studentId: email.includes('admin') ? undefined : 'STU2024001',
      busRoute: email.includes('admin') ? undefined : 'Route-A'
    };
    
    setUser(userData);
    localStorage.setItem('busTrackingUser', JSON.stringify(userData));
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'admin', additionalData?: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: Math.random().toString(),
      email,
      name,
      role,
      studentId: role === 'student' ? additionalData?.studentId : undefined,
      busRoute: role === 'student' ? additionalData?.busRoute : undefined
    };
    
    setUser(userData);
    localStorage.setItem('busTrackingUser', JSON.stringify(userData));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('busTrackingUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}