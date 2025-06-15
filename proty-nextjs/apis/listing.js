// hooks/listingQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/listingApi';

// Get all listings
export const useListings = () =>
  useQuery({
    queryKey: ['listings'],
    queryFn: api.getAllListings,
  });

// Get single listing by ID
export const useListingById = (id) =>
  useQuery(['listing', id], () => api.getListingById(id), {
    enabled: !!id,
  });

// Get listings by agent ID
export const useListingsByAgent = (agentId) =>
  useQuery(['agentListings', agentId], () => api.getListingsByAgent(agentId), {
    enabled: !!agentId,
  });

// Search listings
export const useSearchListings = (params, enabled = true) =>
  useQuery({
    queryKey: ['listings', params],
    queryFn: () => api.searchListings(params),
  });

// Add listing
export const useAddListing = () => {
  const queryClient = useQueryClient();
  return useMutation(api.addListing, {
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

// Update listing
export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => api.updateListing(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};

// Delete listing
export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation(api.deleteListing, {
    onSuccess: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};
