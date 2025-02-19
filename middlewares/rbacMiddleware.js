export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(403).json({ message: "Access forbidden: user not authenticated" });
      }
  
      // Check if the user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
      }
  
      // User is authorized
      next();
    };
  };
  