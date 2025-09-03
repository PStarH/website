<template>
  <section class="awards-section" role="main" aria-label="Awards and Achievements">
    <div class="awards-container">
      <h2 class="section-title" id="awards-title">Awards</h2>
      <div class="awards-list">
        <div 
          v-for="(award, index) in awards" 
          :key="index"
          class="award-item"
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
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const awards = ref([
  {
    title: 'BPhO',
    year: '2023',
    subject: 'Physics',
    icon: '⚛️',
    color: '#4CAF50',
    description: 'British Physics Olympiad - National physics competition testing advanced problem-solving skills in theoretical and experimental physics.'
  },
  {
    title: 'AMC',
    year: '2022-2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'American Mathematics Competitions - Prestigious mathematics competition series including AMC 8, AMC 10, and AMC 12.'
  },
  {
    title: 'AIME',
    year: '2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'American Invitational Mathematics Examination - Advanced mathematics competition for high-achieving AMC participants.'
  },
  {
    title: 'BMO',
    year: '2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'British Mathematical Olympiad - National mathematics olympiad featuring challenging proof-based problems.'
  },
  {
    title: 'BMO2',
    year: '2023',
    subject: 'Mathematics',
    icon: '∑',
    color: '#2196F3',
    description: 'British Mathematical Olympiad Round 2 - Advanced round for top BMO performers, selection for International Mathematical Olympiad.'
  },
  {
    title: 'Codeforces',
    year: '2020-2024',
    subject: 'Computer Science',
    icon: '💻',
    color: '#FF9800',
    description: 'Competitive programming platform with regular contests testing algorithmic problem-solving and programming skills.'
  },
  {
    title: 'Kaggle',
    year: '2022-2024',
    subject: 'Data Science',
    icon: '📊',
    color: '#9C27B0',
    description: 'Global platform for data science competitions, featuring machine learning challenges and collaborative projects.'
  },
  {
    title: 'John Locke',
    year: '2023',
    subject: 'History',
    icon: '🤔',
    color: '#795548',
    description: 'John Locke Institute Essay Competition - Academic writing competition covering philosophy, politics, economics, and related subjects.'
  }
])
</script>

<style scoped>
.awards-section {
  padding: 2rem 0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.awards-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.awards-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.award-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.award-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.award-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.award-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.subject-icon {
  font-size: 1.25rem;
  font-weight: bold;
  min-width: 1.75rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0.25rem;
  backdrop-filter: blur(5px);
}

.award-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.award-meta {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.award-year {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.award-subject {
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  transition: all 0.3s ease;
}

.award-description p {
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .awards-container {
    padding: 0 0.75rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .award-item {
    padding: 0.75rem;
  }
  
  .award-title {
    font-size: 1rem;
  }
  
  .subject-icon {
    font-size: 1.1rem;
    min-width: 1.5rem;
  }
  
  .award-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 360px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .award-title {
    font-size: 0.95rem;
  }
  
  .award-description p {
    font-size: 0.75rem;
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .award-item {
    transition: none;
  }
  
  .award-item:hover {
    transform: none;
    transition: box-shadow 0.3s ease;
  }
}
</style>
