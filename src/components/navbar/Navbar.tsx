
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Recycle, 
  Truck, 
  MapPin, 
  Award, 
  AlertTriangle, 
  User,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
    { name: 'Segregation', path: '/segregation', icon: <Recycle className="w-5 h-5" /> },
    { name: 'Collection', path: '/collection', icon: <Truck className="w-5 h-5" /> },
    { name: 'Location', path: '/location', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Rewards', path: '/rewards', icon: <Award className="w-5 h-5" /> },
    { name: 'Report', path: '/report', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center space-x-2">
          <Recycle className="w-7 h-7 text-eco-leaf" />
          <span className="font-semibold text-lg">EcoNavigator</span>
        </Link>
        
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col p-4 space-y-2 animate-slide-down">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors animate-slide-left`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`p-2 rounded-full ${isActive(item.path) ? "bg-primary text-white" : "bg-muted"}`}>
                  {item.icon}
                </div>
                <span className={`${isActive(item.path) ? "font-medium" : ""}`}>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass z-50 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
