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

      <div v-if="quizData && quizData.questions && quizData.questions.length > 0" class="quiz-container">
        <div class="question">
          <!-- ✅ Отображение изображения для IMAGE_UPLOAD -->
          <img v-if="currentQuestion.imageBase64"
               :src="'data:image/png;base64,' + currentQuestion.imageBase64"
               alt="Вопрос изображение"
               class="question-image"/>

          <!-- ✅ Текст вопроса -->
          <p class="question-text">
            {{ currentQuestion.questionText }}
          </p>

          <!-- ✅ Гарантированное отображение вариантов ответов -->
          <div v-if="currentQuestion.answers && currentQuestion.answers.length > 0">
            <!-- SINGLE_CHOICE -->
            <div v-if="currentQuestion.questionType === 'SINGLE_CHOICE'">
              <div v-for="answer in currentQuestion.answers" :key="answer.id" class="answer">
                <input
                    type="radio"
                    :value="answer.id"
                    v-model="responses[currentQuestion.id]"
                    class="radio"
                />
                <label>{{ answer.text }}</label>
              </div>
            </div>

            <!-- MULTI_CHOICE -->
            <div v-else-if="currentQuestion.questionType === 'MULTI_CHOICE'">
              <div v-for="answer in currentQuestion.answers" :key="answer.id" class="answer">
                <input
                    type="checkbox"
                    :value="answer.id"
                    :checked="responses[currentQuestion.id]?.includes(answer.id)"
                    @change="toggleMultiChoice(currentQuestion.id, answer.id)"
                    class="checkbox"
                />
                <label>{{ answer.text }}</label>
              </div>
            </div>

            <!-- IMAGE_UPLOAD: Добавлено отображение ответов -->
            <div v-else-if="currentQuestion.questionType === 'IMAGE_UPLOAD'">
              <div v-for="answer in currentQuestion.answers" :key="answer.id" class="answer">
                <input
                    type="radio"
                    :value="answer.id"
                    v-model="responses[currentQuestion.id]"
                    class="radio"
                />
                <label>{{ answer.text }}</label>
              </div>
            </div>
          </div>

          <!-- 🔥 Сообщение, если нет ответов -->
          <p v-else class="warning">Ответов нет для этого вопроса!</p>

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

const currentQuestion = computed(() => {
  return quizData.value?.questions?.[currentQuestionIndex.value] || {};
});

onMounted(async () => {
  if (!token.value) {
    ElMessage.error("Ошибка: отсутствует токен!");
    router.push('/');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/quiz/${token.value}`);
    quizData.value = response.data;
    console.log("🖼️ Base64 Length:", currentQuestion.value.imageBase64?.length || "нет изображения");
    console.log("📝 Ответы:", currentQuestion.value.answers);
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
  if (!responses.value[currentQuestion.value.id]) {
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

// ✅ Исправлена логика MULTI_CHOICE
const toggleMultiChoice = (questionId, answerId) => {
  if (!responses.value[questionId]) {
    responses.value[questionId] = [];
  }

  const index = responses.value[questionId].indexOf(answerId);
  if (index === -1) {
    responses.value[questionId].push(answerId);
  } else {
    responses.value[questionId].splice(index, 1);
  }
};

const handleSubmit = async () => {
  if (!responses.value[currentQuestion.value.id]) {
    ElMessage.warning("Выберите ответ перед отправкой!");
    return;
  }

  // Формируем ответы в нужном формате
  const formattedResponses = Object.entries(responses.value).map(([questionId, selectedAnswers]) => ({
    question: { id: parseInt(questionId) },
    answers: Array.isArray(selectedAnswers)
        ? selectedAnswers.map(answerId => ({ id: answerId }))
        : [{ id: selectedAnswers }]
  }));

  try {
    const response = await axios.post(`http://localhost:8080/api/quiz/${token.value}/submit`, {
      participantName: participantName.value,
      responses: formattedResponses
    });

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

.question-image {
  max-width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.question-text {
  font-weight: bold;
}

.answer {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.radio, .checkbox {
  margin-right: 10px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-primary, .btn-secondary, .btn-submit {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-secondary {
  background-color: #f56c6c;
  color: white;
}

.btn-submit {
  background-color: #67c23a;
  color: white;
}
</style>
