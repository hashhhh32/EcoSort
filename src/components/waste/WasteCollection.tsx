
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bell, 
  Truck, 
  Trash2, 
  Recycle, 
  Check,
  Plus,
  X
} from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';

const WasteCollection = () => {
  const [tab, setTab] = useState<'schedule' | 'request'>('schedule');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { toast } = useToast();
  
  const scheduleData = [
    {
      id: 1,
      day: 'Monday',
      date: 'May 22, 2023',
      time: '8:00 AM - 10:00 AM',
      type: 'Plastic',
      area: 'North Zone',
      notificationSet: true
    },
    {
      id: 2,
      day: 'Thursday',
      date: 'May 25, 2023',
      time: '9:00 AM - 11:00 AM',
      type: 'Paper',
      area: 'North Zone',
      notificationSet: true
    },
    {
      id: 3,
      day: 'Monday',
      date: 'May 29, 2023',
      time: '8:00 AM - 10:00 AM',
      type: 'General',
      area: 'North Zone',
      notificationSet: false
    },
    {
      id: 4,
      day: 'Thursday',
      date: 'June 1, 2023',
      time: '9:00 AM - 11:00 AM',
      type: 'Metal & Glass',
      area: 'North Zone',
      notificationSet: false
    }
  ];
  
  const [requestForm, setRequestForm] = useState({
    name: '',
    address: '',
    wasteType: '',
    wasteAmount: '',
    collectionDate: '',
    preferredTime: '',
    additionalNotes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "Your collection request has been submitted successfully!",
    });
    // Reset form
    setRequestForm({
      name: '',
      address: '',
      wasteType: '',
      wasteAmount: '',
      collectionDate: '',
      preferredTime: '',
      additionalNotes: ''
    });
  };
  
  const toggleNotification = (id: number) => {
    toast({
      title: "Notification updated",
      description: "Collection reminder has been updated.",
    });
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Plastic': return 'bg-eco-plastic/20 text-blue-700';
      case 'Paper': return 'bg-eco-paper/20 text-yellow-700';
      case 'Metal & Glass': return 'bg-eco-glass/20 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="pt-20 pb-20 md:pb-6 px-4 min-h-screen bg-eco-backdrop">
      <AnimatedTransition animation="slide-down">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Waste Collection</h1>
          <p className="text-muted-foreground">View schedule and request pickups</p>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="fade-in" delay={100}>
        <div className="flex mb-6 bg-muted/50 rounded-lg p-1">
          <button
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'schedule' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setTab('schedule')}
          >
            <Calendar className="w-4 h-4 inline-block mr-2" />
            Schedule
          </button>
          <button
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'request' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setTab('request')}
          >
            <Truck className="w-4 h-4 inline-block mr-2" />
            Request Pickup
          </button>
        </div>
      </AnimatedTransition>
      
      {tab === 'schedule' && (
        <AnimatedTransition animation="slide-up">
          <div className="space-y-4">
            {scheduleData.map((item, index) => (
              <AnimatedTransition
                key={item.id}
                animation="slide-up"
                delay={150 + index * 50}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-border">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.day}</h3>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <span className={`text-sm px-2.5 py-1 rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{item.area}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={() => toggleNotification(item.id)}
                        className={`flex items-center text-sm rounded-full px-3 py-1.5 ${
                          item.notificationSet 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.notificationSet ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                            Reminder Set
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 mr-1.5" />
                            Set Reminder
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedTransition>
            ))}
          </div>
        </AnimatedTransition>
      )}
      
      {tab === 'request' && (
        <AnimatedTransition animation="slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border p-5">
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={requestForm.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={requestForm.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Waste Type</label>
                  <select
                    name="wasteType"
                    value={requestForm.wasteType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="general">General Waste</option>
                    <option value="plastic">Plastic</option>
                    <option value="paper">Paper</option>
                    <option value="glass">Glass</option>
                    <option value="metal">Metal</option>
                    <option value="organic">Organic</option>
                    <option value="electronic">Electronic</option>
                    <option value="hazardous">Hazardous</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Approximate Amount (kg)</label>
                  <input
                    type="number"
                    name="wasteAmount"
                    value={requestForm.wasteAmount}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Collection Date</label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={requestForm.collectionDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <select
                    name="preferredTime"
                    value={requestForm.preferredTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-10 px-3"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={requestForm.additionalNotes}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-20 px-3 py-2 resize-none"
                  placeholder="Special instructions or details about your waste..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full h-11 bg-primary text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Request Pickup</span>
              </button>
            </form>
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default WasteCollection;
