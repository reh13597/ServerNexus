<script lang="ts">
  let count = $state(0)

  const increment = () => {
    count += 1
  }
</script>

<button class="btn btn-primary" onclick={increment}>
  count is {count}
</button>
