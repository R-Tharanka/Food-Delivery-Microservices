import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.restaurant = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;
