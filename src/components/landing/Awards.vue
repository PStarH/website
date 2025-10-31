<template>
  <section class="awards-section">
    <!-- Background animated spheres -->
    <div class="background-spheres">
      <div class="sphere sphere-1"></div>
      <div class="sphere sphere-2"></div>
      <div class="sphere sphere-3"></div>
      <div class="sphere sphere-4"></div>
      <div class="sphere sphere-5"></div>
      <div class="sphere sphere-6"></div>
      <div class="sphere sphere-7"></div>
      <div class="sphere sphere-8"></div>
    </div>

    <div class="awards-container">
      <!-- First row - 3 awards -->
      <div class="awards-row">
        <div
          v-for="(award, index) in awards.slice(0, 3)"
          :key="index"
          :ref="el => setCardRef(el, index)"
          class="award-card"
        >
          <div class="award-header">
            <div class="award-title-row">
              <div class="subject-icon" :style="{ color: award.color }">
                {{ award.icon }}
              </div>
              <h3 class="award-title">{{ award.title }}</h3>
            </div>
            <div class="award-meta">
              <span class="award-year">{{ award.year }}</span>
              <span class="award-subject" :style="{ 
                backgroundColor: award.color + '20', 
                borderColor: award.color + '50',
                color: award.color 
              }">{{ award.subject }}</span>
            </div>
          </div>
          <div class="award-description">
            <p>{{ award.description }}</p>
          </div>
        </div>
      </div>

      <!-- Second row - 3 awards -->
      <div class="awards-row">
        <div
          v-for="(award, index) in awards.slice(3, 6)"
          :key="index + 3"
          :ref="el => setCardRef(el, index + 3)"
          class="award-card"
        >
          <div class="award-header">
            <div class="award-title-row">
              <div class="subject-icon" :style="{ color: award.color }">
                {{ award.icon }}
              </div>
              <h3 class="award-title">{{ award.title }}</h3>
            </div>
            <div class="award-meta">
              <span class="award-year">{{ award.year }}</span>
              <span class="award-subject" :style="{ 
                backgroundColor: award.color + '20', 
                borderColor: award.color + '50',
                color: award.color 
              }">{{ award.subject }}</span>
            </div>
          </div>
          <div class="award-description">
            <p>{{ award.description }}</p>
          </div>
        </div>
      </div>

      <!-- Third row - 1 award + Awards title + 1 award -->
      <div class="awards-row-with-title">
        <!-- Left award -->
        <div
          :ref="el => setCardRef(el, 6)"
          class="award-card"
        >
          <div class="award-header">
            <div class="award-title-row">
              <div class="subject-icon" :style="{ color: awards[6]?.color }">
                {{ awards[6]?.icon }}
              </div>
              <h3 class="award-title">{{ awards[6]?.title }}</h3>
            </div>
            <div class="award-meta">
              <span class="award-year">{{ awards[6]?.year }}</span>
              <span class="award-subject" :style="{ 
                backgroundColor: awards[6]?.color + '20', 
                borderColor: awards[6]?.color + '50',
                color: awards[6]?.color 
              }">{{ awards[6]?.subject }}</span>
            </div>
          </div>
          <div class="award-description">
            <p>{{ awards[6]?.description }}</p>
          </div>
        </div>

        <!-- Awards Title -->
        <div class="title-container">
          <h2 class="section-title">Awards</h2>
        </div>

        <!-- Right award -->
        <div
          :ref="el => setCardRef(el, 7)"
          class="award-card"
        >
          <div class="award-header">
            <div class="award-title-row">
              <div class="subject-icon" :style="{ color: awards[7]?.color }">
                {{ awards[7]?.icon }}
              </div>
              <h3 class="award-title">{{ awards[7]?.title }}</h3>
            </div>
            <div class="award-meta">
              <span class="award-year">{{ awards[7]?.year }}</span>
              <span class="award-subject" :style="{ 
                backgroundColor: awards[7]?.color + '20', 
                borderColor: awards[7]?.color + '50',
                color: awards[7]?.color 
              }">{{ awards[7]?.subject }}</span>
            </div>
          </div>
          <div class="award-description">
            <p>{{ awards[7]?.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const cardRefs = ref([])

const setCardRef = (el, index) => {
  if (el) {
    cardRefs.value[index] = el
  }
}

const awards = ref([
  {
    title: 'BPhO',
    year: '2023',
    subject: 'Physics',
    icon: '⚛️',
    color: '#4CAF50',
    description: 'Intermediate Physics Challenge - Silver Award. A prestigious British physics competition testing theoretical and experimental problem-solving skills for high school students.'
  },
  {
    title: 'AMC 12B',
    year: '2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'Scored 144 points, Honor Roll of Distinction. Part of the American Mathematics Competitions series, one of the most challenging mathematics contests for high school students worldwide.'
  },
  {
    title: 'AIME',
    year: '2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'Scored 11 points. American Invitational Mathematics Examination for top AMC performers, featuring complex problem-solving questions that test advanced mathematical reasoning.'
  },
  {
    title: 'BMO1',
    year: '2024',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'Distinction Award. British Mathematical Olympiad Round 1 - a national competition featuring challenging proof-based mathematics problems for exceptional students.'
  },
  {
    title: 'BMO2',
    year: '2024',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'Merit Award. British Mathematical Olympiad Round 2 - the elite second round for top BMO1 performers, serving as selection for the International Mathematical Olympiad.'
  },
  {
    title: 'Codeforces',
    year: '2020-2024',
    subject: 'Computer Science',
    icon: '💻',
    color: '#FF9800',
    description: 'Master Rank. A leading competitive programming platform with regular contests testing algorithmic thinking, data structures, and programming efficiency under time pressure.'
  },
  {
    title: 'Kaggle',
    year: '2022-2024',
    subject: 'Data Science',
    icon: '📊',
    color: '#9C27B0',
    description: 'Top 10 finishes in two open competitions. The world\'s largest data science community featuring machine learning competitions with real-world datasets and challenges.'
  },
  {
    title: 'John Locke',
    year: '2023',
    subject: 'Philosophy',
    icon: '🤔',
    color: '#795548',
    description: 'Commendation Award. John Locke Institute Essay Competition - a prestigious academic writing competition covering philosophy, politics, economics, and related humanities subjects.'
  }
])
</script>

<style scoped>
.awards-section {
  padding: 0;
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.awards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

/* Background animated spheres */
.background-spheres {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.sphere {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.sphere-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.sphere-2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 10%;
  animation-delay: 1s;
  animation-duration: 7s;
}

.sphere-3 {
  width: 100px;
  height: 100px;
  top: 60%;
  left: 3%;
  animation-delay: 2s;
  animation-duration: 9s;
}

.sphere-4 {
  width: 40px;
  height: 40px;
  top: 40%;
  right: 5%;
  animation-delay: 1.5s;
  animation-duration: 6s;
}

.sphere-5 {
  width: 70px;
  height: 70px;
  bottom: 15%;
  right: 15%;
  animation-delay: 0.5s;
  animation-duration: 8.5s;
}

.sphere-6 {
  width: 50px;
  height: 50px;
  top: 80%;
  left: 20%;
  animation-delay: 3s;
  animation-duration: 7.5s;
}

.sphere-7 {
  width: 90px;
  height: 90px;
  top: 5%;
  left: 50%;
  animation-delay: 2.5s;
  animation-duration: 8s;
}

.sphere-8 {
  width: 35px;
  height: 35px;
  bottom: 10%;
  left: 60%;
  animation-delay: 4s;
  animation-duration: 6.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

/* Row layouts */
.awards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.awards-row-with-title {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
}

.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.award-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 180px;
  transform-origin: center;
  position: relative;
  cursor: pointer;
}

.award-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.4);
}

.award-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.award-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.subject-icon {
  font-size: 1.5rem;
  font-weight: bold;
  min-width: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.25rem;
  backdrop-filter: blur(5px);
}

.award-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.award-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.award-year {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.award-subject {
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid;
  transition: all 0.3s ease;
}

.award-description {
  flex: 1;
}

.award-description p {
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .awards-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .awards-row-with-title {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .awards-section {
    height: 100vh;
    padding: 0;
  }
  
  .awards-container {
    padding: 0 1rem;
    gap: 1rem;
  }
  
  .awards-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .awards-row-with-title {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .award-card {
    padding: 1rem;
    min-height: 160px;
  }

  .sphere {
    transform: scale(0.7);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .award-card {
    padding: 1rem;
    min-height: 140px;
  }
  
  .award-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .subject-icon {
    font-size: 1.25rem;
    min-width: 1.75rem;
  }

  .award-title-row {
    gap: 0.5rem;
  }

  .sphere {
    transform: scale(0.5);
  }

  .award-card:hover {
    transform: translateY(-8px) scale(1.01);
  }
}
</style>