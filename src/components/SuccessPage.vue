<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Достаем имя и результат из параметров маршрута
const participantName = route.query.name || 'Участник';
const score = route.query.score || 0;

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="success-container">
    <h2>Спасибо за участие, {{ participantName }}! 🎉</h2>
    <p>Ваш результат: <strong>{{ score }}</strong> баллов</p>

<!--    <button @click="goHome">На главную</button>-->
  </div>
</template>

<style scoped>
.success-container {
  text-align: center;
  margin-top: 50px;
}
button {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
}
button:hover {
  background: #45a049;
}
</style>
