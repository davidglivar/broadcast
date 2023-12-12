import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import crypto from 'crypto';
import { WEBHOOKS_SECRET } from '$env/static/private';
import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { BroadcastEvent } from '$lib/models/events';

// ref: https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#simple-nodejs-example

async function getHmacMessage(request: Request, text: string) {
  return (
    request.headers.get('twitch-eventsub-message-id')! +
    request.headers.get('twitch-eventsub-message-timestamp')! +
    text
  );
}

function getHmac(message: string) {
  return crypto.createHmac('sha256', WEBHOOKS_SECRET).update(message).digest('hex');
}

function verifyMessage(hmac: string, verifySignature: string) {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

export const POST: RequestHandler = async ({ request }) => {
  const text = await request.text();
  const body = JSON.parse(text);
  const message = await getHmacMessage(request, text);
  const eventId = getHmac(message);
  const hmac = 'sha256=' + eventId;
  const signature = request.headers.get('twitch-eventsub-message-signature')!;
  if (verifyMessage(hmac, signature)) {
    if (request.headers.get('twitch-eventsub-message-type') === 'webhook_callback_verification') {
      const response = new Response(body.challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      return response;
    } else {
      await adminDB
        .collection('events')
        .doc(eventId)
        .set(
          {
            platform_id: 'twitch',
            type: body.subscription.type,
            event: body.event,
            timestamp: FieldValue.serverTimestamp()
          } as BroadcastEvent,
          { merge: true }
        );
    }
  } else {
    console.error('message unverified');
  }
  return json({ ok: true });
};
