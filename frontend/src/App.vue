<script setup lang="ts">
import { ref } from 'vue';

const backendStatus = ref('Vérification...');

const checkBackend = async () => {
  try {
    const response = await fetch('/api/health');
    backendStatus.value = response.ok ? 'Backend disponible' : 'Backend indisponible';
  } catch {
    backendStatus.value = 'Backend indisponible';
  }
};

checkBackend();
</script>

<template>
  <main>
    <h1>Polls</h1>
    <p>Frontend Vue minimal en TypeScript.</p>
    <p class="status">{{ backendStatus }}</p>
  </main>
</template>
