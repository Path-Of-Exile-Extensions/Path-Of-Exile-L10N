<template>
    <div class="container">

    </div>
</template>
<script setup>
import {JustLogger, LanguageService, PreferenceService} from "@poel10n/extra";
import {onMounted} from "vue";

onMounted(async () => {
  await PreferenceService.Instance.initialize()
  await LanguageService.Instance.initialize()
})
</script>
<style scoped>

</style>
