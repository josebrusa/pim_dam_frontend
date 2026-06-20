import { http } from '@/shared/api/http';
import type { ChannelForm, ChannelUpdateForm, ChannelsResponse } from './types';

export async function getChannels() {
  const { data } = await http.get<ChannelsResponse>('/channels');
  return data;
}

export async function syncAllChannels() {
  return http.post('/channels/sync-all');
}

export async function createChannel(body: ChannelForm) {
  return http.post('/channels', body);
}

export async function updateChannel(id: string, body: ChannelUpdateForm) {
  return http.patch(`/channels/${id}`, body);
}

export async function deleteChannel(id: string) {
  return http.delete(`/channels/${id}`);
}
