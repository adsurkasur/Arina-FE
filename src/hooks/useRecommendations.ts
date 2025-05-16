import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getQueryFn, queryClient } from '@/lib/queryClient';
import { RecommendationSet, RecommendationItem, GenerateRecommendationsParams } from '@/types/recommendations';
import { useToast } from './use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';

export function useRecommendations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<(RecommendationSet & { items: RecommendationItem[] })[]>([]);

  // Use React Query for fetching recommendations
  const { 
    isLoading: loading, 
    data: fetchedRecommendations,
    refetch 
  } = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: getQueryFn<(RecommendationSet & { items: RecommendationItem[] })[]>({
      on401: 'returnNull',
      endpoint: user ? `/api/recommendations/${user.id}` : null,
    }),
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        setRecommendations(data);
      }
    },
    onError: (error) => {
      console.error('Error fetching recommendations:', error);
      toast({
        title: 'Failed to load recommendations',
        description: 'Could not retrieve your personalized recommendations.',
        variant: 'destructive',
      });
    }
  });

  // Use React Query for generating recommendations
  const { 
    isPending: generating,
    mutateAsync: generateRecommendationsMutation 
  } = useMutation({
    mutationFn: async (params: Omit<GenerateRecommendationsParams, 'userId'>) => {
      if (!user) return null;
      
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          ...params
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate recommendations');
      }
      
      return await response.json() as (RecommendationSet & { items: RecommendationItem[] });
    },
    onSuccess: (data) => {
      if (data) {
        setRecommendations(prev => [data, ...prev]);
        queryClient.invalidateQueries({ queryKey: ['recommendations', user?.id] });
        
        toast({
          title: 'Recommendations Generated',
          description: 'New personalized recommendations are ready for you.',
        });
      }
    },
    onError: (error) => {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Failed to Generate Recommendations',
        description: 'An error occurred while creating recommendations.',
        variant: 'destructive',
      });
    }
  });

  // Use React Query for deleting recommendations
  const { 
    mutateAsync: deleteRecommendationSetMutation 
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recommendation set');
      }
      
      return id;
    },
    onSuccess: (id) => {
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      queryClient.invalidateQueries({ queryKey: ['recommendations', user?.id] });
      
      toast({
        title: 'Recommendations Deleted',
        description: 'The recommendation set has been removed.',
      });
    },
    onError: (error) => {
      console.error('Error deleting recommendation:', error);
      toast({
        title: 'Failed to Delete Recommendations',
        description: 'An error occurred while deleting the recommendations.',
        variant: 'destructive',
      });
    }
  });
  
  // Wrapper functions to provide a cleaner API
  const fetchRecommendations = useCallback(async () => {
    if (!user) return [];
    return await refetch();
  }, [user, refetch]);
  
  const generateRecommendations = useCallback(async (params: Omit<GenerateRecommendationsParams, 'userId'>) => {
    if (!user) return null;
    return await generateRecommendationsMutation(params);
  }, [user, generateRecommendationsMutation]);
  
  const deleteRecommendationSet = useCallback(async (id: string) => {
    try {
      await deleteRecommendationSetMutation(id);
      return true;
    } catch (error) {
      return false;
    }
  }, [deleteRecommendationSetMutation]);

  return {
    recommendations: recommendations || fetchedRecommendations || [],
    loading,
    generating,
    fetchRecommendations,
    generateRecommendations,
    deleteRecommendationSet,
  };
}