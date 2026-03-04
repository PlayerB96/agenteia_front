<script setup>
// Main App Component
// Acts as a layout wrapper for the router view
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>
</template>
