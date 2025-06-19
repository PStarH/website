<template>
  <div class="article-research-section">
    <div class="gallery" ref="galleryRef">
      <ul class="cards" ref="cardsRef">
        <!-- Title Card -->
        <li class="title-card">
          <div class="title-content">
            <h1 class="main-title">Articles & Research</h1>
            <p class="main-subtitle">Explore my latest work and findings</p>
            <div class="title-decoration">
              <div class="decoration-dot"></div>
              <div class="decoration-line"></div>
              <div class="decoration-dot"></div>
            </div>
          </div>
        </li>
        
        <!-- Articles -->
        <li class="article-card" v-for="(article, index) in articles" :key="`article-${index}`">
          <div class="card-type article-type">Article</div>
          <div class="card-title">{{ article.title }}</div>
          <div class="card-description">{{ article.description }}</div>
        </li>
         <!-- Papers -->
        <li class="paper-card" v-for="(paper, index) in papers" :key="`paper-${index}`">
          <div class="card-type paper-type">Paper</div>
          <div class="preprint-badge">Preprint</div>
          <div class="card-title">{{ paper.title }}</div>
          <div class="card-description">{{ paper.description }}</div>
        </li>
        
        <!-- View More -->
        <li class="view-more-card">
          <div class="view-more-content">
            <div class="view-more-icon">📚</div>
            <div class="view-more-text">View More</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const isDarkMode = inject('isDarkMode', ref(true))
const galleryRef = ref(null)
const cardsRef = ref(null)

// GSAP variables
let currentIndex = ref(0)
let cardTimeline = null

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  color: 'transparent',
  '-webkit-text-fill-color': 'transparent'
}))

// Articles data
const articles = ref([
  {
    title: "Advanced Vue.js Patterns",
    description: "Exploring composition API and reactive patterns for scalable applications"
  },
  {
    title: "Modern Web Development",
    description: "Best practices in responsive design and performance optimization"
  },
  {
    title: "Algorithm Visualization",
    description: "Interactive approaches to teaching complex algorithms"
  },
  {
    title: "Data Structures Deep Dive",
    description: "Comprehensive analysis of tree and graph implementations"
  },
  {
    title: "Machine Learning Basics",
    description: "Fundamental concepts in supervised and unsupervised learning"
  },
  {
    title: "JavaScript Performance",
    description: "Optimization techniques for high-performance web applications"
  },
  {
    title: "UI/UX Design Principles",
    description: "Creating intuitive and accessible user interfaces"
  },
  {
    title: "Database Design Patterns",
    description: "Scalable database architectures for modern applications"
  },
  {
    title: "API Development Guide",
    description: "RESTful and GraphQL API design best practices"
  },
  {
    title: "DevOps Integration",
    description: "Continuous integration and deployment strategies"
  }
])

// Papers data
const papers = ref([
  {
    title: "Deep Learning for NLP",
    description: "Novel approaches to transformer architecture optimization"
  },
  {
    title: "Graph Neural Networks",
    description: "Advancing graph-based learning algorithms for complex networks"
  },
  {
    title: "Quantum Computing Applications",
    description: "Practical implementations of quantum algorithms in optimization"
  },
  {
    title: "Computer Vision Advances",
    description: "Real-time object detection using lightweight neural networks"
  }
])

// GSAP functions
function createCardTimeline(cards) {
  // Create timeline for card animations
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.article-research-section',
      pin: true,
      start: 'top top',
      end: () => `+=${(cards.length - 1) * 100}%`, // Use (cards.length - 1) for proper spacing
      scrub: 1.5,
      snap: {
        snapTo: (value) => {
          // Calculate snap points for each card
          const snapValues = []
          for (let i = 0; i < cards.length; i++) {
            snapValues.push(i / (cards.length - 1))
          }
          
          // Find the closest snap point
          let closestSnap = snapValues[0]
          let minDistance = Math.abs(value - closestSnap)
          
          snapValues.forEach(snap => {
            const distance = Math.abs(value - snap)
            if (distance < minDistance) {
              minDistance = distance
              closestSnap = snap
            }
          })
          
          return closestSnap
        },
        duration: { min: 0.2, max: 0.6 },
        delay: 0.05,
        ease: 'power2.inOut'
      },
      onUpdate: (self) => {
        const progress = self.progress
        const cardIndex = Math.round(progress * (cards.length - 1))
        const clampedIndex = Math.max(0, Math.min(cardIndex, cards.length - 1))
        
        if (clampedIndex !== currentIndex.value) {
          currentIndex.value = clampedIndex
        }
      }
    }
  })

  // Initialize cards with the first card (title card) visible in center
  cards.forEach((card, index) => {
    if (index === 0) {
      // First card (title) starts visible in center
      gsap.set(card, { 
        x: 0,
        z: 120,
        rotationY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 100,
        transformOrigin: "center center"
      })
    } else {
      // Other cards start hidden to the right
      gsap.set(card, { 
        x: 1000,
        z: -80,
        rotationY: 30,
        scale: 0.6,
        opacity: 0,
        zIndex: 1,
        transformOrigin: "center center"
      })
    }
  })

  // Create a single smooth timeline for all cards
  for (let focusIndex = 0; focusIndex < cards.length; focusIndex++) {
    const progress = focusIndex / (cards.length - 1)
    
    // For each transition point, set all cards' positions
    cards.forEach((card, cardIndex) => {
      const offset = cardIndex - focusIndex
      const absOffset = Math.abs(offset)
      const visibleRange = 2
      
      let cardProps = {}
      
      if (absOffset <= visibleRange) {
        // This card should be visible in the curved layout
        const angle = offset * 25 // degrees for maximum separation
        const radius = 800 // much wider curve
        
        // Calculate position using sine/cosine for smooth curve
        const x = Math.sin(angle * Math.PI / 180) * radius
        const z = Math.cos(angle * Math.PI / 180) * radius * 0.3
        const rotateY = -angle * 1.0
        
        if (absOffset === 0) {
          // Center card - fully forward and prominent
          cardProps = {
            x: 0,
            z: 120,
            rotationY: 0,
            scale: 1,
            opacity: 1,
            zIndex: 100
          }
        } else if (absOffset === 1) {
          // Adjacent cards - maximum separation
          cardProps = {
            x: x * 1.2,
            z: z + 60,
            rotationY: rotateY,
            scale: 0.85,
            opacity: 0.85,
            zIndex: 85
          }
        } else if (absOffset === 2) {
          // Outer cards - push them way out
          cardProps = {
            x: x * 1.3,
            z: z + 30,
            rotationY: rotateY * 1.4,
            scale: 0.7,
            opacity: 0.65,
            zIndex: 70
          }
        }
      } else {
        // Hide cards that are too far from center
        const hideDirection = offset > 0 ? 1 : -1
        cardProps = {
          x: hideDirection * 1600,
          z: -80,
          rotationY: hideDirection * 45,
          scale: 0.4,
          opacity: 0,
          zIndex: 1
        }
      }
      
      // Add this card's animation to the timeline
      tl.to(card, {
        ...cardProps,
        duration: 1,
        ease: "power2.inOut"
      }, progress)
    })
  }

  return tl
}

function animateToCard(index, cards) {
  // This function is now mainly for button controls
  cards.forEach((card, i) => {
    if (i === index) {
      gsap.to(card, {
        scale: 1,
        opacity: 1,
        zIndex: 100,
        duration: 0.6,
        ease: "power2.out"
      })
    } else {
      gsap.to(card, {
        scale: 0.8,
        opacity: 0,
        zIndex: 1,
        duration: 0.6,
        ease: "power2.out"
      })
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    const cards = gsap.utils.toArray('.cards li')
    if (cards.length > 0) {
      console.log('Cards found:', cards.length) // Debug log
      // Create the main timeline with ScrollTrigger
      cardTimeline = createCardTimeline(cards)
    }
  }, 500)
})

onUnmounted(() => {
  // Kill the timeline and its ScrollTrigger
  if (cardTimeline) {
    cardTimeline.kill()
  }
  
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
.article-research-section {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.gallery {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  perspective: 1800px; /* Increased for maximum wide card layout */
  perspective-origin: center center;
  z-index: 2;
}

.cards {
  position: absolute;
  width: 20rem; /* Increased back to accommodate wider spacing */
  height: 28rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  list-style: none;
  padding: 0;
  margin: 0;
  transform-style: preserve-3d;
}

.cards li {
  list-style: none;
  padding: 24px;
  margin: 0;
  width: 20rem; /* Match container width */
  height: 28rem; /* Match container height */
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.25),
    0 4px 12px rgba(0, 0, 0, 0.15);
  transform-origin: center center;
  transform-style: preserve-3d;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backface-visibility: visible;
  will-change: transform;
}

.title-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff9a9e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.title-content {
  width: 100%;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.main-subtitle {
  font-size: 20px;
  margin: 0 0 32px 0;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.decoration-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.decoration-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
}

.article-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.paper-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  position: relative;
}

.view-more-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card-type {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 24px;
  padding: 8px 16px;
  border-radius: 25px;
  display: inline-block;
  width: fit-content;
  background: rgba(255, 255, 255, 0.2);
}

.preprint-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 500;
  opacity: 0.9;
}

.card-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.card-description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  flex-grow: 1;
}

.view-more-content {
  text-align: center;
}

.view-more-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.view-more-text {
  font-size: 32px;
  font-weight: 600;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .cards li {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-title {
    font-size: 36px;
  }
  
  .main-subtitle {
    font-size: 16px;
  }
  
  .gallery {
    perspective: 600px; /* Reduce perspective on mobile for tighter layout */
  }
  
  .cards {
    width: 15rem;
    height: 22rem;
  }
  
  .cards li {
    width: 15rem;
    height: 22rem;
    padding: 20px;
  }
  
  .card-title {
    font-size: 24px;
  }
  
  .card-description {
    font-size: 14px;
  }
  
  .view-more-icon {
    font-size: 48px;
  }
  
  .view-more-text {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
  }
  
  .main-subtitle {
    font-size: 14px;
  }
  
  .gallery {
    perspective: 500px; /* Further reduce on small screens */
  }
  
  .cards {
    width: 14rem;
    height: 20rem;
  }
  
  .cards li {
    width: 14rem;
    height: 20rem;
    padding: 16px;
  }
}
</style>
