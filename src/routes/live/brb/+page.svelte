<script>
  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';

  let payload = stringify({
    message: 'Be right back',
    reason: "I'm hiding from you"
  });
</script>

<Container class="items-start justify-start">
  <pre class="text-lg">{payload}</pre>
</Container>
