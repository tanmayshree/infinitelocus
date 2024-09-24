const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
      let token = req.header('Authorization');
      console.log("token", token)
      if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

      token = token.split(' ')[1];

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
      } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
      }
}; 
