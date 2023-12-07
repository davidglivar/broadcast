<script lang="ts">
  let className: string;
  export { className as class };
</script>

<section class="min-h-full h-full min-w-full flex flex-col flex-1 {className}">
  <slot />
</section>
