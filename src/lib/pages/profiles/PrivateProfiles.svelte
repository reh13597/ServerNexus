<script lang="ts">
    import ListElement from '../../components/ListElement.svelte';
    import { privateProfiles } from '../../stores/profiles';
    $privateProfiles = true;
</script>

<div>
    <h1 class="text-4xl font-bold mt-10">Create and view your own server profiles!</h1>
</div>

<div class="max-w-2xl mx-auto mt-15">
    <ul class="list bg-base-100 rounded-box shadow-md max-h-[60vh] overflow-y-auto">
        <ListElement number=1 username="reh13597" host="hypixel.net" />
        <ListElement number=2 username="kevdawg33" host="stray.gg" />
        <ListElement number=3 username="notch" host="minehut.gg" />
    </ul>
</div>
