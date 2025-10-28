<template>
  <div class="article-research-section">
    <!-- Binary Background -->
    <div class="binary-background" ref="binaryBackgroundRef">
      <div 
        v-for="(digit, index) in binaryDigits" 
        :key="`binary-${index}`"
        class="binary-digit"
        :style="getBinaryDigitStyle(index)"
      >
        {{ digit.value }}
      </div>
    </div>
    
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
        
        <!-- Content Cards (Papers first, then Articles) -->
        <li 
          :class="cardClasses[index]?.cardClass" 
          v-for="(item, index) in contentCards" 
          :key="`content-${index}`"
          @click="handleCardClick(item)"
          :style="{ cursor: 'pointer' }"
        >
          <div :class="cardClasses[index]?.typeClass">{{ getCardTypeLabel(item.type) }}</div>
          <div v-if="item.type === 'paper'" class="preprint-badge">Preprint</div>
          <div class="card-title" :title="item.title">{{ item.title }}</div>
          <div class="card-description" :title="item.description">{{ item.description }}</div>
          
          <!-- Link indicator -->
          <div class="card-link-indicator">
            <svg v-if="item.external" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11M15 3H21M21 3V9M21 3L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </li>
        
        <!-- View More -->
        <li class="view-more-card" @click="handleViewMoreClick" :style="{ cursor: 'pointer' }">
          <div class="view-more-content">
            <div class="view-more-icon">📚</div>
            <div class="view-more-text">View More</div>
            <div class="view-more-subtitle">Explore all articles</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { getAllContent } from '@/data/articlesAndPapers.js'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const isDarkMode = inject('isDarkMode', ref(true))
const router = useRouter()
const galleryRef = ref(null)
const cardsRef = ref(null)
const binaryBackgroundRef = ref(null)

// GSAP variables
let currentIndex = ref(0)
let cardTimeline = null
let randomTilts = ref([])
let randomOffsets = ref([])
let lastScrollUpdate = 0
const scrollUpdateThrottle = 16 // Throttle scroll updates to ~60fps

// Binary digits data
const binaryDigits = ref([])
const binaryAnimationTimer = ref(null)
let lastUpdateTime = 0
const updateInterval = 16 // ~60fps, update every 16ms

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  color: 'transparent',
  '-webkit-text-fill-color': 'transparent'
}))

// Import all content data
const allContent = ref(getAllContent())

// Computed properties for better performance
const contentCards = computed(() => allContent.value)
const cardClasses = computed(() => {
  const classes = {}
  allContent.value.forEach((item, index) => {
    classes[index] = {
      cardClass: item.type === 'paper' ? 'paper-card' : 'article-card',
      typeClass: item.type === 'paper' ? 'card-type paper-type' : 'card-type article-type'
    }
  })
  return classes
})

// Initialize binary digits
const initBinaryDigits = () => {
  const digitCount = 15 // Further reduced for cleaner look
  
  binaryDigits.value = Array.from({ length: digitCount }, (_, index) => {
    // Generate 8-bit binary with first 4 bits static, last 4 bits dynamic
    const staticBits = Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1' : '0').join('')
    const dynamicBits = Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1' : '0').join('')
    
    return {
      value: staticBits + dynamicBits,
      staticPart: staticBits, // First 4 bits stay the same
      x: Math.random() * (window.innerWidth || 1200),
      y: (Math.random() * 0.8 + 0.1) * (window.innerHeight || 800), // Avoid extreme top/bottom
      size: Math.random() * 0.3 + 0.5, // Smaller: 0.5 to 0.8
      opacity: Math.random() * 0.3 + 0.4, // Much more visible: 0.4 to 0.7
      speed: Math.random() * 0.3 + 0.1, // Consistent speed: 0.1 to 0.4
      movingRight: Math.random() > 0.5,
      rotationSpeed: 0, // No rotation for cleaner look
      id: index,
      changeTimer: Math.random() * 150, // Slower changes: 2.5 seconds
      glowIntensity: Math.random() * 0.5 + 0.6 // Higher glow intensity: 0.6 to 1.1
    }
  })
}

// Update binary digits positions and values
const updateBinaryDigits = (scrollProgress = 0) => {
  const currentTime = Date.now()
  
  // Throttle updates to improve performance
  if (currentTime - lastUpdateTime < updateInterval) {
    return
  }
  lastUpdateTime = currentTime
  
  // Cache window dimensions
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const centerX = windowWidth / 2
  const centerY = windowHeight / 2
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
  
  binaryDigits.value.forEach((digit, index) => {
    // Update change timer less frequently
    digit.changeTimer += 1
    
    // Change last 4 bits with smoother timing (every 90-150 frames = 1.5-2.5 seconds)
    if (digit.changeTimer > 90 + Math.random() * 60) {
      const newDynamicBits = Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1' : '0').join('')
      digit.value = digit.staticPart + newDynamicBits
      digit.changeTimer = 0
      
      // Add a brief glow effect when changing
      digit.glowIntensity = Math.min(1, digit.glowIntensity + 0.3)
    }
    
    // Smooth horizontal movement
    const direction = digit.movingRight ? 1 : -1
    digit.x += direction * digit.speed
    
    // Gentle scroll-based movement
    digit.x += scrollProgress * 0.8 - 0.4
    
    // Fade glow effect
    digit.glowIntensity = Math.max(0.3, digit.glowIntensity - 0.01)
    
    // Smooth wrapping with repositioning
    if (digit.x < -250) {
      digit.x = windowWidth + 250
      digit.y = (Math.random() * 0.8 + 0.1) * windowHeight
      if (Math.random() > 0.6) digit.movingRight = !digit.movingRight
    }
    if (digit.x > windowWidth + 250) {
      digit.x = -250
      digit.y = (Math.random() * 0.8 + 0.1) * windowHeight
      if (Math.random() > 0.6) digit.movingRight = !digit.movingRight
    }
    
    // Optimized opacity calculation
    const distance = Math.sqrt((digit.x - centerX) ** 2 + (digit.y - centerY) ** 2)
    const baseOpacity = 0.3 + (1 - distance / maxDistance) * 0.4
    digit.opacity = baseOpacity * digit.glowIntensity
  })
}

// Get binary digit style
const getBinaryDigitStyle = (index) => {
  const digit = binaryDigits.value[index]
  if (!digit) return { display: 'none' }
  
  // Cache frequently used calculations
  const opacity = Math.max(0.25, digit.opacity)
  const glowIntensity = digit.glowIntensity
  const colorOpacity = 0.4 + glowIntensity * 0.4
  const shadowBlur1 = 6 + glowIntensity * 12
  const shadowBlur2 = 12 + glowIntensity * 24
  const shadowOpacity1 = 0.4 + glowIntensity * 0.5
  const shadowOpacity2 = 0.2 + glowIntensity * 0.3
  
  return {
    position: 'absolute',
    left: `${digit.x}px`,
    top: `${digit.y}px`,
    fontSize: `${digit.size * 16 + 10}px`,
    opacity,
    pointerEvents: 'none',
    userSelect: 'none',
    color: `rgba(102, 126, 234, ${colorOpacity})`,
    textShadow: `0 0 ${shadowBlur1}px rgba(102, 126, 234, ${shadowOpacity1}), 0 0 ${shadowBlur2}px rgba(102, 126, 234, ${shadowOpacity2})`,
    zIndex: 1,
    fontWeight: '400',
    fontFamily: 'SF Mono, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    letterSpacing: '1px',
    willChange: 'transform, opacity'
  }
}

// Generate random values for each card
const generateRandomValues = () => {
  randomTilts.value = allContent.value.map(() => (Math.random() - 0.5) * 8) // -4 to 4 degrees
  randomOffsets.value = allContent.value.map(() => (Math.random() - 0.5) * 30) // -15 to 15 pixels
}

// Generate dynamic animation values based on scroll progress
const getDynamicValues = (index, scrollProgress) => {
  // Create unique frequencies for each card to avoid synchronized movement
  const baseFreq = 0.8 + (index % 5) * 0.3 // Different base frequencies (0.8, 1.1, 1.4, 1.7, 2.0)
  const tiltFreq = 0.6 + (index % 7) * 0.2 // Different tilt frequencies (0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8)
  
  // Much slower time progression to avoid "twitching"
  const time = scrollProgress * 1 + index * 1.5 // Further reduced speed to minimize jitter
  
  // Each card gets unique animation patterns with reduced amplitude
  const dynamicTilt = (randomTilts.value[index] || 0) + Math.sin(time * tiltFreq) * 1 // Reduced amplitude to ±1 degree
  const dynamicOffset = (randomOffsets.value[index] || 0) + Math.cos(time * baseFreq) * 4 // Reduced amplitude to ±4px
  
  return { dynamicTilt, dynamicOffset }
}

// Helper methods for rendering
const getCardClass = (type) => {
  return type === 'paper' ? 'paper-card' : 'article-card'
}

const getCardTypeClass = (type) => {
  return type === 'paper' ? 'card-type paper-type' : 'card-type article-type'
}

const getCardTypeLabel = (type) => {
  return type === 'paper' ? 'Paper' : 'Article'
}

// Handle card click navigation
const handleCardClick = (item) => {
  if (!item.url) return
  
  if (item.external) {
    // Open external links in new tab
    window.open(item.url, '_blank', 'noopener,noreferrer')
  } else {
    // Navigate to internal routes
    router.push(item.url)
  }
}

// Handle view more click
const handleViewMoreClick = () => {
  // Navigate to a dedicated articles/research page
  window.open('https://medium.com/@sampan090611', '_blank', 'noopener,noreferrer')
}

// GSAP functions
function createCardTimeline(cards) {
  // Generate random values for each card
  generateRandomValues()
  
  // Initialize all cards positioned in a spread layout with title card as center
  cards.forEach((card, index) => {
    const centerIndex = 0 // Always start with the title card (index 0) as center
    const offset = index - centerIndex
    const absOffset = Math.abs(offset)
    
    // Calculate initial curved layout position with wider spacing
    const angle = offset * 28 // Increased angle to prevent overlap
    const radius = 900 // Increased radius for better spacing
    const x = Math.sin(angle * Math.PI / 180) * radius
    const z = Math.cos(angle * Math.PI / 180) * radius * 0.3
    const rotateY = -angle * 1.0
    
    let scale, opacity, zIndex
    
    if (absOffset === 0) {
      // Center card (title card)
      scale = 1
      opacity = 1
      zIndex = 100
    } else if (absOffset <= 1.5) {
      // Adjacent cards
      scale = 0.9
      opacity = 0.9
      zIndex = 85
    } else if (absOffset <= 2.5) {
      // Outer visible cards
      scale = 0.8
      opacity = 0.75
      zIndex = 70
    } else {
      // Hidden cards (too far from center)
      const hideDirection = offset > 0 ? 1 : -1
      gsap.set(card, {
        x: hideDirection * 1500, // Moderate distance for hiding
        y: randomOffsets.value[index] || 0,
        z: -60,
        rotationY: hideDirection * 35,
        rotationZ: randomTilts.value[index] || 0,
        scale: 0.5,
        opacity: 0,
        zIndex: 1,
        transformOrigin: "center center"
      })
      return // Skip the main gsap.set below
    }
    
    gsap.set(card, { 
      x: absOffset === 0 ? 0 : x * (absOffset <= 1.5 ? 1.2 : 1.3), // Increased multipliers to prevent overlap
      y: randomOffsets.value[index] || 0,
      z: absOffset === 0 ? 100 : z + (absOffset <= 1.5 ? 50 : 25),
      rotationY: rotateY,
      rotationZ: randomTilts.value[index] || 0,
      scale: scale,
      opacity: opacity,
      zIndex: zIndex,
      transformOrigin: "center center"
    })
  })

  // Create timeline for card animations with faster scroll speed
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.article-research-section',
      pin: true,
      pinSpacing: true, // Ensure proper spacing
      start: 'top top',
      end: () => `+=${cards.length * 80}%`, // Adjusted for better spacing
      scrub: 0.8, // Reduced from 1.2 for faster response
      anticipatePin: 1, // Prevent layout shift
      invalidateOnRefresh: true, // Recalculate on window resize
      snap: {
        snapTo: (value) => {
          // Simplified snap function for consistent behavior
          const snapPoints = []
          for (let i = 0; i < cards.length; i++) {
            snapPoints.push(i / (cards.length - 1))
          }
          
          // Find closest snap point
          let closest = snapPoints[0]
          let minDiff = Math.abs(value - closest)
          
          for (let point of snapPoints) {
            const diff = Math.abs(value - point)
            if (diff < minDiff) {
              closest = point
              minDiff = diff
            }
          }
          
          return closest
        },
        duration: { min: 0.2, max: 0.6 },
        delay: 0.05,
        ease: 'power2.out'
      },
      onUpdate: (self) => {
        const currentTime = Date.now()
        
        // Throttle updates to prevent jitter during fast scrolling
        if (currentTime - lastScrollUpdate < scrollUpdateThrottle) {
          return
        }
        lastScrollUpdate = currentTime
        
        const progress = self.progress
        const exactIndex = progress * (cards.length - 1)
        const cardIndex = Math.round(exactIndex)
        const clampedIndex = Math.min(Math.max(cardIndex, 0), cards.length - 1)
        
        // Real-time card positioning based on current progress
        updateCardsPosition(cards, exactIndex)
        
        // Update binary digits based on scroll progress
        updateBinaryDigits(progress)
        
        if (clampedIndex !== currentIndex.value) {
          currentIndex.value = clampedIndex
        }
      }
    }
  })

  return tl
}

// Real-time card positioning function for consistent bidirectional scrolling
function updateCardsPosition(cards, exactIndex) {
  const visibleRange = 2.5 // Increased range to show 4 cards
  
  cards.forEach((card, index) => {
    const offset = index - exactIndex
    const absOffset = Math.abs(offset)
    
    if (absOffset <= visibleRange) {
      // This card should be visible in the curved layout
      const angle = offset * 20 // Increased angle to prevent overlap
      const radius = 800 // Increased radius for better spacing
      
      // Calculate position using sine/cosine for smooth curve
      const x = Math.sin(angle * Math.PI / 180) * radius
      const z = Math.cos(angle * Math.PI / 180) * radius * 0.3
      const rotateY = -angle * 1.0
      
      // Smooth interpolation for scale and opacity based on distance from center
      const distanceFactor = 1 - (absOffset / visibleRange)
      const baseScale = 0.6 + (distanceFactor * 0.4) // Scale from 0.6 to 1.0
      const baseOpacity = 0.5 + (distanceFactor * 0.5) // Opacity from 0.5 to 1.0
      
      // Get dynamic animation values
      const { dynamicTilt, dynamicOffset } = getDynamicValues(index, exactIndex)
      
      if (absOffset < 0.1) {
        // Center card - fully forward and prominent
        gsap.to(card, {
          x: 0,
          y: dynamicOffset,
          z: 100,
          rotationY: 0,
          rotationZ: dynamicTilt,
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.6, // Increased duration for smoother transitions
          ease: "power1.out", // Gentler easing
          overwrite: "auto" // Prevent animation conflicts
        })
      } else if (absOffset <= 1.5) {
        // Adjacent cards - interpolated positioning
        const factor = 1.3 // Increased factor to prevent overlap
        gsap.to(card, {
          x: x * factor,
          y: dynamicOffset,
          z: z + 50,
          rotationY: rotateY,
          rotationZ: dynamicTilt,
          scale: baseScale,
          opacity: baseOpacity,
          zIndex: Math.round(85 - absOffset * 10),
          duration: 0.6, // Increased duration for smoother transitions
          ease: "power1.out", // Gentler easing
          overwrite: "auto" // Prevent animation conflicts
        })
      } else {
        // Outer visible cards
        gsap.to(card, {
          x: x * 1.5, // Increased factor to prevent overlap
          y: dynamicOffset,
          z: z + 25,
          rotationY: rotateY * 1.1, // Moderate rotation
          rotationZ: dynamicTilt,
          scale: baseScale,
          opacity: baseOpacity,
          zIndex: Math.round(70 - absOffset * 8),
          duration: 0.6, // Increased duration for smoother transitions
          ease: "power1.out", // Gentler easing
          overwrite: "auto" // Prevent animation conflicts
        })
      }
    } else {
      // Hide cards that are too far from center
      const hideDirection = offset > 0 ? 1 : -1
      const { dynamicTilt, dynamicOffset } = getDynamicValues(index, exactIndex)
      gsap.to(card, {
        x: hideDirection * 1500, // Moderate distance for hiding
        y: dynamicOffset,
        z: -60,
        rotationY: hideDirection * 35,
        rotationZ: dynamicTilt,
        scale: 0.5,
        opacity: 0,
        zIndex: 1,
        duration: 0.6, // Increased duration for smoother transitions
        ease: "power1.out", // Gentler easing
        overwrite: "auto" // Prevent animation conflicts
      })
    }
  })
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
  // Initialize binary digits
  initBinaryDigits()
  
  // Start binary animation loop
  const animateBinary = () => {
    updateBinaryDigits()
    binaryAnimationTimer.value = requestAnimationFrame(animateBinary)
  }
  animateBinary()
  
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
  
  // Cancel binary animation
  if (binaryAnimationTimer.value) {
    cancelAnimationFrame(binaryAnimationTimer.value)
  }
  
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped>
.article-research-section {
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 2rem 0;
  margin: 0;
  box-sizing: border-box;
}

.binary-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
}

.binary-digit {
  position: absolute;
  font-family: 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
  font-weight: 400;
  will-change: transform, opacity;
  letter-spacing: 1px;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  animation: float 8s ease-in-out infinite alternate;
  transform: translateZ(0); /* Force hardware acceleration */
  backface-visibility: hidden; /* Improve performance */
}

@keyframes float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-10px); }
}

/* Dark mode binary digits */
@media (prefers-color-scheme: dark) {
  .binary-background {
    background: radial-gradient(ellipse at center, rgba(138, 171, 255, 0.1) 0%, transparent 70%);
  }
}

/* Binary digits animation on hover */
.article-research-section:hover .binary-digit {
  animation-duration: 4s;
  filter: brightness(1.3) contrast(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .binary-digit {
    font-size: 14px !important;
    letter-spacing: 0.5px;
  }
  
  .binary-background {
    background: radial-gradient(ellipse at center, rgba(102, 126, 234, 0.06) 0%, transparent 60%);
  }
}

.gallery {
  position: relative;
  width: 100%;
  height: calc(100vh - 4rem); /* Account for padding */
  overflow: hidden;
  perspective: 1800px; /* Increased perspective for wider spacing */
  perspective-origin: center center;
  z-index: 2;
  margin: 2rem 0; /* Additional margin for consistent spacing */
}

.cards {
  position: absolute;
  width: 14rem; /* Reduced from 20rem for smaller cards */
  height: 20rem; /* Reduced from 28rem for smaller cards */
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
  padding: 18px; /* Reduced padding */
  margin: 0;
  width: 14rem; /* Match container width */
  height: 20rem; /* Match container height */
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.8rem; /* Slightly smaller border radius */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.25),
    0 3px 10px rgba(0, 0, 0, 0.15);
  transform-origin: center center;
  transform-style: preserve-3d;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backface-visibility: visible;
  will-change: transform;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cards li:hover {
  transform: scale(1.02) translateZ(10px);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.35),
    0 6px 20px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff9a9e 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.article-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.paper-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.title-content {
  width: 100%;
}

.main-title {
  font-size: 36px; /* Reduced from 48px */
  font-weight: 700;
  margin: 0 0 12px 0; /* Reduced margin */
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.main-subtitle {
  font-size: 16px; /* Reduced from 20px */
  margin: 0 0 24px 0; /* Reduced margin */
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

.card-type {
  font-size: 12px; /* Reduced from 14px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px; /* Reduced letter spacing */
  margin-bottom: 16px; /* Reduced margin */
  padding: 6px 12px; /* Reduced padding */
  border-radius: 20px; /* Reduced border radius */
  display: inline-block;
  width: fit-content;
  background: rgba(255, 255, 255, 0.2);
}

.card-link-indicator {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.cards li:hover .card-link-indicator {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.card-link-indicator svg {
  color: rgba(255, 255, 255, 0.9);
}

.preprint-badge {
  position: absolute;
  top: 18px; /* Adjusted for smaller padding */
  right: 18px; /* Adjusted for smaller padding */
  font-size: 11px; /* Reduced from 12px */
  background: rgba(255, 255, 255, 0.15);
  padding: 5px 10px; /* Reduced padding */
  border-radius: 12px; /* Reduced border radius */
  font-weight: 500;
  opacity: 0.9;
}

.card-title {
  font-size: 22px; /* Reduced from 28px */
  font-weight: 700;
  margin-bottom: 16px; /* Reduced margin */
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  line-clamp: 3; /* Standard property */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-height: calc(1.3em * 3); /* 3 lines max */
  word-wrap: break-word;
  hyphens: auto;
}

.card-description {
  font-size: 14px; /* Reduced from 16px */
  line-height: 1.5; /* Slightly reduced line height */
  opacity: 0.9;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Limit to 4 lines */
  line-clamp: 4; /* Standard property */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  max-height: calc(1.5em * 4); /* 4 lines max */
  word-wrap: break-word;
  hyphens: auto;
}

.view-more-card {
  background: linear-gradient(135deg, #a8a8ff 0%, #8c7ae6 50%, #9c88ff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-more-card:hover {
  background: linear-gradient(135deg, #b8b8ff 0%, #9c88ff 50%, #ac98ff 100%);
  transform: scale(1.05) translateZ(15px);
}

.view-more-content {
  text-align: center;
}

.view-more-icon {
  font-size: 48px; /* Reduced from 64px */
  margin-bottom: 16px; /* Reduced margin */
  transition: transform 0.3s ease;
}

.view-more-card:hover .view-more-icon {
  transform: scale(1.1) rotate(5deg);
}

.view-more-text {
  font-size: 24px; /* Reduced from 32px */
  font-weight: 600;
  margin-bottom: 8px;
}

.view-more-subtitle {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 400;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .cards li {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
}

/* Enhanced responsive design for text overflow */
@media (max-width: 768px) {
  .main-title {
    font-size: 28px; /* Reduced */
  }
  
  .main-subtitle {
    font-size: 14px; /* Reduced */
  }
  
  .gallery {
    perspective: 800px; /* Reduced perspective on mobile */
  }
  
  .cards {
    width: 12rem; /* Smaller on mobile */
    height: 18rem; /* Smaller on mobile */
  }
  
  .cards li {
    width: 12rem;
    height: 18rem;
    padding: 16px; /* Reduced padding */
  }
  
  .card-title {
    font-size: 18px; /* Reduced */
    -webkit-line-clamp: 3; /* Still 3 lines on mobile */
    line-clamp: 3;
    max-height: calc(1.3em * 3);
  }
  
  .card-description {
    font-size: 12px; /* Reduced */
    -webkit-line-clamp: 3; /* Reduced to 3 lines on mobile */
    line-clamp: 3;
    max-height: calc(1.4em * 3);
  }
  
  .view-more-icon {
    font-size: 36px; /* Reduced */
  }
  
  .view-more-text {
    font-size: 18px; /* Reduced */
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 24px; /* Further reduced */
  }
  
  .main-subtitle {
    font-size: 12px; /* Further reduced */
  }
  
  .gallery {
    perspective: 600px; /* Further reduce on small screens */
  }
  
  .cards {
    width: 11rem; /* Even smaller */
    height: 16rem; /* Even smaller */
  }
  
  .cards li {
    width: 11rem;
    height: 16rem;
    padding: 14px; /* Further reduced padding */
  }
  
  .card-title {
    font-size: 16px; /* Further reduced */
    -webkit-line-clamp: 2; /* Reduced to 2 lines on very small screens */
    line-clamp: 2;
    max-height: calc(1.3em * 2);
  }
  
  .card-description {
    font-size: 11px; /* Further reduced */
    -webkit-line-clamp: 2; /* Reduced to 2 lines on very small screens */
    line-clamp: 2;
    max-height: calc(1.4em * 2);
  }
}
</style>
