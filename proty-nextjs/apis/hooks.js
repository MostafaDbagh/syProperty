import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, listingAPI, reviewAPI, contactAPI, favoriteAPI, agentAPI, pointAPI } from './index';

// Authentication hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      queryClient.invalidateQueries(['auth']);
    },
  });

  const signinMutation = useMutation({
    mutationFn: authAPI.signin,
    onSuccess: () => {
      queryClient.invalidateQueries(['auth']);
    },
  });

  const signoutMutation = useMutation({
    mutationFn: authAPI.signout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    signout: signoutMutation.mutate,
    isSigningUp: signupMutation.isPending,
    isSigningIn: signinMutation.isPending,
    isSigningOut: signoutMutation.isPending,
    signupError: signupMutation.error,
    signinError: signinMutation.error,
    signoutError: signoutMutation.error,
  };
};

// Listing hooks
export const useListings = (params = {}) => {
  return useQuery({
    queryKey: ['listing', params],
    queryFn: () => listingAPI.getListings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Search listings hook
export const useSearchListings = (searchParams) => {
  return useQuery({
    queryKey: ['listings', 'search', searchParams],
    queryFn: () => listingAPI.searchListings(searchParams),
    enabled: !!searchParams && Object.keys(searchParams).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingAPI.getListingById(id),
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingAPI.createListing,
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => listingAPI.updateListing(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['listing', id]);
      queryClient.invalidateQueries(['listings']);
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingAPI.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

// Review hooks
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => reviewAPI.getReviews(params),
  });
};

export const useReviewsByProperty = (propertyId) => {
  return useQuery({
    queryKey: ['reviews', 'property', propertyId],
    queryFn: () => reviewAPI.getReviewsByProperty(propertyId),
    enabled: !!propertyId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewAPI.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
    },
  });
};

// Contact hooks
export const useContacts = (params = {}) => {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactAPI.getContacts(params),
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactAPI.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });
};

// Favorite hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: favoriteAPI.getFavorites,
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoriteAPI.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: favoriteAPI.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    },
  });
};

// Agent hooks
export const useAgents = (params = {}) => {
  return useQuery({
    queryKey: ['agents', params],
    queryFn: () => agentAPI.getAgents(params),
  });
};

export const useAgent = (id) => {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => agentAPI.getAgentById(id),
    enabled: !!id,
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: agentAPI.createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
    },
  });
};

// Point hooks
export const usePointBalance = () => {
  return useQuery({
    queryKey: ['points', 'balance'],
    queryFn: pointAPI.getPointBalance,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTransactionHistory = (params = {}) => {
  return useQuery({
    queryKey: ['points', 'transactions', params],
    queryFn: () => pointAPI.getTransactionHistory(params),
  });
};

export const useChargePoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pointAPI.chargePoints,
    onSuccess: () => {
      queryClient.invalidateQueries(['points']);
    },
  });
};

export const useCalculateListingCost = () => {
  return useMutation({
    mutationFn: pointAPI.calculateListingCost,
  });
};
