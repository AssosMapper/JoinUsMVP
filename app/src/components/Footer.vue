<script setup lang="ts">
import NewsLetters from './NewsLetters';
</script>

<template>
  <footer class="footer-container">
    <div class="footer-links">
      <router-link to="/contactUs">Nous contacter</router-link> |
      <router-link to="/aboutUs">About us</router-link>
    </div>
    <div class="newsletter">
      <NewsLetters />
    </div>
  </footer>
</template>

<style scoped>
.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f8f8;
  border-top: 1px solid #e7e7e7;
}

.footer-links {
  display: flex;
  gap: 0.5rem;
  order: 2; 
}

.newsletter {
  display: flex;
  order: 1; /* Display newsletter first on desktop */
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }

  .footer-links {
    justify-content: center;
    margin-bottom: 1rem;
    order: 1; /* Display links first on mobile */
  }

  .newsletter {
    justify-content: center;
    order: 2; /* Display newsletter second on mobile */
  }
}
</style>
