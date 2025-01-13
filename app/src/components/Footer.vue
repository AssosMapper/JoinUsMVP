<script setup lang="ts">
import NewsLetters from './NewsLetters.vue';
</script>

<template>
  <footer class="footer-container d-flex justify-between items-center p-4 bg-primary-hover">
    <div class="footer-links d-flex flex-wrap">
      <router-link to="/contactUs">Nous contacter <span class="separator">|</span></router-link> 
      <router-link to="/aboutUs">Qui sommes-nous ? <span class="separator">|</span></router-link> 
      <router-link to="/aboutUs">Charte d'utilisation <span class="separator">|</span></router-link> 
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
  order: 1;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }

  .footer-links {
    justify-content: center;
    margin-bottom: 1rem;
    order: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    gap: 1rem;
  }

  .footer-links a {
    text-align: center;
  }

  .separator {
    display: none;
  }

  .newsletter {
    display: none;
  }
}
</style>
