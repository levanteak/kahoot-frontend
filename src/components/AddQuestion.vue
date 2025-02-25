<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const URL = "http://localhost:8080";
const quizzes = ref([]);
const selectedQuiz = ref(null);
const questionText = ref('');
const answers = ref([
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
]);

const correctAnswerIndex = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get(`${URL}/api/admin/quizzes`);
    quizzes.value = response.data;
  } catch (error) {
    ElMessage.error("Ошибка загрузки квизов");
  }
});

const setCorrectAnswer = (index) => {
  correctAnswerIndex.value = index;
  answers.value.forEach((answer, i) => {
    answer.correct = i === index;
  });
};

const handleSubmit = async () => {
  if (!selectedQuiz.value) {
    ElMessage.warning("Выберите тему для вопроса!");
    return;
  }

  if (!questionText.value.trim()) {
    ElMessage.warning("Введите текст вопроса!");
    return;
  }

  if (answers.value.some(answer => !answer.text.trim())) {
    ElMessage.warning("Все ответы должны быть заполнены!");
    return;
  }

  const correctAnswers = answers.value.filter(answer => answer.correct);
  if (correctAnswers.length !== 1) {
    ElMessage.warning("Должен быть выбран ровно один правильный ответ!");
    return;
  }

  try {
    await axios.post(`${URL}/api/admin/questions`, {
      questionText: questionText.value,
      quizId: selectedQuiz.value,
      answers: answers.value,
    });

    ElMessage.success("Вопрос успешно добавлен!");
    questionText.value = '';
    correctAnswerIndex.value = null;
    answers.value = answers.value.map(() => ({ text: '', correct: false }));
  } catch (error) {
    ElMessage.error("Ошибка при добавлении вопроса");
  }
};
</script>

<template>
  <div class="container">
    <h2>Добавить Вопрос</h2>

    <label for="quiz">Выберите тему:</label>
    <select v-model="selectedQuiz" id="quiz" class="dropdown">
      <option disabled value="">Выберите тему</option>
      <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
        {{ quiz.title }}
      </option>
    </select>

    <label for="question">Текст вопроса:</label>
    <input v-model="questionText" type="text" id="question" class="input" placeholder="Введите вопрос" required />

    <div class="answers">
      <label>Ответы:</label>
      <div v-for="(answer, index) in answers" :key="index" class="answer-row">
        <input v-model="answer.text" type="text" class="input" placeholder="Введите ответ" required />
        <input type="radio" name="correct-answer" :value="index" v-model="correctAnswerIndex" @change="setCorrectAnswer(index)" />
      </div>
    </div>

    <div class="buttons">
      <button @click="handleSubmit" class="btn-primary">Добавить Вопрос</button>
      <button @click="router.push('/admin-dashboard')" class="btn-secondary">Назад</button>
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

.answers {
  margin-top: 15px;
}

.answer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
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
</style>
