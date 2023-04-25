<template>
    <div class="container">

    </div>
</template>
<script setup>
import {LanguageService} from "@poel10n/extra";
import {onMounted} from "vue";

onMounted(() => {
  console.log("??")
  LanguageService.Instance
    .initialize(() => {
      debugger
    })
})
</script>
<style scoped>

</style>
