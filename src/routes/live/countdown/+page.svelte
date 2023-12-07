<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import formatDuration from 'format-duration';

  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';
  let searchParams = $page.url.searchParams;
  let countdown_minutes = Number(searchParams.get('countdown_minutes') ?? '10');

  let seconds = countdown_minutes * 60;
  $: millis = seconds * 1000;
  $: payload = stringify({
    seconds,
    formatted: formatDuration(millis)
  });

  let timeout: NodeJS.Timeout;
  onMount(() => {
    timeout = setInterval(() => {
      let nextSeconds = seconds - 1;
      seconds = nextSeconds <= 0 ? 0 : nextSeconds;
    }, 1000);
    return () => clearTimeout(timeout);
  });
</script>

<Container class="items-center justify-center">
  <pre class="flex text-xl">{payload}</pre>
</Container>
