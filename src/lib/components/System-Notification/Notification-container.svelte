<script>
  import { hintText, notifs } from '$lib/stores/global.store'
  import Notification from './Notification.svelte'
</script>

<div on:mouseenter={() => hintText.set('Click on the sort by button for Ascending o Descending')} class="pos-fix z-99 pos-r-5 pos-t-2p {$notifs.length > 0? "": "is-hidden" } z-100 maxmins-w-400-dt-to-mb-90p max-h-100v">
  {#each $notifs as notif}
    <Notification {notif} />
  {/each}
</div>