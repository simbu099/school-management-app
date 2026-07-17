const jwt = require('jsonwebtoken');

// Token இருக்கா இல்லையா-னு செக் பண்ணும்
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SECRET_KEY');
    req.user = verified; // Token-ல இருக்குற role மற்றும் studentRollNo-வை request-க்குள்ள ஏத்தும்
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token.' });
  }
};

// குறிப்பிட்ட Role-க்கு மட்டும் Access அனுமதிக்கும்
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'உங்களுக்கு இந்த பக்கத்தை பார்க்க அனுமதி இல்லை!' });
    }
    next();
  };
};

module.exports = { verifyToken, restrictTo };