<script lang="ts">
  import Highlight, { LineNumbers } from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';
  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';
  let payload = stringify({
    message: 'See you later',
    reason: 'timeout'
  });
</script>

<Container class="bg-dark p-8">
  <div class="w-full">
    <Highlight language={json} code={payload} let:highlighted>
      <LineNumbers {highlighted} hideBorder wrapLines />
    </Highlight>
  </div>
</Container>
