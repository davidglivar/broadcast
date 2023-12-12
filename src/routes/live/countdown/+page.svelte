<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import formatDuration from 'format-duration';
  import Highlight, { LineNumbers } from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';
  let searchParams = $page.url.searchParams;
  let countdown_minutes = Number(searchParams.get('countdown_minutes') ?? '10');

  let seconds = countdown_minutes * 60;
  $: millis = seconds * 1000;
  $: formatted = formatDuration(millis);
  $: payload = stringify({
    message: `Starting in ${formatted}`,
    as_seconds: seconds
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

<Container class="bg-dark p-8">
  <div class="w-full">
    <Highlight language={json} code={payload} let:highlighted>
      <LineNumbers {highlighted} hideBorder wrapLines />
    </Highlight>
  </div>
</Container>
