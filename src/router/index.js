import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import CreateQuiz from '../components/CreateQuiz.vue';
import AddQuestion from '../components/AddQuestion.vue';
import GenerateLink from '../components/GenerateLink.vue';
import QuizResults from '../components/QuizResults.vue';
import QuizPage from '../components/QuizPage.vue';
import SuccessPage from '../components/SuccessPage.vue'; // ✅ Добавлено

const routes = [
  { path: '/', component: Login },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/create-quiz', component: CreateQuiz },
  { path: '/add-question', component: AddQuestion },
  { path: '/generate-link', component: GenerateLink },
  { path: '/quiz-results', component: QuizResults },
  { path: '/quiz/:token', component: QuizPage },
  { path: '/success', name: 'success', component: SuccessPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
