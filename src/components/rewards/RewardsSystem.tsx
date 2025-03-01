
import React, { useState } from 'react';
import { 
  Award, 
  Gift, 
  ChevronRight, 
  Leaf, 
  TrendingUp, 
  Recycle,
  Calendar,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';

const RewardsSystem = () => {
  const [tab, setTab] = useState<'points' | 'redeem'>('points');
  const { toast } = useToast();
  
  const userPoints = 450;
  const pointsHistory = [
    {
      id: 1,
      date: 'May 18, 2023',
      action: 'Recycled Plastic',
      points: 50,
      icon: <Recycle className="w-5 h-5 text-eco-leaf" />
    },
    {
      id: 2,
      date: 'May 15, 2023',
      action: 'Recycled Paper',
      points: 30,
      icon: <Recycle className="w-5 h-5 text-eco-leaf" />
    },
    {
      id: 3,
      date: 'May 10, 2023',
      action: 'Completed Survey',
      points: 25,
      icon: <Calendar className="w-5 h-5 text-eco-leaf" />
    },
    {
      id: 4,
      date: 'May 5, 2023',
      action: 'Recycled Glass',
      points: 45,
      icon: <Recycle className="w-5 h-5 text-eco-leaf" />
    },
    {
      id: 5,
      date: 'May 1, 2023',
      action: 'Referred a Friend',
      points: 100,
      icon: <Leaf className="w-5 h-5 text-eco-leaf" />
    }
  ];
  
  const rewardOptions = [
    {
      id: 1,
      title: 'Eco-Friendly Water Bottle',
      description: 'Reusable stainless steel water bottle',
      points: 200,
      available: true,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      title: '$10 Gift Card',
      description: 'For use at local eco-friendly stores',
      points: 300,
      available: true,
      image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      title: 'Organic Cotton Tote Bag',
      description: 'Reusable shopping bag made from organic materials',
      points: 150,
      available: true,
      image: 'https://images.unsplash.com/photo-1593368858664-a1abfe932b09?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 4,
      title: 'Free Composting Starter Kit',
      description: 'Everything you need to start composting at home',
      points: 500,
      available: false,
      image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc095?q=80&w=2519&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];
  
  const redeemReward = (id: number) => {
    const reward = rewardOptions.find(r => r.id === id);
    if (reward) {
      if (userPoints >= reward.points) {
        toast({
          title: "Reward Redeemed!",
          description: `You've successfully redeemed ${reward.title}. Check your email for details.`,
        });
      } else {
        toast({
          title: "Not Enough Points",
          description: `You need ${reward.points - userPoints} more points to redeem this reward.`,
        });
      }
    }
  };
  
  const renderProgressCircle = () => {
    const nextLevel = 500;
    const progress = Math.min((userPoints / nextLevel) * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <div className="relative flex items-center justify-center h-44 w-44">
        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className="text-muted stroke-current"
            strokeWidth="5"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary stroke-current transition-all duration-500 ease-in-out"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{userPoints}</span>
          <span className="text-sm text-muted-foreground">Points</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="pt-20 pb-20 md:pb-6 px-4 min-h-screen bg-eco-backdrop">
      <AnimatedTransition animation="slide-down">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Rewards Program</h1>
          <p className="text-muted-foreground">Earn points for sustainable actions</p>
        </div>
      </AnimatedTransition>
      
      <AnimatedTransition animation="fade-in" delay={100}>
        <div className="flex mb-6 bg-muted/50 rounded-lg p-1">
          <button
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'points' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setTab('points')}
          >
            <Leaf className="w-4 h-4 inline-block mr-2" />
            My Points
          </button>
          <button
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
              tab === 'redeem' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-white/50'
            }`}
            onClick={() => setTab('redeem')}
          >
            <Gift className="w-4 h-4 inline-block mr-2" />
            Redeem Rewards
          </button>
        </div>
      </AnimatedTransition>
      
      {tab === 'points' && (
        <AnimatedTransition animation="slide-up">
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border p-5 flex flex-col items-center">
              {renderProgressCircle()}
              
              <div className="mt-4 text-center">
                <h3 className="font-medium">Level: Eco Enthusiast</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  50 more points to reach Sustainability Warrior
                </p>
              </div>
              
              <div className="w-full mt-6 flex justify-around">
                <div className="text-center">
                  <div className="flex items-center justify-center p-2 rounded-full bg-eco-leaf/10 mb-2 mx-auto">
                    <TrendingUp className="w-5 h-5 text-eco-leaf" />
                  </div>
                  <span className="text-sm font-medium">75%</span>
                  <p className="text-xs text-muted-foreground">Recycling Rate</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center p-2 rounded-full bg-eco-leaf/10 mb-2 mx-auto">
                    <Calendar className="w-5 h-5 text-eco-leaf" />
                  </div>
                  <span className="text-sm font-medium">12</span>
                  <p className="text-xs text-muted-foreground">Weeks Active</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center p-2 rounded-full bg-eco-leaf/10 mb-2 mx-auto">
                    <Recycle className="w-5 h-5 text-eco-leaf" />
                  </div>
                  <span className="text-sm font-medium">18</span>
                  <p className="text-xs text-muted-foreground">Actions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Points History</h3>
              </div>
              
              <div className="divide-y divide-border">
                {pointsHistory.map((item, index) => (
                  <AnimatedTransition
                    key={item.id}
                    animation="fade-in"
                    delay={200 + index * 50}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-eco-leaf/10 rounded-full mr-3">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.action}</h4>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-eco-leaf">+{item.points}</span>
                    </div>
                  </AnimatedTransition>
                ))}
              </div>
            </div>
          </div>
        </AnimatedTransition>
      )}
      
      {tab === 'redeem' && (
        <AnimatedTransition animation="slide-up">
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-eco-leaf mr-3" />
                <div>
                  <h3 className="font-medium">Your Points</h3>
                  <p className="text-sm text-muted-foreground">Available to redeem</p>
                </div>
              </div>
              <span className="text-2xl font-semibold">{userPoints}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewardOptions.map((reward, index) => (
                <AnimatedTransition
                  key={reward.id}
                  animation="scale-up"
                  delay={150 + index * 50}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-border">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={reward.image} 
                        alt={reward.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{reward.title}</h3>
                        <span className="bg-eco-leaf/10 text-eco-leafDark px-2.5 py-1 rounded-full text-sm">
                          {reward.points} pts
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {reward.description}
                      </p>
                      
                      <button
                        disabled={!reward.available || userPoints < reward.points}
                        onClick={() => redeemReward(reward.id)}
                        className={`w-full py-2 rounded-lg flex items-center justify-center ${
                          !reward.available || userPoints < reward.points
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {!reward.available 
                          ? 'Out of Stock' 
                          : userPoints < reward.points 
                            ? `Need ${reward.points - userPoints} more points` 
                            : 'Redeem Reward'}
                      </button>
                    </div>
                  </div>
                </AnimatedTransition>
              ))}
            </div>
            
            <AnimatedTransition animation="slide-up" delay={350}>
              <div className="bg-eco-leaf/10 rounded-xl p-4 border border-eco-leaf/20">
                <div className="flex items-start">
                  <ShoppingBag className="w-5 h-5 mr-3 text-eco-leafDark mt-0.5" />
                  <div>
                    <h3 className="font-medium">More rewards available in our eco-store</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visit our partner eco-stores to discover more sustainable rewards and products.
                    </p>
                    <a 
                      href="#" 
                      className="mt-2 inline-flex items-center text-sm text-eco-leafDark hover:underline"
                    >
                      Visit Eco Store
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </AnimatedTransition>
          </div>
        </AnimatedTransition>
      )}
    </div>
  );
};

export default RewardsSystem;
