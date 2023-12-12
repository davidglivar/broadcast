import { TUNNEL_URL, TWITCH_CLIENT_SECRET, WEBHOOKS_SECRET } from '$env/static/private';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import type { BroadcastEventType } from '$lib/models/events';

export const TWITCH_API = 'https://api.twitch.tv/helix';
export const TYPOV_TWITCH_ID = '999523954';

export async function getTwitchAccessToken() {
  const searchParams = new URLSearchParams();
  searchParams.set('client_id', PUBLIC_TWITCH_CLIENT_ID);
  searchParams.set('client_secret', TWITCH_CLIENT_SECRET);
  searchParams.set('grant_type', 'client_credentials');
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: searchParams.toString()
  });
  const data = await res.json();
  return {
    access_token: data.access_token as string,
    expires_in: data.expires_in as number,
    token_type: data.token_type as string
  };
}

export async function getMyUser() {
  const { access_token } = await getTwitchAccessToken();
  const res = await fetch(`${TWITCH_API}/users?login=typov_dev`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': PUBLIC_TWITCH_CLIENT_ID
    }
  });
  const data = await res.json();
  return data?.data?.at(0);
}

export interface SubInfo {
  id: string;
  type: string;
  status: string;
}

export async function getSubscriptions(access_token?: string): Promise<SubInfo[]> {
  access_token = access_token ?? (await getTwitchAccessToken()).access_token;
  const res = await fetch(`${TWITCH_API}/eventsub/subscriptions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': PUBLIC_TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    }
  });
  const body = await res.json();
  const subs = body.data.slice() ?? [];
  return subs.map((sub: Record<string, string>) => ({
    id: sub.id as string,
    type: sub.type as string,
    status: sub.status as string
  }));
}

export async function deleteSubscription(id: string, access_token: string) {
  console.log('Deleting subscription:', id);
  await fetch(`${TWITCH_API}/eventsub/subscriptions?id=${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': PUBLIC_TWITCH_CLIENT_ID
    }
  });
}

export async function clearEndedSubscriptions(
  subs: SubInfo[],
  access_token?: string
): Promise<SubInfo[]> {
  access_token = access_token ?? (await getTwitchAccessToken()).access_token;
  const openSubs: SubInfo[] = [];
  for (const sub of subs) {
    if (['webhook_callback_verification_failed'].includes(sub.status)) {
      await deleteSubscription(sub.id, access_token);
    } else {
      openSubs.push(sub);
    }
  }
  return openSubs;
}

export async function subscribeToEvent(
  event: BroadcastEventType,
  version: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: Record<string, any>,
  access_token?: string
) {
  console.log('Subscribing to', event);
  access_token = access_token ?? (await getTwitchAccessToken()).access_token;
  await fetch(`${TWITCH_API}/eventsub/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Client-Id': PUBLIC_TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: event,
      version,
      condition,
      transport: {
        method: 'webhook',
        callback: `${TUNNEL_URL}/hooks/twitch`,
        secret: WEBHOOKS_SECRET
      }
    })
  });
}

export async function subscribeToEvents(events: BroadcastEventType[], access_token?: string) {
  access_token = access_token ?? (await getTwitchAccessToken()).access_token;
  for (const event of events) {
    if (event === 'channel.follow') {
      await subscribeToEvent(
        event,
        '2',
        {
          broadcaster_user_id: TYPOV_TWITCH_ID,
          moderator_user_id: TYPOV_TWITCH_ID
        },
        access_token
      );
    } else if (
      [
        'channel.subscribe',
        'channel.subscription.gift',
        'stream.online',
        'stream.offline'
      ].includes(event)
    ) {
      await subscribeToEvent(event, '1', { broadcaster_user_id: TYPOV_TWITCH_ID }, access_token);
    }
  }
}
