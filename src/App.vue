<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<style>
/* Вставляем стили из App.css */
.dashboard-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.dashboard-actions button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
