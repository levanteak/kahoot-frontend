<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter();
const URL = "http://localhost:8080";
const quizzes = ref([]);
const selectedQuiz = ref(null);
const questionText = ref('');
const questionType = ref('SINGLE_CHOICE');
const imageBase64 = ref('');
const imagePreview = ref('');
const imageScale = ref(1);

const answers = ref([
  { text: '', correct: false }
]);

onMounted(async () => {
  try {
    const response = await axios.get(`${URL}/api/admin/quizzes`);
    quizzes.value = response.data;
  } catch (error) {
    ElMessage.error("Ошибка загрузки квизов");
  }
});

watch(questionType, (newType, oldType) => {
  if (oldType === 'IMAGE_UPLOAD' && newType !== 'IMAGE_UPLOAD') {
    imageBase64.value = '';
    imagePreview.value = '';
  }
});

const toggleCorrectAnswer = (index) => {
  if (questionType.value === 'SINGLE_CHOICE' || questionType.value === 'IMAGE_UPLOAD') {
    answers.value.forEach((answer, i) => {
      answer.correct = i === index;
    });
  } else if (questionType.value === 'MULTI_CHOICE') {
    answers.value[index].correct = !answers.value[index].correct;
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
    imageBase64.value = reader.result.split(',')[1];
  };
  reader.readAsDataURL(file);
};

const zoomIn = () => {
  imageScale.value += 0.1;
};
const zoomOut = () => {
  if (imageScale.value > 0.3) imageScale.value -= 0.1;
};

const addAnswer = () => {
  answers.value.push({ text: '', correct: false });
};

const removeAnswer = (index) => {
  if (answers.value.length > 1) {
    answers.value.splice(index, 1);
  }
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
  if (questionType.value === 'SINGLE_CHOICE' && correctAnswers.length !== 1) {
    ElMessage.warning("Для SINGLE_CHOICE выберите ровно один правильный ответ!");
    return;
  }
  if (questionType.value === 'MULTI_CHOICE' && correctAnswers.length < 1) {
    ElMessage.warning("Для MULTI_CHOICE выберите хотя бы один правильный ответ!");
    return;
  }
  if (questionType.value === 'IMAGE_UPLOAD' && !imageBase64.value) {
    ElMessage.warning("Загрузите изображение для IMAGE_UPLOAD!");
    return;
  }

  try {
    await axios.post(`${URL}/api/admin/questions`, {
      questionText: questionText.value,
      quizId: selectedQuiz.value,
      questionType: questionType.value,
      answers: answers.value,
      imageBase64: questionType.value === 'IMAGE_UPLOAD' ? imageBase64.value : null,
    });

    ElMessage.success("Вопрос успешно добавлен!");
    questionText.value = '';
    imageBase64.value = '';
    imagePreview.value = '';
    imageScale.value = 1;
    answers.value = [{ text: '', correct: false }];
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

    <label for="questionType">Тип вопроса:</label>
    <select v-model="questionType" id="questionType" class="dropdown" @change="resetImageIfNeeded">
      <option value="SINGLE_CHOICE">Один правильный ответ</option>
      <option value="MULTI_CHOICE">Несколько правильных ответов</option>
      <option value="IMAGE_UPLOAD">Вопрос с изображением</option>
    </select>

    <div v-if="questionType === 'IMAGE_UPLOAD'" class="image-upload">
      <label>Загрузите изображение:</label>
      <input type="file" @change="handleImageUpload" accept="image/*" class="input-file"/>
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" :style="{ transform: `scale(${imageScale})` }" />
        <div class="zoom-buttons">
          <button @click="zoomOut">−</button>
          <button @click="zoomIn">+</button>
        </div>
      </div>
    </div>

    <div class="answers">
      <label>Ответы:</label>
      <div v-for="(answer, index) in answers" :key="index" class="answer-row">
        <input v-model="answer.text" type="text" class="input" placeholder="Введите ответ" required />

        <input
            v-if="questionType === 'MULTI_CHOICE'"
            type="checkbox"
            v-model="answer.correct"
        />

        <input
            v-if="questionType === 'SINGLE_CHOICE' || questionType === 'IMAGE_UPLOAD'"
            type="radio"
            name="correct-answer"
            :value="index"
            @change="toggleCorrectAnswer(index)"
        />

        <button v-if="answers.length > 1" @click="removeAnswer(index)" class="btn-delete">✖</button>
      </div>

      <button @click="addAnswer" class="btn-add">Добавить вариант</button>
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

.image-upload {
  margin-top: 15px;
}

.image-preview {
  margin-top: 10px;
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  transition: transform 0.2s ease-in-out;
}

.zoom-buttons {
  margin-top: 5px;
}

.zoom-buttons button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 2px;
  cursor: pointer;
  border-radius: 5px;
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

.btn-add {
  background-color: #67c23a;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.btn-delete {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

.btn-primary, .btn-secondary {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary {
  background-color: #409eff;
  color: white;
}

.btn-secondary {
  background-color: #f56c6c;
  color: white;
}
</style>

