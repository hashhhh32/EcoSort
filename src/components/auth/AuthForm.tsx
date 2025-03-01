
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Recycle, 
  ArrowRight 
} from 'lucide-react';
import AnimatedTransition from '../ui/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // This would be where you'd handle the actual authentication logic
    if (isLogin) {
      // Login logic
      toast({
        title: "Success!",
        description: "You've logged in successfully.",
      });
      navigate('/home');
    } else {
      // Registration logic
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden bg-eco-backdrop">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-eco-leafLight/20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-eco-leafDark/10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-md w-full mx-auto">
        <AnimatedTransition animation="scale-up">
          <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-eco-leaf/10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Recycle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-muted-foreground text-center mt-2">
                {isLogin 
                  ? 'Sign in to manage your waste collection' 
                  : 'Join us to make the world cleaner'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedTransition show={!isLogin} animation="slide-down">
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full h-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required={!isLogin}
                    />
                  </div>
                )}
              </AnimatedTransition>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full h-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full h-12 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              
              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full h-12 bg-primary text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
              >
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleView}
                  className="ml-2 text-primary hover:underline focus:outline-none"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default AuthForm;
