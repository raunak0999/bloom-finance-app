import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Leaf, Eye, EyeOff, Mail, Lock, User, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('India');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await register(fullName, email, password, country);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const passwordStrength = password.length >= 6 ? 'strong' : password.length >= 3 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="shadow-lg border-2">
          <CardHeader className="space-y-4 text-center">
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="p-3 rounded-full bg-muted">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold">Bloom</CardTitle>
              <CardDescription className="text-base mt-2">
                Create your account
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) validateName(e.target.value);
                  }}
                  onBlur={() => validateName(fullName)}
                  className={nameError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {nameError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive"
                  >
                    {nameError}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  className={emailError ? 'border-destructive focus-visible:ring-destructive' : ''}
                  required
                />
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive"
                  >
                    {emailError}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    onBlur={() => validatePassword(password)}
                    className={passwordError ? 'border-destructive focus-visible:ring-destructive pr-10' : 'pr-10'}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {password.length >= 6 ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span>Password strength: Strong</span>
                        </>
                      ) : password.length >= 3 ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          <span>Password strength: Medium</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 text-destructive" />
                          <span>Password strength: Weak</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Country
                </Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="India">🇮🇳 India</option>
                  <option value="USA">🇺🇸 USA</option>
                  <option value="UK">🇬🇧 UK</option>
                  <option value="Canada">🇨🇦 Canada</option>
                  <option value="Australia">🇦🇺 Australia</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="lg"
                >
                  {isLoading ? 'Creating account...' : 'Register'}
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
