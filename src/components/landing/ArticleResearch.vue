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
import { inject, computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { getAllContent } from '@/data/articlesAndPapers.js'

const isDarkMode = inject('isDarkMode', ref(true))
const router = useRouter()
const galleryRef = ref(null)
const cardsRef = ref(null)
const binaryBackgroundRef = ref(null)
const TWO_PI = Math.PI * 2
const RAD_TO_DEG = 180 / Math.PI

// Stabilize GSAP ticker to avoid catch-up jitter
gsap.ticker.fps(60)
gsap.ticker.lagSmoothing(500, 33) // Re-enable lag smoothing with reasonable threshold

// GSAP variables
let currentIndex = ref(0)
let randomOffsets = ref([])
let stopAutoRotate = null
const cardElements = ref([])
const carouselState = { rotation: 0 }
let hasInitializedCarousel = false
let intersectionObserver = null
const carouselProgress = ref(0)
const cardBaseAngles = ref([])

// Interactive hover system
const mousePos = ref({ x: 0, y: 0 })
const hoveredCardIndex = ref(-1)
const carouselTilt = ref({ x: 0, y: 0 })
let hoverAnimations = []

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
const generateRandomValues = (cardCount) => {
  randomOffsets.value = Array.from({ length: cardCount }, () => (Math.random() - 0.5) * 24)
  if (cardCount > 0) {
    randomOffsets.value[0] = 0
  }
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

function updateCardsPosition(cards) {
  if (!cards.length) return

  const totalCards = cards.length
  const radius = 900
  const depth = 220
  const verticalSpread = 38
  const centerYOffset = 32
  const angleStep = TWO_PI / totalCards
  const baseRotation = carouselState.rotation
  const baseAngles = cardBaseAngles.value

  cards.forEach((card, index) => {
    const angle = baseRotation + (baseAngles[index] ?? index * angleStep)
    const sinAngle = Math.sin(angle)
    const cosAngle = Math.cos(angle)
    const wrappedAngle = Math.atan2(sinAngle, cosAngle)
    const depthFactor = (cosAngle + 1) * 0.5 // 0 (back) -> 1 (front)

    // Round pixel values to prevent subpixel rendering jitter
    const x = Math.round(sinAngle * radius * 100) / 100  // Keep 2 decimal precision
    const y = Math.round((Math.sin(wrappedAngle * 0.9) * verticalSpread + (randomOffsets.value[index] || 0) - centerYOffset) * 100) / 100
    const z = Math.round(cosAngle * depth * 100) / 100
    const scale = 0.48 + Math.pow(depthFactor, 1.4) * 0.48
    const opacity = 0.25 + depthFactor * 0.75
    const zIndex = Math.round(depthFactor * 80) + 20
    const rotationY = Math.round((-wrappedAngle * RAD_TO_DEG) * 0.85 * 100) / 100

    // Use will-change for optimized rendering
    card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotationY}deg) rotateZ(0deg) scale(${scale})`
    card.style.opacity = `${opacity}`
    card.style.zIndex = `${zIndex}`
  })

  const normalizedProgress = (baseRotation / TWO_PI) % 1
  carouselProgress.value = normalizedProgress

  const activeIndex = ((-baseRotation / angleStep) % totalCards + totalCards) % totalCards
  currentIndex.value = Math.round(activeIndex) % totalCards
}

function startAutoRotate() {
  const cards = cardElements.value
  if (!cards.length) return

  if (stopAutoRotate) return

  updateCardsPosition(cards)

  const secondsPerCard = 2.4
  const rotationSpeed = -TWO_PI / (cards.length * secondsPerCard)
  let lastTickTime = performance.now()

  const tickerCallback = () => {
    const now = performance.now()
    const deltaSeconds = Math.max(0.001, Math.min(0.033, (now - lastTickTime) / 1000))
    lastTickTime = now

    carouselState.rotation += rotationSpeed * deltaSeconds

    if (carouselState.rotation >= TWO_PI || carouselState.rotation < 0) {
      carouselState.rotation = ((carouselState.rotation % TWO_PI) + TWO_PI) % TWO_PI
    }

    updateCardsPosition(cards)
  }

  gsap.ticker.add(tickerCallback)

  stopAutoRotate = () => {
    gsap.ticker.remove(tickerCallback)
    stopAutoRotate = null
  }
}

function initializeCarousel() {
  const cards = gsap.utils.toArray('.cards li')
  if (!cards.length) return

  cardElements.value = cards
  cards.forEach((card) => {
    card.style.transformOrigin = 'center center'
  })
  const angleStep = cards.length ? TWO_PI / cards.length : 0
  cardBaseAngles.value = cards.map((_, index) => index * angleStep)
  generateRandomValues(cards.length)
  carouselState.rotation = 0
  updateCardsPosition(cardElements.value)
}

function observeCarouselVisibility() {
  if (!galleryRef.value) return

  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }

  if (typeof IntersectionObserver === 'undefined') {
    if (!hasInitializedCarousel) {
      initializeCarousel()
      hasInitializedCarousel = true
    }
    startAutoRotate()
    return
  }

  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target !== galleryRef.value) return

      if (entry.isIntersecting) {
        if (!hasInitializedCarousel) {
          initializeCarousel()
          hasInitializedCarousel = true
        }
        startAutoRotate()
      } else if (stopAutoRotate) {
        stopAutoRotate()
      }
    })
  }, {
    threshold: 0.35
  })

  intersectionObserver.observe(galleryRef.value)
}

// Setup interactive hover system
function setupInteractiveHover() {
  const gallery = galleryRef.value
  if (!gallery) return

  // Track mouse position
  gallery.addEventListener('mousemove', (e) => {
    const rect = gallery.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalized mouse position (-1 to 1)
    mousePos.value = {
      x: (e.clientX - centerX) / (rect.width / 2),
      y: (e.clientY - centerY) / (rect.height / 2)
    }

    // Apply carousel tilt based on mouse position
    applyCarouselTilt()
  })

  // Reset on mouse leave
  gallery.addEventListener('mouseleave', () => {
    hoveredCardIndex.value = -1
    resetCarouselTilt()
  })

  // Setup individual card hover
  cardElements.value.forEach((card, index) => {
    card.addEventListener('mouseenter', () => handleCardHover(card, index))
    card.addEventListener('mouseleave', () => handleCardLeave(card, index))
  })
}

// Apply carousel 3D tilt based on mouse position
function applyCarouselTilt() {
  const tiltStrength = 3 // degrees
  const targetTilt = {
    x: -mousePos.value.y * tiltStrength,
    y: mousePos.value.x * tiltStrength
  }

  gsap.to(carouselTilt.value, {
    x: targetTilt.x,
    y: targetTilt.y,
    duration: 0.6,
    ease: 'power3.out'
  })

  // Apply tilt to cards container
  if (cardsRef.value) {
    gsap.to(cardsRef.value, {
      rotationX: carouselTilt.value.x,
      rotationY: carouselTilt.value.y,
      duration: 0.6,
      ease: 'power3.out'
    })
  }
}

// Reset carousel tilt
function resetCarouselTilt() {
  gsap.to(carouselTilt.value, {
    x: 0,
    y: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
  })

  if (cardsRef.value) {
    gsap.to(cardsRef.value, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}

// Handle card hover (magnetic effect)
function handleCardHover(card, index) {
  hoveredCardIndex.value = index

  // Kill any existing hover animations for this card
  if (hoverAnimations[index]) {
    hoverAnimations[index].kill()
  }

  // Magnetic pull effect
  const tl = gsap.timeline()

  // Main card: slight lift and brightness
  tl.to(card, {
    scale: 1.08,
    filter: 'brightness(1.2)',
    duration: 0.5,
    ease: 'power3.out',
  }, 0)

  // Ripple effect: animate surrounding cards
  createRippleEffect(index)

  hoverAnimations[index] = tl
}

// Handle card leave
function handleCardLeave(card, index) {
  if (hoveredCardIndex.value === index) {
    hoveredCardIndex.value = -1
  }

  // Kill existing animation
  if (hoverAnimations[index]) {
    hoverAnimations[index].kill()
  }

  // Smooth return to normal
  const tl = gsap.timeline()

  tl.to(card, {
    scale: 1,
    filter: 'brightness(1)',
    duration: 0.7,
    ease: 'elastic.out(1, 0.5)',
  })

  hoverAnimations[index] = tl
}

// Create ripple effect on surrounding cards
function createRippleEffect(centerIndex) {
  const cards = cardElements.value
  const totalCards = cards.length

  cards.forEach((card, index) => {
    if (index === centerIndex) return

    // Calculate distance from hovered card
    const distance = Math.min(
      Math.abs(index - centerIndex),
      totalCards - Math.abs(index - centerIndex)
    )

    // Ripple strength decreases with distance
    const strength = Math.max(0, 1 - distance / 3)

    if (strength > 0) {
      gsap.to(card, {
        scale: 1 + strength * 0.03,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      })

      // Return to normal after delay
      gsap.to(card, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.1,
        overwrite: 'auto'
      })
    }
  })
}

onMounted(() => {
  // Initialize binary digits
  initBinaryDigits()

  // Start binary animation loop
  const animateBinary = () => {
    updateBinaryDigits(carouselProgress.value)
    binaryAnimationTimer.value = requestAnimationFrame(animateBinary)
  }
  animateBinary()

  nextTick(() => {
    observeCarouselVisibility()
    // Setup interactive hover system after carousel is initialized
    setTimeout(() => {
      setupInteractiveHover()
    }, 500)
  })
})

onUnmounted(() => {
  if (stopAutoRotate) {
    stopAutoRotate()
  }
  stopAutoRotate = null
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  hasInitializedCarousel = false
  carouselProgress.value = 0
  cardBaseAngles.value = []
  
  // Cancel binary animation
  if (binaryAnimationTimer.value) {
    cancelAnimationFrame(binaryAnimationTimer.value)
  }
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
  padding: 2rem 0; /* Add consistent vertical padding */
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
  width: 12rem; /* Base card width */
  height: 17rem; /* Base card height */
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
  padding: 16px; /* Compact padding */
  margin: 0;
  width: 12rem; /* Match container width */
  height: 17rem; /* Match container height */
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
  backdrop-filter: blur(6px); /* Reduced blur for better performance */
  border: 1px solid rgba(255, 255, 255, 0.12);
  backface-visibility: visible;
  will-change: transform, opacity, filter; /* Add filter for brightness changes */
  /* Only transition box-shadow and border naturally - scale/filter controlled by GSAP */
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cards li:hover {
  /* Enhanced hover state - controlled by JS for magnetic effect */
  box-shadow:
    0 16px 56px rgba(0, 0, 0, 0.4),
    0 8px 28px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.35);
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
    width: 11rem;
    height: 16rem;
  }
  
  .cards li {
    width: 11rem;
    height: 16rem;
    padding: 14px;
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
    width: 10rem;
    height: 14.5rem;
  }
  
  .cards li {
    width: 10rem;
    height: 14.5rem;
    padding: 12px;
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
