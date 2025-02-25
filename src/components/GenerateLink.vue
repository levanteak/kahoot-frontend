<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const URL = "http://localhost:8080";
const quizzes = ref([]);
const selectedQuiz = ref(null);
const expirationMinutes = ref(60);
const generatedLink = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(`${URL}/api/admin/quizzes`);
    quizzes.value = response.data;
  } catch (error) {
    ElMessage.error("Ошибка загрузки квизов");
  }
});

const handleGenerateLink = async () => {
  if (!selectedQuiz.value) {
    ElMessage.warning("Выберите тему для генерации ссылки!");
    return;
  }

  if (expirationMinutes.value < 1) {
    ElMessage.warning("Время жизни ссылки должно быть больше 0!");
    return;
  }

  try {
    const response = await axios.post(`${URL}/api/admin/links`, {
      quizId: selectedQuiz.value,
      expirationMinutes: expirationMinutes.value
    });

    generatedLink.value = `http://localhost:3000/quiz/${response.data.token}`;
    ElMessage.success("Ссылка успешно сгенерирована!");
  } catch (error) {
    ElMessage.error("Ошибка при создании ссылки");
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value);
    ElMessage.success("Ссылка скопирована в буфер обмена!");
  } catch (error) {
    ElMessage.error("Ошибка при копировании ссылки");
  }
};
</script>

<template>
  <div class="container">
    <h2>Генерация ссылки</h2>

    <label for="quiz">Выберите тему:</label>
    <select v-model="selectedQuiz" id="quiz" class="dropdown">
      <option disabled value="">Выберите тему</option>
      <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
        {{ quiz.title }}
      </option>
    </select>

    <label for="expiration">Время жизни (минуты):</label>
    <input v-model="expirationMinutes" type="number" id="expiration" class="input" min="1" required />

    <div class="buttons">
      <button @click="handleGenerateLink" class="btn-primary">Сгенерировать</button>
      <button @click="router.push('/admin-dashboard')" class="btn-secondary">Назад</button>
    </div>

    <div v-if="generatedLink" class="link-container">
      <p>Ссылка: <a :href="generatedLink" target="_blank">{{ generatedLink }}</a></p>
      <button @click="copyToClipboard" class="btn-copy">Копировать</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

.dropdown, .input {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.buttons {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.btn-primary {
  background-color: #409eff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  background-color: #337ecc;
}

.btn-secondary {
  background-color: #f56c6c;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-secondary:hover {
  background-color: #d9534f;
}

.link-container {
  margin-top: 15px;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-copy {
  background-color: #67c23a;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-copy:hover {
  background-color: #5aaf2b;
}
</style>
