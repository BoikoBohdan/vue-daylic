<script setup lang="ts">
import { RouterView } from 'vue-router'
import { TopNavigation } from './components'
</script>

<template>
  <div id="app">
    <TopNavigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style src="./App.css"></style>
