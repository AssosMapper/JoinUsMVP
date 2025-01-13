<script setup lang="ts">
import NewsLetters from './NewsLetters.vue';
</script>

<template>
  <footer class="footer-container d-flex justify-between items-center p-4 bg-primary-hover">
    <div class="footer-links d-flex text-">
      <router-link to="/contactUs">Nous contacter</router-link> |
      <router-link to="/aboutUs">Qui sommes-nous ?</router-link> |
      <router-link to="/aboutUs">Charte d'utilisation</router-link> |
      <router-link to="/aboutUs">Mentions légales</router-link> 
    </div>
    <div class="newsletter">
      <NewsLetters />
    </div>
  </footer>
</template>

<style scoped>
.footer-links {
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
