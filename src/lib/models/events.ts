import type { Timestamp } from 'firebase/firestore';

export type BroadcastEventType =
  | 'manual'
  | 'channel.follow'
  | 'channel.subscribe'
  | 'channel.subscription.gift'
  | 'stream.online'
  | 'stream.offline';

export const DESIRED_TWITCH_SUBSCRIPTIONS: BroadcastEventType[] = [
  'stream.online',
  'stream.offline',
  'channel.follow'
  // 'channel.subscribe',
  // 'channel.subscription.gift',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BroadcastEvent<P = any> {
  platform_id: 'twitch';
  type: BroadcastEventType;
  event: P;
  timestamp: Timestamp;
}
