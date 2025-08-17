<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from 'primevue/card';

const router = useRouter();

const navigateToEvents = () => {
  router.push('/events');
};

const navigateToLogin = () => {
  router.push('/login');
};

const navigateToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Comment fonctionne JoinUs ?
        </h1>
        <p class="hero-subtitle">
          Une plateforme simple pour connecter associations et citoyens autour d'événements
        </p>
        <p class="hero-description">
          JoinUs facilite l'organisation et la participation à des événements associatifs. 
          Découvrez ci-dessous comment utiliser la plateforme selon votre profil.
        </p>
        
 
      </div>
      
      <div class="hero-image">
        <i class="pi pi-cog hero-icon"></i>
      </div>
    </section>

    <!-- How it works for Users -->
    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">Pour les participants</h2>
        
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Parcourez les événements</h3>
              <p>Consultez les événements disponibles par mois, filtrez par type ou recherchez par mots-clés. 
              Tous les événements publics sont visibles sans inscription.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Inscrivez-vous</h3>
              <p>Créez votre compte pour pouvoir participer aux événements. La localisation sert à trouver les évents les plus proches de vous.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Participez aux événements</h3>
              <p>Cliquez sur "Participer" pour vous inscrire à un événement. 
              Vous recevrez toutes les informations nécessaires et pourrez voir les autres participants.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Rejoignez des associations</h3>
              <p>Demandez à rejoindre les associations qui vous intéressent. 
              Une fois membre, vous aurez accès à leurs événements privés.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works for Associations -->
    <section class="associations-section">
      <div class="container">
        <h2 class="section-title">Pour les associations</h2>
        
        <div class="features-grid">
          <Card class="feature-card">
            <template #header>
              <div class="feature-icon association-icon">
                <i class="pi pi-plus-circle"></i>
              </div>
            </template>
            <template #title>Créer des événements</template>
            <template #content>
              <p>Les responsables d'association peuvent créer des événements publics ou privés. 
              Ajoutez une description, une localisation, une image et définissez le type d'événement.</p>
            </template>
          </Card>

          <Card class="feature-card">
            <template #header>
              <div class="feature-icon association-icon">
                <i class="pi pi-users"></i>
              </div>
            </template>
            <template #title>Gérer les membres</template>
            <template #content>
              <p>Acceptez ou refusez les demandes d'adhésion. 
              Gérez votre liste de membres et donnez des droits spécifiques selon les besoins.</p>
            </template>
          </Card>



          <Card class="feature-card">
            <template #header>
              <div class="feature-icon association-icon">
                <i class="pi pi-eye"></i>
              </div>
            </template>
            <template #title>Suivre les participations</template>
            <template #content>
              <p>Consultez la liste des participants à vos événements. 
              Communiquez avec eux et organisez au mieux vos activités.</p>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Role explanations Section -->
    <section class="roles-section">
      <div class="container">
        <div class="roles-content">
          <h2 class="section-title">Les différents rôles</h2>
          
          <div class="roles-grid">
            <div class="role-card">
              <div class="role-icon">
                <i class="pi pi-user"></i>
              </div>
              <h3>Utilisateur</h3>
              <p>Peut consulter et participer aux événements publics. 
              Peut demander à rejoindre des associations pour accéder à leurs événements privés.</p>
            </div>

            <div class="role-card">
              <div class="role-icon">
                <i class="pi pi-crown"></i>
              </div>
              <h3>Responsable d'association</h3>
              <p>Peut créer et gérer des événements pour son association. 
              Peut accepter ou refuser les demandes d'adhésion et valider les événements de son association.</p>
            </div>

            <div class="role-card">
              <div class="role-icon">
                <i class="pi pi-cog"></i>
              </div>
              <h3>Responsable d'événements</h3>
              <p>Peut valider ou annuler tous les événements de la plateforme. 
              Supervise le bon fonctionnement et la qualité des contenus publiés.</p>
            </div>
          </div>

          <div class="info-box">
            <i class="pi pi-info-circle"></i>
            <p>Pour devenir responsable d'association, contactez-nous après avoir créé votre association sur la plateforme.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70vh;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.85;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn-primary {
  background: var(--white-color) !important;
  border-color: var(--white-color) !important;
  color: var(--primary-color) !important;
}

.hero-btn-primary:hover {
  background: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  color: var(--primary-dark) !important;
}

.hero-image {
  flex: 0 0 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-icon {
  font-size: 15rem;
  opacity: 0.3;
}

/* How it works Section */
.how-it-works-section {
  padding: 5rem 2rem;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
  color: var(--primary-dark);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h3 {
  color: var(--primary-dark);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.step-content p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

/* Associations Section */
.associations-section {
  padding: 5rem 2rem;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.association-icon {
  background: linear-gradient(135deg, var(--danger-color) 0%, var(--danger-dark) 100%) !important;
}

.feature-icon i {
  font-size: 2rem;
  color: white;
}

.feature-card :deep(.p-card-title) {
  color: var(--primary-dark);
  font-weight: 600;
  margin-bottom: 1rem;
}

.feature-card :deep(.p-card-content p) {
  color: #6c757d;
  line-height: 1.6;
}

/* Roles Section */
.roles-section {
  padding: 5rem 2rem;
  background: #f8f9fa;
}

.roles-content {
  text-align: center;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.role-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.role-icon {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.role-icon i {
  font-size: 2rem;
  color: white;
}

.role-card h3 {
  color: var(--primary-dark);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.role-card p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

.info-box {
  background: var(--primary-hover);
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.info-box i {
  color: var(--primary-color);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-box p {
  color: var(--primary-dark);
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-image {
    flex: none;
  }
  
  .hero-icon {
    font-size: 8rem;
  }
  
  .how-it-works-section,
  .associations-section,
  .roles-section {
    padding: 3rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>