<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const quizzes = ref([]);
const selectedQuiz = ref(null);
const results = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(() => {
  axios.get("http://localhost:8080/api/admin/quizzes")
      .then(response => quizzes.value = response.data)
      .catch(() => error.value = "Ошибка при загрузке данных");
});

const fetchResults = (quiz) => {
  loading.value = true;
  selectedQuiz.value = quiz;

  axios.get(`http://localhost:8080/api/admin/results/${quiz.id}`)
      .then(response => results.value = response.data)
      .catch(() => error.value = "Ошибка при загрузке данных")
      .finally(() => loading.value = false);
};
</script>

<template>
  <div class="container">
    <h2>📊 Результаты квизов</h2>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="!selectedQuiz" class="quiz-list">
      <h3>Выберите тему 📌</h3>
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Название квиза</th>
          <th>Вопросов</th>
          <th>Действие</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(quiz, index) in quizzes" :key="quiz.id">
          <td>{{ index + 1 }}</td>
          <td>{{ quiz.title }}</td>
          <td>{{ quiz.numQuestions }}</td>
          <td>
            <button class="view-btn" @click="fetchResults(quiz)">📊 Посмотреть</button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Кнопка назад на главную -->
      <button class="back-btn" @click="$router.push('/admin-dashboard')">⬅ Назад в меню</button>
    </div>

    <p v-if="loading" class="loading">⏳ Загрузка...</p>

    <div v-if="selectedQuiz && !loading" class="results-section">
      <h3>🏆 Результаты: <span>{{ selectedQuiz.title }}</span></h3>
      <table v-if="results.length">
        <thead>
        <tr>
          <th>👤 Имя</th>
          <th>✅ Правильные ответы</th>
          <th>❓ Всего вопросов</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="result in results" :key="result.id">
          <td>{{ result.name }}</td>
          <td>{{ result.score }}</td>
          <td>{{ selectedQuiz.numQuestions }}</td>
        </tr>
        </tbody>
      </table>
      <p v-else>🔍 Нет данных о результатах.</p>

      <!-- Кнопка назад к выбору квизов -->
      <button class="back-btn" @click="selectedQuiz = null">⬅ Назад</button>
    </div>
  </div>
</template>


<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
  color: white;
}

h2, h3 {
  margin-bottom: 20px;
}

.quiz-list, .results-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
}

.loading {
  font-weight: bold;
  font-size: 18px;
}

.error {
  color: #ff5f5f;
  font-weight: bold;
}

th {
  background: #667eea;
  color: white;
  padding: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.view-btn, .back-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.view-btn:hover, .back-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.3);
}
</style>
