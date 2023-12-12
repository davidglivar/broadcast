<script lang="ts">
  import { db } from '$lib/firebase';
  import { makeLogFromEvent, type Log } from '$lib/models/logs';
  import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
  import { afterUpdate, onMount } from 'svelte';
  import Pusher from '$lib/components/Pusher.svelte';
  import type { BroadcastEvent } from '$lib/models/events';
  import { fly } from 'svelte/transition';

  let logs: Log[] = [];
  let visible = false;
  let element: HTMLElement;

  afterUpdate(() => {
    if (logs) {
      scrollToBottom(element);
    }
  });

  $: if (logs && element) {
    visible = true;
    scrollToBottom(element);
  }

  let timeout: NodeJS.Timeout;
  const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      visible = false;
    }, 8000);
  };

  onMount(() => {
    const alertsRef = query(collection(db, 'events'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(alertsRef, (snapshot) => {
      const newLogs: Log[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          newLogs.push(makeLogFromEvent(change.doc.data() as BroadcastEvent));
        }
      });
      logs = [...newLogs, ...logs];
    });
    return () => unsubscribe();
  });
</script>

<aside
  bind:this={element}
  class="absolute max-w-md w-full h-full flex flex-col px-4 py-4 bottom-8 right-0 overflow-hidden"
  class:show={visible}
>
  <Pusher />
  <ol class="font-mono text-sm flex flex-col-reverse gap-2">
    {#each logs as log}
      <li
        class:text-rose-500={log.style.color === 'tx-red'}
        class:text-yellow-300={log.style.color === 'tx-yellow'}
        class:text-slate-400={log.style.color === 'tx-light'}
        class:text-emerald-500={log.style.color === 'tx-green'}
        class:text-blue-500={log.style.color === 'tx-blue'}
        class:text-purple-500={log.style.color === 'tx-purple'}
        class:font-bold={log.style.color.startsWith('bg-')}
        class:text-zinc-800={log.style.color.startsWith('bg-')}
        class:px-2={log.style.color.startsWith('bg-')}
        class:bg-rose-500={log.style.color === 'bg-red'}
        class:bg-yellow-300={log.style.color === 'bg-yellow'}
        class:bg-slate-400={log.style.color === 'bg-light'}
        class:bg-emerald-500={log.style.color === 'bg-green'}
        class:bg-blue-500={log.style.color === 'bg-blue'}
        class:bg-purple-500={log.style.color === 'bg-purple'}
        class="text-lg"
        in:fly={{ y: '10px' }}
      >
        {log.message}
      </li>
    {/each}
  </ol>
</aside>

<style lang="scss">
  aside {
    @apply bg-zinc-900;
    opacity: 0;
    transition: all 1000ms ease-in-out; // take longer to fade out
    pointer-events: none;

    &.show {
      opacity: 1;
      transition: all 300ms ease-out;
    }
  }
</style>
