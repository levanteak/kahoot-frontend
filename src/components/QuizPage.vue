<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const token = computed(() => route.params.token || "");

const quizData = ref(null);
const responses = ref({});
const participantName = ref('');
const isNameEntered = ref(false);
const currentQuestionIndex = ref(0);

onMounted(async () => {
  if (!token.value) {
    ElMessage.error("Ошибка: отсутствует токен!");
    router.push('/');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/quiz/${token.value}`);
    // console.log("Полученные данные:", response.data); // ✅ Проверка API ответа
    quizData.value = response.data;
  } catch {
    ElMessage.error("Ошибка загрузки квиза");
  }
});

const handleStart = () => {
  if (!participantName.value.trim()) {
    ElMessage.warning("Введите ваше имя!");
    return;
  }
  isNameEntered.value = true;
};

const handleNext = () => {
  if (!responses.value[quizData.value.questions[currentQuestionIndex.value].id]) {
    ElMessage.warning("Выберите ответ перед переходом!");
    return;
  }
  if (currentQuestionIndex.value < quizData.value.questions.length - 1) {
    currentQuestionIndex.value++;
  }
};

const handlePrev = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const handleSubmit = async () => {
  if (!responses.value[quizData.value.questions[currentQuestionIndex.value].id]) {
    ElMessage.warning("Выберите ответ перед отправкой!");
    return;
  }

  const formattedResponses = Object.entries(responses.value).map(([questionId, answerId]) => ({
    answer: { id: answerId },
    question: { id: parseInt(questionId) }
  }));

  try {
    const response = await axios.post(`http://localhost:8080/api/quiz/${token.value}/submit`, {
      participantName: participantName.value,
      responses: formattedResponses
    });

    // console.log("✅ Успешный ответ API:", response);

    // ✅ Проверка, что в response есть нужные данные
    if (response.status === 200 && response.data && response.data.participantName && response.data.score !== undefined) {
      router.push({
        name: 'success',
        query: { name: response.data.participantName, score: response.data.score }
      });
    } else {
      throw new Error("Некорректный ответ сервера");
    }

  } catch (error) {
    console.error("❌ Ошибка при отправке:", error);
    ElMessage.error("Ошибка отправки ответов");
  }
};


</script>

<template>
  <div class="container">
    <div v-if="!isNameEntered" class="name-input">
      <h2>Введите ваше имя</h2>
      <input v-model="participantName" type="text" placeholder="Ваше имя" class="input" required />
      <button @click="handleStart" class="btn-primary">Начать</button>
    </div>

    <div v-else>
      <h2 v-if="quizData">{{ quizData.link.quiz.title }}</h2>
      <p v-else>Загрузка...</p>

      <!-- ✅ Добавили проверку quizData и вопросов -->
      <div v-if="quizData && quizData.questions && quizData.questions.length > 0" class="quiz-container">
        <div class="question">
          <!-- ✅ Проверяем, что текущий вопрос существует -->
          <p class="question-text" v-if="quizData.questions[currentQuestionIndex]">
            {{ quizData.questions[currentQuestionIndex].questionText }}
          </p>
          <p v-else>Ошибка: Вопрос не найден</p>

          <div v-if="quizData.questions[currentQuestionIndex]">
            <div v-for="answer in quizData.questions[currentQuestionIndex].answers" :key="answer.id" class="answer">
              <input
                  type="radio"
                  :value="answer.id"
                  v-model="responses[quizData.questions[currentQuestionIndex].id]"
                  class="radio"
              />
              <label>{{ answer.text }}</label>
            </div>
          </div>
        </div>

        <div class="buttons">
          <button @click="handlePrev" class="btn-secondary" v-if="currentQuestionIndex > 0">Назад</button>
          <button @click="handleNext" class="btn-primary" v-if="currentQuestionIndex < quizData.questions.length - 1">
            Далее
          </button>
          <button @click="handleSubmit" class="btn-submit" v-if="currentQuestionIndex === quizData.questions.length - 1">
            Отправить
          </button>
        </div>
      </div>

      <p v-else>Загрузка вопросов...</p>
    </div>
  </div>
</template>


<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.name-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.input {
  padding: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.quiz-container {
  margin-top: 20px;
  text-align: left;
}

.question {
  margin-bottom: 20px;
}

.question-text {
  font-weight: bold;
}

.answer {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.radio {
  margin-right: 10px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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

.btn-submit {
  background-color: #67c23a;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-submit:hover {
  background-color: #5aaf2b;
}
</style>
