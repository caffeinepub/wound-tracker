import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { APIWoundMeasurement } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetAllMeasurements() {
  const { actor, isFetching } = useActor();

  return useQuery<APIWoundMeasurement[]>({
    queryKey: ['measurements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMeasurements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMeasurement(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<APIWoundMeasurement | null>({
    queryKey: ['measurement', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMeasurement(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useMeasureWound() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      image: ExternalBlob;
      area: number;
      perimeter: number;
      circularity: number;
      textureSmoothness: number;
      edgeSharpness: number;
      exudateLevel: number;
      redPercentage: number;
      pinkPercentage: number;
      yellowPercentage: number;
      blackPercentage: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.measureWound(
        params.id,
        params.image,
        params.area,
        params.perimeter,
        params.circularity,
        params.textureSmoothness,
        params.edgeSharpness,
        params.exudateLevel,
        params.redPercentage,
        params.pinkPercentage,
        params.yellowPercentage,
        params.blackPercentage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });
}

export function useDeleteMeasurement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMeasurement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['measurements'] });
    },
  });
}
