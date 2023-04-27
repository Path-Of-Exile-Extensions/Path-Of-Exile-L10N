<template>
    <div class="container">

    </div>
</template>
<script setup>
import {CharacterService, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";

onMounted(async () => {
  await PreferenceService.Instance.initialize()
  await CharacterService.Instance.initialize()
})
</script>
<style scoped>

</style>
