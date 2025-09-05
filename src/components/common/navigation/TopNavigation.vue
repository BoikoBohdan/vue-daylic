<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="top-navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <RouterLink to="/" class="brand-link">
          <span class="brand-text">Daily Status</span>
        </RouterLink>
      </div>

      <div class="nav-menu" :class="{ 'nav-menu-open': isMenuOpen }">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
      </div>

      <button class="nav-toggle" @click="toggleMenu" :class="{ 'nav-toggle-open': isMenuOpen }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </nav>
</template>

<style src="./TopNavigation.css" scoped></style>
