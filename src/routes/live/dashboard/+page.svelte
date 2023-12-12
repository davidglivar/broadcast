<script lang="ts">
  import { enhance } from '$app/forms';
  import { navigating } from '$app/stores';
  import Container from '$lib/components/Container.svelte';
  import Pusher from '$lib/components/Pusher.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<Container class="bg-dark p-8">
  <Pusher />
  <div class="w-full font-mono flex flex-col gap-4">
    <h2 class="text-2xl font-bold">Twitch eventsub management</h2>
    <div class="flex text-sm gap-2">
      <p>Subscribed to:</p>
      <ul class="flex flex-wrap items-center gap-2">
        {#each data.subscriptions as sub}
          <li>{sub.type}</li>
        {/each}
      </ul>
    </div>

    <div class="flex gap-4">
      <form method="post" action="?/clearTwitchSubscriptions" use:enhance>
        <button
          class="text-base rounded-none bg-rose-400 py-2 px-4 font-bold text-zinc-800 hover:bg-rose-500 focus:bg-rose-500 disabled:bg-slate-400"
          disabled={Boolean($navigating) || data.subscriptions.length === 0}
          >Clear Twitch Subscriptions</button
        >
      </form>

      <form method="post" action="?/createTwitchSubscriptions" use:enhance>
        <button
          class="rounded-none text-base bg-cyan-400 py-2 px-4 font-bold text-zinc-800 hover:bg-cyan-500 focus:bg-cyan-500"
          disabled={Boolean($navigating)}>Create Twitch Subscriptions</button
        >
      </form>
    </div>

    <form method="post" action="?/createEvent" class="flex flex-col gap-2 mt-4" use:enhance>
      <h2 class="text-2xl font-bold">Manual event</h2>
      <input
        class="bg-zinc-900"
        type="text"
        name="message"
        autocomplete="off"
        placeholder="Event message"
      />
      <select class="bg-zinc-900" name="style">
        <option selected>Select style</option>
        <option value="tx-red">Red Text</option>
        <option value="bg-red">Red Background</option>
        <option value="tx-yellow">Yellow Text</option>
        <option value="bg-yellow">Yellow Background</option>
        <option value="tx-light">Light Text</option>
        <option value="bg-light">Light Background</option>
        <option value="tx-green">Green Text</option>
        <option value="bg-green">Green Background</option>
        <option value="tx-blue">Blue Text</option>
        <option value="bg-blue">Blue Background</option>
        <option value="tx-purple">Purple Text</option>
        <option value="bg-purple">Purple Background</option>
      </select>
      <button
        class="rounded-none text-base bg-cyan-400 py-2 px-4 font-bold text-zinc-800 hover:bg-cyan-500 focus:bg-cyan-500"
        disabled={Boolean($navigating)}>Trigger</button
      >
    </form>
  </div>
</Container>
