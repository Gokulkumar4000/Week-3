import { Link } from 'wouter';
import { UserPlus, Stethoscope, Calendar, Check, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-medical-blue">DocCare</div>
              <div className="hidden md:block text-sm text-gray-500">Doctor Appointment System</div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="default" className="bg-medical-blue hover:bg-blue-700">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-medical-blue text-medical-blue hover:bg-blue-50">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to DocCare</h1>
          <p className="text-xl text-gray-600 mb-8">Book appointments with qualified doctors easily</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Portal */}
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="pt-6 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-medical-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Portal</h3>
                  <p className="text-gray-600 mb-6">Book appointments and manage your healthcare</p>
                </div>
                <Link href="/register?type=patient">
                  <Button className="w-full bg-medical-blue text-white hover:bg-blue-700">
                    Get Started as Patient
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Doctor Portal */}
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="pt-6 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor Portal</h3>
                  <p className="text-gray-600 mb-6">Manage appointments and patient care</p>
                </div>
                <Link href="/register?type=doctor">
                  <Button className="w-full bg-success text-white hover:bg-green-700">
                    Get Started as Doctor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-medical-blue" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Easy Scheduling</h4>
            <p className="text-gray-600">Book appointments in real-time with available doctors</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Instant Confirmation</h4>
            <p className="text-gray-600">Get immediate appointment confirmations</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6 text-warning" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart Notifications</h4>
            <p className="text-gray-600">Receive reminders and updates about your appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
