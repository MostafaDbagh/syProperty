import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useRouteProtection = (requiredRole = null) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptedUrl, setAttemptedUrl] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const getUserRole = () => {
    if (!user) return 'guest';
    return user.role || 'user'; // Default to 'user' if no role specified
  };

  const isAuthorized = (requiredRole) => {
    const userRole = getUserRole();
    
    // Agent can access everything
    if (userRole === 'agent') return true;
    
    // User can access user routes
    if (userRole === 'user' && requiredRole === 'user') return true;
    
    // Guest can only access public routes
    if (userRole === 'guest' && !requiredRole) return true;
    
    return false;
  };

  const checkRouteAccess = (pathname) => {
    const userRole = getUserRole();
    
    // Define route categories
    const agentRoutes = [
      '/dashboard',
      '/add-property', 
      '/my-properties',
      '/messages',
      '/review'
    ];
    
    const userRoutes = [
      '/my-favorites',
      '/my-package', 
      '/my-profile'
    ];
    
    const guestBlockedRoutes = [
      '/add-property',
      '/my-properties', 
      '/dashboard',
      '/my-profile',
      '/my-favorites',
      '/messages'
    ];

    // Check if current path is an agent route
    const isAgentRoute = agentRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // Check if current path is a user route
    const isUserRoute = userRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // Check if current path is blocked for guests
    const isGuestBlocked = guestBlockedRoutes.some(route => 
      pathname.startsWith(route)
    );

    // Determine access level needed
    let requiredAccess = null;
    if (isAgentRoute) requiredAccess = 'agent';
    else if (isUserRoute) requiredAccess = 'user';
    else if (isGuestBlocked) requiredAccess = 'user';

    return {
      userRole,
      requiredAccess,
      isAuthorized: isAuthorized(requiredAccess),
      isAgentRoute,
      isUserRoute,
      isGuestBlocked
    };
  };

  const saveAttemptedUrl = (url) => {
    setAttemptedUrl(url);
    localStorage.setItem('attemptedUrl', url);
  };

  const getAttemptedUrl = () => {
    return attemptedUrl || localStorage.getItem('attemptedUrl');
  };

  const clearAttemptedUrl = () => {
    setAttemptedUrl(null);
    localStorage.removeItem('attemptedUrl');
  };

  return {
    user,
    isLoading,
    getUserRole,
    isAuthorized,
    checkRouteAccess,
    saveAttemptedUrl,
    getAttemptedUrl,
    clearAttemptedUrl,
    router
  };
};

export default useRouteProtection;
