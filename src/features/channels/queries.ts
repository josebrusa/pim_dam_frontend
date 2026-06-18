import { useQuery } from '@tanstack/react-query';
import { getChannels } from './api';

export const channelsKeys = {
  all: ['channels'] as const,
};

export function useChannelsQuery() {
  return useQuery({ queryKey: channelsKeys.all, queryFn: getChannels });
}
