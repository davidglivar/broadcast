<script>
  import Container from '$lib/components/Container.svelte';
  import { stringify } from '$lib/utils/json';
  import { Highlight, LineNumbers } from 'svelte-highlight';
  import json from 'svelte-highlight/languages/json';

  let payload = stringify({
    message: 'Be right back',
    reason: 'forbidden'
  });
</script>

<Container class="bg-dark p-8">
  <div class="w-full">
    <Highlight language={json} code={payload} let:highlighted>
      <LineNumbers {highlighted} hideBorder wrapLines />
    </Highlight>
  </div>
</Container>
