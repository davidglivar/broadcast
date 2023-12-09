<script lang="ts">
  let className: string | undefined = '';
  export { className as class };
</script>

<section
  class="container min-h-full h-full min-w-full flex flex-col flex-1 items-start justify-start {className}"
>
  <slot />
</section>
