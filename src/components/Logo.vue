<template>
  <div style="line-height: 0; color: rgb(33, 53, 148)" class="logo">
    <img :src="imageSrc" height="128px" alt="Starlink Logo">
  </div>
</template>

<script setup>
import { ref } from 'vue';
const imageSrc = ref('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Starlink_Logo.svg/800px-Starlink_Logo.svg.png');
</script>
