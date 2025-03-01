
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Truck,
  MapPin,
  Award,
  AlertTriangle,
  ArrowRight,
  Calendar,
  TrendingUp,
  Leaf
} from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';

const HomeScreen = () => {
  const [userName, setUserName] = useState('User');
  const [stats, setStats] = useState({
    totalWaste: 0,
    recycled: 0,
    points: 0
  });
  
  // Animation sequence for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalWaste: Math.min(prev.totalWaste + 2, 87),
        recycled: Math.min(prev.recycled + 1, 65),
        points: Math.min(prev.points + 10, 450)
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const featureCards = [
    {
      title: 'Waste Segregation',
      description: 'Learn how to properly sort different types of waste',
      icon: <Recycle className="w-6 h-6 text-eco-leaf" />,
      path: '/segregation',
      color: 'bg-eco-leafLight/20',
      iconBg: 'bg-eco-leaf/10'
    },
    {
      title: 'Collection Schedule',
      description: 'View and set reminders for collection days',
      icon: <Truck className="w-6 h-6 text-eco-leaf" />,
      path: '/collection',
      color: 'bg-eco-plastic/20',
      iconBg: 'bg-eco-plastic/10'
    },
    {
      title: 'Nearby Centers',
      description: 'Find recycling centers in your area',
      icon: <MapPin className="w-6 h-6 text-eco-leaf" />,
      path: '/location',
      color: 'bg-eco-glass/20',
      iconBg: 'bg-eco-glass/10'
    },
    {
      title: 'Rewards & Points',
      description: 'Earn points for sustainable actions',
      icon: <Award className="w-6 h-6 text-eco-leaf" />,
      path: '/rewards',
      color: 'bg-eco-paper/20',
      iconBg: 'bg-eco-paper/10'
    },
    {
      title: 'Report Dump',
      description: 'Report illegal waste dumping',
      icon: <AlertTriangle className="w-6 h-6 text-eco-leaf" />,
      path: '/report',
      color: 'bg-eco-metal/20',
      iconBg: 'bg-eco-metal/10'
    }
  ];
  
  const upcomingCollections = [
    { day: 'Monday', date: 'May 22', type: 'Plastic' },
    { day: 'Thursday', date: 'May 25', type: 'Paper' },
    { day: 'Monday', date: 'May 29', type: 'General' }
  ];
  
  const renderStat = (icon: React.ReactNode, label: string, value: number | string, color: string) => (
    <div className="flex flex-col items-center p-4 rounded-xl shadow-sm bg-white/60 backdrop-blur-sm">
      <div className={`p-2 rounded-full ${color} mb-2`}>
        {icon}
      </div>
      <span className="text-lg font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div className="pt-20 pb-20 md:pb-6 px-4 min-h-screen bg-eco-backdrop">
      <AnimatedTransition animation="slide-down">
        <div className="mb-6">
          <span className="text-sm text-muted-foreground">Welcome back,</span>
          <h1 className="text-2xl font-semibold">{userName}</h1>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={100}>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {renderStat(
            <Recycle className="w-5 h-5 text-eco-leaf" />,
            'Total Waste (kg)',
            stats.totalWaste,
            'bg-eco-leaf/10'
          )}
          {renderStat(
            <TrendingUp className="w-5 h-5 text-eco-leafDark" />,
            'Recycled (%)',
            `${stats.recycled}%`,
            'bg-eco-leafDark/10'
          )}
          {renderStat(
            <Leaf className="w-5 h-5 text-eco-leaf" />,
            'Eco Points',
            stats.points,
            'bg-eco-leaf/10'
          )}
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={200}>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <Link 
                key={card.title} 
                to={card.path}
                className="waste-card"
              >
                <AnimatedTransition animation="scale-up" delay={100 + index * 50}>
                  <div className={`p-4 rounded-xl ${card.color} h-full`}>
                    <div className="flex items-start mb-3">
                      <div className={`p-2.5 rounded-full ${card.iconBg} mr-3`}>
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{card.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="p-2 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </AnimatedTransition>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="slide-up" delay={300}>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Upcoming Collections</h2>
            <Link 
              to="/collection" 
              className="text-sm text-primary flex items-center hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
            {upcomingCollections.map((collection, index) => (
              <div 
                key={index} 
                className={`flex items-center p-4 ${
                  index !== upcomingCollections.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="p-2.5 bg-eco-leaf/10 rounded-full mr-4">
                  <Calendar className="w-5 h-5 text-eco-leaf" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{collection.day}</h3>
                      <p className="text-sm text-muted-foreground">{collection.date}</p>
                    </div>
                    <span className="text-sm bg-eco-leaf/10 text-eco-leafDark px-2.5 py-1 rounded-full">
                      {collection.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default HomeScreen;
