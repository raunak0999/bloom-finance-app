export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error('🚨 REAL ERROR:', err);  // ADD THIS LINE
  console.error('Stack trace:', err.stack);  // ADD THIS LINE
  
  res.status(500).json({ 
    message: err.message || 'Registration failed' 
  });
};
