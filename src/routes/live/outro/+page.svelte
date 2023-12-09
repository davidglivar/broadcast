<script lang="ts">
  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';
  let payload = stringify({
    message: 'See you later',
    reason: 'timeout'
  });
</script>

<Container>
  <pre>{payload}</pre>
</Container>
