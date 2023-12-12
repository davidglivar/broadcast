import type { LogColorStyle } from '$lib/models/logs';
import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Actions, PageServerLoad } from './$types';
import {
  clearEndedSubscriptions,
  deleteSubscription,
  getSubscriptions,
  getTwitchAccessToken,
  subscribeToEvents
} from '$lib/server/twitch';
import { DESIRED_TWITCH_SUBSCRIPTIONS } from '$lib/models/events';

export const load = (async () => {
  const subscriptions = await getSubscriptions();
  return { subscriptions };
}) satisfies PageServerLoad;

export const actions = {
  createEvent: async ({ request }) => {
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const color = (formData.get('style') ?? 'tx-light') as LogColorStyle;
    await adminDB.collection('events').doc().set({
      platform_id: 'test',
      type: 'manual',
      event: {
        message,
        color
      },
      timestamp: FieldValue.serverTimestamp()
    });
  },

  clearTwitchSubscriptions: async () => {
    const { access_token } = await getTwitchAccessToken();
    const subs = await getSubscriptions(access_token);
    for (const sub of subs) {
      await deleteSubscription(sub.id, access_token);
    }
  },

  createTwitchSubscriptions: async () => {
    const { access_token } = await getTwitchAccessToken();
    const subs = await getSubscriptions(access_token);
    const openSubs = await clearEndedSubscriptions(subs, access_token);
    const eventsToFollow = DESIRED_TWITCH_SUBSCRIPTIONS.filter(
      (s) => !openSubs.find((os) => os.type === s)
    );
    await subscribeToEvents(eventsToFollow, access_token);
  }
} satisfies Actions;
