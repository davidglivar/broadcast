<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import formatDuration from 'format-duration';

  let searchParams = $page.url.searchParams;
  let countdown_minutes = Number(searchParams.get('countdown_minutes') ?? '10');

  let seconds = countdown_minutes * 60;

  let timeout: NodeJS.Timeout;
  onMount(() => {
    timeout = setInterval(() => {
      seconds = seconds -= 1;
      if (seconds <= 0) {
        seconds = 0;
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<main class="hero min-h-screen">
  <div class="hero-content text-center flex flex-col">
    <h1 class="text-5xl font-bold">
      {formatDuration(seconds * 1000)} remaining
    </h1>
  </div>
</main>
