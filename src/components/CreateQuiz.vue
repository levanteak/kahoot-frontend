<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createQuiz } from '../services/api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const title = ref('');
const numQuestions = ref(5);
const validMinutes = ref(30);

const handleSubmit = async () => {
  try {
    await createQuiz({
      title: title.value,
      numQuestions: numQuestions.value,
      validMinutes: validMinutes.value
    });

    // Всплывающее сообщение (успех)
    ElMessage({
      message: 'Quiz successfully created! 🎉',
      type: 'success',
      duration: 2000,
    });

    // Редирект через 2 секунды
    setTimeout(() => router.push('/admin-dashboard'), 2000);
  } catch (error) {
    ElMessage({
      message: 'Error creating quiz. Try again.',
      type: 'error',
      duration: 3000,
    });
  }
};
</script>

<template>
  <div class="create-quiz-container">
    <div class="create-quiz-box">
      <h2>Create Quiz</h2>
      <form @submit.prevent="handleSubmit">
        <label>Title:</label>
        <input v-model="title" type="text" placeholder="Enter quiz title" required />

        <label>Number of Questions:</label>
        <input v-model="numQuestions" type="number" min="1" max="50" required />

        <label>Valid Minutes:</label>
        <input v-model="validMinutes" type="number" min="1" max="180" required />

        <button type="submit">Create Quiz</button>
      </form>
      <button @click="router.push('/admin-dashboard')" class="back-button">Back to Dashboard</button>
    </div>
  </div>
</template>


<style scoped>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-quiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.create-quiz-box {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 400px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

button[type="submit"] {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

button[type="submit"]:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.3);
}

.back-button {
  margin-top: 15px;
  background: #e0e0e0;
  color: #333;
}

.back-button:hover {
  background: #d6d6d6;
  transform: translateY(-2px);
}
</style>
