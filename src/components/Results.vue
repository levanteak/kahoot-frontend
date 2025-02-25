<script setup>
import { ref, watchEffect } from 'vue';
import { getResults } from '../services/api';

const props = defineProps({
  quizId: Number
});

const results = ref([]);

watchEffect(() => {
  if (props.quizId) {
    getResults(props.quizId).then(response => {
      results.value = response.data;
    });
  }
});
</script>

<template>
  <div>
    <h2>Quiz Results</h2>
    <ul>
      <li v-for="participant in results" :key="participant.id">
        {{ participant.name }}: {{ participant.score }}
      </li>
    </ul>
  </div>
</template>
