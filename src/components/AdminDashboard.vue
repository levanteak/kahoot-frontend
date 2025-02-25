<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  router.push('/');
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-box">
      <h2>Choose an action!</h2>
      <div class="dashboard-actions">
        <router-link to="/create-quiz"><button class="btn">Create Quiz</button></router-link>
        <router-link to="/add-question"><button class="btn">Add Question</button></router-link>
        <router-link to="/generate-link"><button class="btn">Create Link</button></router-link>
        <router-link to="/quiz-results"><button class="btn">View Results</button></router-link>
      </div>
      <button class="logout-btn" @click="handleLogout">Exit</button>
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

.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.dashboard-box {
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

.dashboard-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(118, 75, 162, 0.3);
}

.logout-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #ff5f5f;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.logout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 95, 95, 0.3);
}
</style>
