import type { BroadcastEvent } from './events';

export type LogColorStyle =
  | 'tx-red'
  | 'bg-red'
  | 'tx-yellow'
  | 'bg-yellow'
  | 'tx-light'
  | 'bg-light'
  | 'tx-green'
  | 'bg-green'
  | 'tx-blue'
  | 'bg-blue'
  | 'tx-purple'
  | 'bg-purple';

export interface LogStyle {
  color: LogColorStyle;
  size?: number;
}

export interface Log {
  message: string;
  timestamp: Date;
  style: LogStyle;
}

export function makeLogFromEvent(e: BroadcastEvent): Log {
  const { type, event } = e;
  const timestamp = e.timestamp.toDate() ?? new Date();
  if (type === 'manual') {
    return {
      message: event.message,
      style: { color: event.color },
      timestamp
    };
  } else if (type === 'channel.follow') {
    return {
      message: `${event.user_name} followed! 👋`,
      style: { color: 'tx-green' },
      timestamp
    };
  } else if (type === 'channel.subscribe') {
    return {
      message: `${event.user_name} subscribed at tier ${event.tier ?? 1}! 💖`,
      style: { color: 'tx-purple' },
      timestamp
    };
  } else if (type === 'channel.subscription.gift') {
    return {
      message: `${event.is_anonymous ? 'anon' : event.user_name} gifted ${
        event.total ?? 1
      } subs at tier ${event.tier ?? 1}! ✨`,
      style: { color: 'bg-purple' },
      timestamp
    };
  } else if (type === 'stream.online') {
    return {
      message: `${event.broadcaster_user_name} is live`,
      style: { color: 'bg-light' },
      timestamp
    };
  } else if (type === 'stream.offline') {
    return {
      message: `${event.broadcaster_user_name} is offline`,
      style: { color: 'tx-light' },
      timestamp
    };
  }
  return { message: '', style: { color: 'tx-light' }, timestamp };
}
