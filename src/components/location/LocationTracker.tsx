
import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Clock, 
  Phone, 
  Globe, 
  Star, 
  ThumbsUp,
  Navigation,
  ChevronRight,
  Filter
} from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';

const LocationTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const recyclingCenters = [
    {
      id: 1,
      name: 'EcoRecycle Center',
      address: '123 Green Street, Eco City',
      distance: '1.2 km',
      rating: 4.8,
      hours: '8:00 AM - 6:00 PM',
      phone: '+1 (555) 123-4567',
      website: 'www.ecorecycle.com',
      acceptedItems: ['Plastic', 'Paper', 'Glass', 'Metal'],
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      name: 'Green Earth Recycling',
      address: '456 Sustainable Ave, Eco City',
      distance: '2.5 km',
      rating: 4.5,
      hours: '9:00 AM - 7:00 PM',
      phone: '+1 (555) 987-6543',
      website: 'www.greenearth.com',
      acceptedItems: ['Paper', 'Cardboard', 'Electronics'],
      reviews: 87,
      image: 'https://images.unsplash.com/photo-1546213642-eec6c8f68b26?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      name: 'City Waste Management',
      address: '789 Recycle Road, Eco City',
      distance: '3.8 km',
      rating: 4.2,
      hours: '8:00 AM - 5:00 PM',
      phone: '+1 (555) 789-0123',
      website: 'www.citywaste.gov',
      acceptedItems: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Hazardous'],
      reviews: 206,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 4,
      name: 'E-Waste Solutions',
      address: '101 Tech Blvd, Eco City',
      distance: '4.5 km',
      rating: 4.7,
      hours: '10:00 AM - 6:00 PM',
      phone: '+1 (555) 555-5555',
      website: 'www.e-wastesolutions.com',
      acceptedItems: ['Electronics', 'Batteries', 'Appliances'],
      reviews: 64,
      image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d9a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];
  
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'plastic', name: 'Plastic' },
    { id: 'paper', name: 'Paper' },
    { id: 'glass', name: 'Glass' },
    { id: 'metal', name: 'Metal' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'hazardous', name: 'Hazardous' },
  ];
  
  const filteredCenters = recyclingCenters.filter(center => {
    // Filter by search term
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          center.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected category
    const matchesFilter = selectedFilter === 'all' || 
                         center.acceptedItems.some(item => 
                           item.toLowerCase() === selectedFilter.toLowerCase()
                         );
    
    return matchesSearch && matchesFilter;
  });
  
  const toggleLocationDetails = (id: number) => {
    setSelectedLocation(selectedLocation === id ? null : id);
  };
  
  return (
    <div className="pt-20 pb-20 md:pb-6 px-4 min-h-screen bg-eco-backdrop">
      <AnimatedTransition animation="slide-down">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Recycling Centers</h1>
          <p className="text-muted-foreground">Find nearby waste collection centers</p>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="fade-in" delay={100}>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search by name or location..."
            className="pl-10 w-full h-12 rounded-lg border border-input bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="fade-in" delay={150}>
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  selectedFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </AnimatedTransition>
      
      <div className="space-y-4 mb-6">
        {filteredCenters.map((center, index) => (
          <AnimatedTransition
            key={center.id} 
            animation="slide-up" 
            delay={200 + index * 50}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={center.image} 
                  alt={center.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-sm shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
                  <span>{center.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{center.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {center.address}
                    </p>
                  </div>
                  <div className="flex items-center text-sm bg-eco-leaf/10 text-eco-leafDark px-2.5 py-1 rounded-full">
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    {center.distance}
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {center.acceptedItems.slice(0, 4).map((item, i) => (
                    <span 
                      key={i} 
                      className="bg-muted px-2 py-0.5 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                  {center.acceptedItems.length > 4 && (
                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                      +{center.acceptedItems.length - 4} more
                    </span>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-primary flex items-center text-sm hover:underline"
                    onClick={() => toggleLocationDetails(center.id)}
                  >
                    {selectedLocation === center.id ? 'Less details' : 'More details'}
                    <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${
                      selectedLocation === center.id ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  <button className="bg-primary text-white px-3 py-1.5 rounded-full text-sm flex items-center">
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Directions
                  </button>
                </div>
                
                {selectedLocation === center.id && (
                  <AnimatedTransition animation="slide-down">
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{center.hours}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          <a href={`tel:${center.phone}`} className="hover:underline">{center.phone}</a>
                        </div>
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          <a href={`https://${center.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{center.website}</a>
                        </div>
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{center.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedTransition>
                )}
              </div>
            </div>
          </AnimatedTransition>
        ))}
      </div>
      
      {filteredCenters.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-border">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-muted rounded-full mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No centers found</h3>
          <p className="text-muted-foreground">
            We couldn't find any recycling centers matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
