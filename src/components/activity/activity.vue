<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const activityCards = ref([])

const setCardRef = (el, index) => {
  if (el) {
    activityCards.value[index] = el
  }
}

const activities = ref([
  {
    title: 'AppliedCS Club',
    time: 'Started from 2024-01-09',
    icon: '💻',
    color: '#667eea',
    category: 'Computer Science',
    description: 'The AppliedCS Club explores real-life applications of Computer Science across diverse disciplines including Philosophy, Mathematics, Sociology, and Music. We analyze how algorithms influence social media, examine AI\'s role in music composition, and explore computational methods for solving complex mathematical problems. Through engaging discussions and collaborative brainstorming, we foster an environment where creativity and critical thinking thrive, encouraging members to contribute unique perspectives on the intersection of technology and society.',
    image: '/website/images/wordcloud.png',
    hasImage: true
  },
  {
    title: 'Squash Player',
    time: 'Shenzhen Pony Running & Beijing Spirit Squash Club | 10+ years',
    icon: '🎾',
    color: '#f093fb',
    category: 'Sports',
    description: 'Trained for 10 years and developed competitive skills in squash. Won multiple regional youth competitions across different age groups, demonstrating consistent improvement and dedication to the sport.',
    hasImage: false
  },
  {
    title: 'IT Intern',
    time: 'Scholar Hill | 2023-2024',
    icon: '🔧',
    color: '#4facfe',
    category: 'Technology',
    description: 'Built a PDF analysis system for teachers to provide statistical insights such as the number of times two characters appear together and find top relevant quotations about each theme. Additionally, developed an automated system that divides questions and creates a question bank, streamlining the assessment creation process for educators.',
    hasImage: false
  },
  {
    title: 'Council Member - Sports Division',
    time: 'Student Council - Shenzhen College of International Education | High School',
    icon: '📢',
    color: '#43e97b',
    category: 'Leadership',
    description: 'Supported marketing efforts by creating posters and social media posts for multiple inter-school basketball and soccer competitions. Enhanced school spirit and event attendance through effective visual communication and promotional strategies.',
    hasImage: false
  },
  {
    title: 'Student Council Core Member',
    time: 'BMCA Middle School | Grade 8-9',
    icon: '🎯',
    color: '#fa709a',
    category: 'Leadership',
    description: 'Served as a core member of the student council, organizing multiple major events including sports day and other school-wide activities. Developed leadership and organizational skills through coordinating with teachers, students, and volunteers to create engaging community experiences.',
    hasImage: false
  }
])

onMounted(() => {
  // Animate activity cards on scroll
  activityCards.value.forEach((card) => {
    if (card) {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none reverse',
            scrub: 0.5
          }
        }
      )
    }
  })

  // Animate title
  gsap.fromTo('.section-title',
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  )
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<template>
  <section class="activities-section">
    <!-- Background animated spheres -->
    <div class="background-spheres">
      <div class="sphere sphere-1"></div>
      <div class="sphere sphere-2"></div>
      <div class="sphere sphere-3"></div>
      <div class="sphere sphere-4"></div>
      <div class="sphere sphere-5"></div>
    </div>

    <div class="activities-container">
      <h1 class="section-title">Extra-curriculum Activities</h1>

      <div class="activities-grid">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          :ref="el => setCardRef(el, index)"
          class="activity-card"
        >
          <div class="card-header">
            <div class="icon-wrapper" :style="{ background: `linear-gradient(135deg, ${activity.color}, ${activity.color}dd)` }">
              <span class="activity-icon">{{ activity.icon }}</span>
            </div>
            <div class="header-text">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <div class="category-badge" :style="{
                backgroundColor: activity.color + '20',
                borderColor: activity.color + '50',
                color: activity.color
              }">
                {{ activity.category }}
              </div>
            </div>
          </div>

          <div class="activity-time">
            <svg class="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ activity.time }}
          </div>

          <div class="activity-content">
            <div :class="{ 'content-with-image': activity.hasImage }">
              <p class="activity-description">{{ activity.description }}</p>

              <div v-if="activity.hasImage" class="activity-image-wrapper">
                <img :src="activity.image" alt="Activity illustration" class="activity-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activities-section {
  min-height: 100vh;
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
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
  overflow: hidden;
}

.sphere {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float 8s ease-in-out infinite;
}

.sphere-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  animation-duration: 10s;
}

.sphere-2 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 8%;
  animation-delay: 1.5s;
  animation-duration: 8s;
}

.sphere-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-delay: 3s;
  animation-duration: 9s;
}

.sphere-4 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
  animation-duration: 7s;
}

.sphere-5 {
  width: 90px;
  height: 90px;
  bottom: 10%;
  right: 5%;
  animation-delay: 4s;
  animation-duration: 11s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 1;
  }
}

.activities-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #8d92ae 0%, #b8a4cc 50%, #bea2c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.activities-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.activity-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.activity-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.activity-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.activity-icon {
  font-size: 2rem;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.category-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
  width: fit-content;
  transition: all 0.3s ease;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.time-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.content-with-image {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.content-with-image .activity-description {
  flex: 1;
}

.activity-description {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  text-align: justify;
}

.activity-image-wrapper {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  align-items: center;
}

.activity-image {
  max-width: 180px;
  width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.activity-image:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .section-title {
    font-size: 2.5rem;
  }

  .activity-card {
    padding: 1.5rem;
  }

  .sphere {
    transform: scale(0.8);
  }
}

@media (max-width: 768px) {
  .activities-section {
    padding: 3rem 0;
  }

  .activities-container {
    padding: 0 1.5rem;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .activities-grid {
    gap: 1.5rem;
  }

  .activity-card {
    padding: 1.25rem;
  }

  .card-header {
    gap: 1rem;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .activity-icon {
    font-size: 1.5rem;
  }

  .activity-title {
    font-size: 1.4rem;
  }

  .sphere {
    transform: scale(0.6);
  }

  .content-with-image {
    flex-direction: column;
  }

  .activity-image {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .activities-section {
    padding: 2rem 0;
  }

  .activities-container {
    padding: 0 1rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .activity-card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .icon-wrapper {
    width: 45px;
    height: 45px;
  }

  .activity-title {
    font-size: 1.25rem;
  }

  .activity-time {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .activity-description {
    font-size: 0.95rem;
  }

  .sphere {
    transform: scale(0.5);
  }

  .activity-image {
    max-width: 180px;
  }
}
</style>
