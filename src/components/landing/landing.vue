<script setup>
import { ref, onMounted, onUnmounted, computed, inject, nextTick } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { techStack, categories } from '../../data/techStack.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst', 'NLP Developer', 'Creative Coder', 'Algorithm Designer', 'Automation Guru'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))
const lastGitHubUpdate = ref(null)
const isUsingFallbackData = ref(false)

const skills = ref([
  { name: 'Full-stack Developer', type: 'info' },
  { name: 'AI Enthusiast', type: 'success' },
  { name: 'Data Analyst', type: 'warning' },
  { name: 'Innovator', type: 'primary' }
])

const stats = ref([
  { label: 'Years of Coding', value: '8+', icon: '💻', type: 'static' },
  { label: 'Public Repos', value: '...', icon: '📦', type: 'github', key: 'repos' },
  { label: 'Total Stars', value: '...', icon: '⭐', type: 'github', key: 'stars' },
  { label: 'Total Forks', value: '...', icon: '🍴', type: 'github', key: 'forks' },
  { label: 'Lines of Code', value: '...', icon: '📝', type: 'github', key: 'linesOfCode' },
  { label: 'Open Source Projects Participated', value: '...', icon: '🌟', type: 'github', key: 'openSourceProjects' },
  { label: 'Participated Projects Stars', value: '...', icon: '✨', type: 'static', key: 'participatedProjectsStars' },
  { label: 'Contributions Made', value: '...', icon: '📈', type: 'github', key: 'contributions' },
  { label: 'Languages Used', value: '...', icon: '🛠️', type: 'github', key: 'languages' }
])

const githubUsername = 'PStarH' // Replace with your GitHub username
const isFirstLoad = ref(true)
let refreshInterval = null

onMounted(() => {
  typeNextRole()
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)

  // Wait for DOM rendering to complete before executing animations
  nextTick(() => {
    animateSkills()
    setupSmoothScroll()
    // Clear any stale cache older than 24 hours on startup
    clearStaleCache()
    // Force fresh data on first load to ensure users see current data
    fetchGitHubStats(true)
  })

  // Update time display text every minute
  setInterval(() => {
    if (lastGitHubUpdate.value) {
      // Trigger computed property recalculation
      lastGitHubUpdate.value = lastGitHubUpdate.value
    }
  }, 60000) // Update time display every 60 seconds

  // Set up 15-minute refresh interval for GitHub data
  refreshInterval = setInterval(() => {
    fetchGitHubStats()
  }, 15 * 60 * 1000) // 15 minutes
})

// Clean up intervals when component is unmounted
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

function setupSmoothScroll() {
  // Setup GSAP ScrollTrigger smooth scrolling
  ScrollTrigger.create({
    trigger: ".content-sections",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onUpdate: (self) => {
      // Animation effects during scrolling can be added here
    }
  })
}

// Clear stale cache data to ensure fresh experience
function clearStaleCache() {
  const cacheKey = `github-stats-${githubUsername}`
  const cached = localStorage.getItem(cacheKey)
  
  if (cached) {
    try {
      const { timestamp } = JSON.parse(cached)
      const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60)
      
      // Clear cache if it's older than 24 hours
      if (hoursSinceCache > 24) {
        localStorage.removeItem(cacheKey)
        console.log('Cleared stale GitHub cache (>24 hours old)')
      }
    } catch (error) {
      // Clear invalid cache data
      localStorage.removeItem(cacheKey)
      console.log('Cleared invalid GitHub cache data')
    }
  }
}

// Get GitHub statistics data
async function fetchGitHubStats(forceRefresh = false) {
  try {
    // Check cache (5-minute validity period)
    const cacheKey = `github-stats-${githubUsername}`
    const cached = localStorage.getItem(cacheKey)
    
    // On first load or force refresh, always fetch fresh data
    // Otherwise, use cache if it's less than 5 minutes old
    if (!forceRefresh && !isFirstLoad.value && cached) {
      try {
        const { data, timestamp, version } = JSON.parse(cached)
        lastGitHubUpdate.value = timestamp
        isUsingFallbackData.value = false
        
        // Check both time validity and cache version
        if (Date.now() - timestamp < 5 * 60 * 1000 && version === '1.0') {
          console.log('Using cached GitHub data')
          updateStatsWithData(data)
          return
        }
      } catch (error) {
        // Invalid cache format, remove it
        localStorage.removeItem(cacheKey)
        console.log('Removed invalid cache format')
      }
    }

    // Mark first load as complete
    if (isFirstLoad.value) {
      isFirstLoad.value = false
    }

    // Fetch fresh data from GitHub API
    console.log(forceRefresh ? 'Force refreshing GitHub data...' : 'Fetching fresh GitHub data...')
    
    // Get user information
    const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`)
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        console.warn('GitHub API rate limit exceeded, using cached data if available')
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            lastGitHubUpdate.value = timestamp
            isUsingFallbackData.value = false
            updateStatsWithData(data, true)
            return
          } catch (error) {
            console.warn('Could not parse cached data')
          }
        }
      }
      throw new Error(`Failed to fetch user data: ${userResponse.status}`)
    }
    const userData = await userResponse.json()

    // Get repository information (paginated, max 100 public repositories)
    const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&type=public&sort=updated`)
    if (!reposResponse.ok) throw new Error('Failed to fetch repos data')
    const reposData = await reposResponse.json()

    // Get contribution data (using events API as proxy)
    let contributions = 0
    try {
      const eventsResponse = await fetch(`https://api.github.com/users/${githubUsername}/events?per_page=100`)
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        // Calculate push events count from recent 100 events as contribution estimate
        contributions = eventsData.filter(event => 
          event.type === 'PushEvent' || 
          event.type === 'CreateEvent' || 
          event.type === 'PullRequestEvent'
        ).length
      }
    } catch (error) {
      console.warn('Could not fetch contributions data:', error)
    }

    // Get language data and lines of code statistics
    const languagesSet = new Set()
    let totalLinesOfCode = 0
    
    // Filter open source projects (exclude forked repositories, only count original projects)
    const originalRepos = reposData.filter(repo => !repo.fork)
    const openSourceProjects = originalRepos.length
    
    // Total stars from participated open source projects (manually counted data)
    const participatedProjectsStars = 110900 // 110.9K stars
    
    for (const repo of reposData) {
      if (repo.language) {
        languagesSet.add(repo.language)
      }
      // To get more detailed language information, we can fetch language statistics for each repository
      try {
        const repoLangsResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/languages`)
        if (repoLangsResponse.ok) {
          const repoLangs = await repoLangsResponse.json()
          Object.keys(repoLangs).forEach(lang => languagesSet.add(lang))
          // Accumulate lines of code (GitHub API returns bytes, we need to estimate lines)
          totalLinesOfCode += Object.values(repoLangs).reduce((sum, bytes) => sum + bytes, 0)
        }
      } catch (error) {
        // Ignore language fetching errors for individual repositories
      }
    }

    // Convert bytes to approximate lines of code (average ~30 bytes per line)
    const estimatedLinesOfCode = Math.round(totalLinesOfCode / 30)

    // Calculate statistics
    const publicRepos = userData.public_repos
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = reposData.reduce((sum, repo) => sum + repo.forks_count, 0)
    const totalContributions = contributions > 0 ? contributions * 10 : 100 // Estimate total contributions (multiply by 10 as approximation)
    const totalLanguages = languagesSet.size

    const statsData = { 
      publicRepos, 
      totalStars, 
      totalForks, 
      estimatedLinesOfCode,
      openSourceProjects,
      participatedProjectsStars,
      totalContributions, 
      totalLanguages 
    }
    
    // Cache data with version to ensure freshness
    const currentTimestamp = Date.now()
    const cacheData = {
      data: statsData,
      timestamp: currentTimestamp,
      version: '1.0' // Version for cache invalidation if needed
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    
    lastGitHubUpdate.value = currentTimestamp
    isUsingFallbackData.value = false

    updateStatsWithData(statsData)
    console.log('GitHub data updated successfully')

  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    // Use fallback data if API call fails
    const fallbackData = { 
      publicRepos: 29, 
      totalStars: 160, 
      totalForks: 9, 
      estimatedLinesOfCode: 16790000,
      openSourceProjects: 24,
      participatedProjectsStars: 110900,
      totalContributions: 120, 
      totalLanguages: 22
    }
    updateStatsWithData(fallbackData, true)
    
    // Set fallback flag and don't set update timestamp for fallback data
    isUsingFallbackData.value = true
    // Only set timestamp if there's no previous valid timestamp
    if (!lastGitHubUpdate.value) {
      lastGitHubUpdate.value = null
    }
  }
}

// Update statistics data
function updateStatsWithData(data, isFallback = false) {
  const { publicRepos, totalStars, totalForks, estimatedLinesOfCode, openSourceProjects, participatedProjectsStars, totalContributions, totalLanguages } = data
  
  stats.value = stats.value.map(stat => {
    if (stat.type === 'github') {
      switch (stat.key) {
        case 'repos':
          return { ...stat, value: publicRepos.toString() }
        case 'stars':
          return { ...stat, value: totalStars.toString() }
        case 'forks':
          return { ...stat, value: totalForks.toString() }
        case 'linesOfCode':
          return { ...stat, value: `${Math.round(estimatedLinesOfCode/1000)}K` }
        case 'openSourceProjects':
          return { ...stat, value: openSourceProjects.toString() }
        case 'contributions':
          return { ...stat, value: `${totalContributions}+` }
        case 'languages':
          return { ...stat, value: totalLanguages.toString() }
        default:
          return stat
      }
    } else if (stat.type === 'static' && stat.key === 'participatedProjectsStars') {
      // Handle static "Participated Projects Stars"
      return { ...stat, value: `${Math.round(participatedProjectsStars/1000)}K` }
    }
    return stat
  })

  // Add animation effects
  nextTick(() => {
    animateStatsUpdate()
  })
}

// Statistics data update animation
function animateStatsUpdate() {
  const statItems = document.querySelectorAll('.stat-value')
  statItems.forEach((item, index) => {
    gsap.fromTo(item, {
      scale: 1,
      opacity: 1
    }, {
      scale: 1.2,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      delay: index * 0.1
    })
  })
}

function animateSkills() {
  const tl = gsap.timeline()

  // Initialize all skill tags to invisible state, starting from far right
  gsap.set('.skill-tag', {
    opacity: 0,
    x: 400, // Start from farther away
    scale: 0.2,
    rotation: 35, // Larger rotation angle
    skewX: 20, // Larger skew
    transformOrigin: 'center center'
  })

  // Prepare container for vibration effects
  gsap.set('.skills-container', {
    transformOrigin: 'left center'
  })

  // Create compact and efficient collision animation (completed within 3 seconds)
  skills.value.forEach((skill, index) => {
    // Stage 1: High-speed impact
    tl.to(`.skill-tag:nth-child(${index + 1})`, {
      opacity: 1,
      x: -10, // Reduce overshoot distance
      scale: 1.3, // Scale up on impact
      rotation: -4,
      skewX: -2,
      duration: 0.2, // Further accelerate impact
      ease: 'power4.out',
      delay: index * 0.2 + 0.3 // Greatly reduce interval: from 0.5s to 0.2s, initial delay from 0.8s to 0.4s
    })

      // Stage 2: Quick vibration rebound
      .to(`.skill-tag:nth-child(${index + 1})`, {
        x: 2, // Smaller rebound
        scale: 0.98,
        rotation: 0.5,
        duration: 0.15, // Faster vibration
        ease: 'power2.inOut',
        onStart: function () {
          // Simplified vibration effect
          gsap.to('.skills-container', {
            x: index % 2 === 0 ? 3 : -3,
            duration: 0.02,
            repeat: 2,
            yoyo: true,
            ease: 'power2.inOut'
          })

          // Enhanced shockwave effect
          gsap.fromTo(`.skill-tag:nth-child(${index + 1})`, {
            boxShadow: '0 0 0 0 rgba(0, 140, 255, 1), 0 0 0 0 rgba(255, 77, 109, 0.8)'
          }, {
            boxShadow: '0 0 0 25px rgba(0, 140, 255, 0), 0 0 0 40px rgba(255, 77, 109, 0)', // Increase shockwave range
            duration: 0.4, // Extend duration
            ease: 'power2.out'
          })
        }
      })

      // Stage 3: Quick stabilization
      .to(`.skill-tag:nth-child(${index + 1})`, {
        x: 0,
        scale: 1,
        rotation: 0,
        skewX: 0,
        duration: 0.25, // Greatly shorten stabilization time
        ease: 'elastic.out(1.5, 0.6)',
        onComplete: function () {
          // Immediately restore container position
          gsap.set('.skills-container', { x: 0 })
        }
      }, '-=0.05')

      // Stage 4: Simple bounce
      .to(`.skill-tag:nth-child(${index + 1})`, {
        y: -5, // Reduce bounce height
        duration: 0.1,
        ease: 'power2.out'
      }, '-=0.2')

      .to(`.skill-tag:nth-child(${index + 1})`, {
        y: 0,
        duration: 0.15,
        ease: 'bounce.out',
        onComplete: function () {
          // Add particle explosion effect after completely settled
          createParticles(`.skill-tag:nth-child(${index + 1})`)
        }
      })
  })
}

// Create enhanced particle explosion effect
function createParticles(selector) {
  const element = document.querySelector(selector)
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Create more particles for enhanced visual effect
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div')
    particle.className = 'collision-particle'

    // Random particle size for visual hierarchy
    const size = 3 + Math.random() * 4
    const colors = [
      'rgba(0, 140, 255, 0.9)',
      'rgba(255, 77, 109, 0.9)',
      'rgba(0, 255, 136, 0.8)',
      'rgba(255, 165, 0, 0.8)'
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]

    particle.style.cssText = `
      position: fixed;
      left: ${centerX - size / 2}px;
      top: ${centerY - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 0 ${size * 2}px ${color};
    `

    document.body.appendChild(particle)

    // Random direction and distance for variation
    const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
    const distance = 40 + Math.random() * 40
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance

    // Enhanced particle animation
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0,
      opacity: 0,
      rotation: 360 + Math.random() * 360,
      duration: 0.4 + Math.random() * 0.2, // Random duration
      ease: 'power2.out',
      onComplete: () => {
        document.body.removeChild(particle)
      }
    })
  }
}

function typeNextRole() {
  const role = roles.value[currentRoleIndex.value]
  let charIndex = 0

  const typingInterval = setInterval(() => {
    if (charIndex < role.length) {
      typedText.value += role[charIndex]
      charIndex++
    } else {
      clearInterval(typingInterval)
      setTimeout(() => {
        eraseRole()
      }, 2000)
    }
  }, 100)
}

function eraseRole() {
  const eraseInterval = setInterval(() => {
    if (typedText.value.length > 0) {
      typedText.value = typedText.value.slice(0, -1)
    } else {
      clearInterval(eraseInterval)
      currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.value.length
      setTimeout(() => {
        typeNextRole()
      }, 500)
    }
  }, 50)
}

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  'color': 'transparent',
  '-webkit-text-fill-color': 'transparent',
}))

// Calculate GitHub update time
const timeAgoText = computed(() => {
  if (isUsingFallbackData.value) {
    return 'using offline data'
  }
  
  if (!lastGitHubUpdate.value) return ''
  
  const now = Date.now()
  const diff = now - lastGitHubUpdate.value
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
})
</script>

<template>
  <div class="homepage">
    <!-- First section: Introduction and skills -->
    <section class="hero-section">
      <div class="hero-content">
        <n-grid :cols="24" :x-gap="24" style="align-items: center;">
          <n-gi :span="16">
            <div class="intro">
              <h1 class="name" :style="gradientStyle">Hello, I'm Xinghan Pan!</h1>
              <div class="role-container">
                <span class="role">I'm a </span>
                <span class="typed-role">{{ typedText }}<span class="cursor"
                    :class="{ 'cursor-visible': showCursor }">|</span></span>
              </div>
              <p class="description" style="font-weight: bold;">
                Building the future through code at SCIE. As a CS innovator
                passionate about AI research, I transform complex challenges into breakthrough solutions. My
                mission is creating technology that changes the world, one algorithm at a time.
              </p>
            </div>
          </n-gi>
          <n-gi :span="8">
            <n-flex :justify="'end'">
              <n-avatar :size="289" :src="`/website/images/landingAvatar.jpg`" round class="avatar" />
            </n-flex>
          </n-gi>
        </n-grid>
        <div class="skills-container">
          <n-tag v-for="(skill, index) in skills" :key="skill.name" :type="skill.type" class="skill-tag"
            :data-index="index">
            <template #icon>
              <n-icon :component="ChevronRight" />
            </template>
            {{ skill.name }}
          </n-tag>
        </div>
        
        <!-- Statistics data -->
        <div class="stats-section">
          <div class="stats-header" v-if="lastGitHubUpdate || isUsingFallbackData">
            <div class="update-info" :class="{ 'fallback-data': isUsingFallbackData }">
              <span class="update-icon">{{ isUsingFallbackData ? '⚠️' : '🔄' }}</span>
              <span class="update-text">{{ isUsingFallbackData ? 'GitHub data' : 'GitHub data updated' }} {{ timeAgoText }}</span>
            </div>
          </div>
          <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.label" class="stat-item" :class="{ 'loading': stat.value === '...' }">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-value" :class="{ 'shimmer': stat.value === '...' }">
                {{ stat.value === '...' ? '—' : stat.value }}
              </div>
              <div class="stat-label">{{ stat.label }}</div>
              <n-tooltip v-if="stat.type === 'github'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="github-icon">🐙</span>
                    <span class="badge-text">Live</span>
                  </div>
                </template>
                Live data from GitHub API
              </n-tooltip>
            </div>
          </div>
        </div>
        
      </div>
    </section>

    <!-- Subsequent content areas -->
    <div class="content-sections">
      <n-divider />

      <div class="projects-section">
      <h2 :style="gradientStyle">Projects I've Worked On</h2>
      <n-grid :cols="2" :x-gap="24" :y-gap="24">
        <n-gi>
          <div class="projectsCard" @click="router.push({ name: 'project' })">
            <div class="project-title"><b>Explained Algorithms</b></div>
            <div>
              <n-text :depth="3">
                Using real-life examples and actual Leetcode problems, I explain the algorithms and data structures in a
                way
                that is easy to understand and remember with implementation of the algorithm that can be viewed by the
                user
                visually.
              </n-text>
            </div>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <n-divider></n-divider>
    <div class="tech-stack">
      <h1 :style="gradientStyle">Tech Stack</h1>
      <div class="tech-categories">
        <div v-for="category in categories" :key="category.id" class="category-section">
          <h4 class="category-title">{{ category.name }}</h4>
          <div class="tech-icons">
            <n-tooltip v-for="tech in techStack.filter(t =>
              Array.isArray(category.id)
                ? category.id.includes(t.category)
                : t.category === category.id
            )" :key="tech.name" :trigger="'hover'" :placement="'top'">
              <template #trigger>
                <div class="tech-icon">
                  <img :src="`https://api.iconify.design/${tech.icon.replace(':', '/')}.svg`" :alt="tech.name"
                    class="tech-icon-img" />
                </div>
              </template>
              {{ tech.name }}
            </n-tooltip>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.homepage {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* First section styles - reduced height */
.hero-section {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px 24px;
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
}

/* Subsequent content areas */
.content-sections {
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px;
}

/* Scroll down indicator animation */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 2s infinite;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-text {
  font-size: 14px;
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
  margin-bottom: 8px;
  font-weight: 500;
}

.scroll-arrow {
  font-size: 20px;
  color: #008CFF;
  font-weight: bold;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.intro {
  margin-bottom: 24px;
}

.name {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.role-container {
  font-size: 24px;
  margin-bottom: 24px;
}

.role {
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
}

.typed-role {
  font-weight: bold;
  color: #008CFF;
}

.cursor {
  display: inline-block;
  width: 2px;
  background-color: #008CFF;
  animation: blink 0.7s infinite;
}

.cursor-visible {
  opacity: 1;
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes impact {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }

  25% {
    transform: scale(1.15) rotate(1deg);
    filter: brightness(1.2);
  }

  50% {
    transform: scale(1.08) rotate(-0.5deg);
    filter: brightness(1.1);
  }

  75% {
    transform: scale(1.05) rotate(0.3deg);
    filter: brightness(1.05);
  }

  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }

  10% {
    transform: translateX(-3px) translateY(-1px) rotate(-1deg);
  }

  20% {
    transform: translateX(3px) translateY(1px) rotate(1deg);
  }

  30% {
    transform: translateX(-2px) translateY(-1px) rotate(-0.5deg);
  }

  40% {
    transform: translateX(2px) translateY(1px) rotate(0.5deg);
  }

  50% {
    transform: translateX(-1px) translateY(-0.5px) rotate(-0.2deg);
  }

  60% {
    transform: translateX(1px) translateY(0.5px) rotate(0.2deg);
  }

  70% {
    transform: translateX(-0.5px) translateY(-0.2px) rotate(-0.1deg);
  }

  80% {
    transform: translateX(0.5px) translateY(0.2px) rotate(0.1deg);
  }

  90% {
    transform: translateX(-0.2px) translateY(-0.1px) rotate(-0.05deg);
  }
}

/* Collision ripple effects */
@keyframes ripple {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
    border-radius: 50%;
  }

  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.5;
    border-radius: 30%;
  }

  100% {
    transform: scale(3) rotate(360deg);
    opacity: 0;
    border-radius: 10%;
  }
}

/* Particle explosion effects */
@keyframes particle-explosion {
  0% {
    transform: scale(0) translate(-50%, -50%);
    opacity: 1;
  }

  50% {
    transform: scale(2) translate(-50%, -50%);
    opacity: 0.8;
  }

  100% {
    transform: scale(4) translate(-50%, -50%);
    opacity: 0;
  }
}

/* Collision particle styles - enhanced version */
.collision-particle {
  background: radial-gradient(circle, rgba(0, 140, 255, 1) 0%, rgba(0, 140, 255, 0.8) 30%, transparent 70%);
  box-shadow:
    0 0 10px rgba(0, 140, 255, 1),
    0 0 20px rgba(0, 140, 255, 0.8),
    0 0 30px rgba(0, 140, 255, 0.6);
  animation: particle-glow 0.6s ease-out;
}

/* Particle glow animation */
@keyframes particle-glow {
  0% {
    box-shadow:
      0 0 5px rgba(0, 140, 255, 1),
      0 0 10px rgba(0, 140, 255, 0.8);
  }

  50% {
    box-shadow:
      0 0 15px rgba(0, 140, 255, 1),
      0 0 30px rgba(0, 140, 255, 0.8),
      0 0 45px rgba(0, 140, 255, 0.6);
  }

  100% {
    box-shadow:
      0 0 5px rgba(0, 140, 255, 0.5),
      0 0 10px rgba(0, 140, 255, 0.3);
  }
}

/* Glow pulse effects */
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 5px rgba(0, 140, 255, 0.3);
  }

  50% {
    box-shadow: 0 0 20px rgba(0, 140, 255, 0.6), 0 0 30px rgba(0, 140, 255, 0.4);
  }

  100% {
    box-shadow: 0 0 5px rgba(0, 140, 255, 0.3);
  }
}

.description {
  font-size: 18px;
  font-style: bold;
  line-height: 1.6;
  margin-bottom: 24px;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
}

/* Status indicator styles */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px 16px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'");
  border-radius: 20px;
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'");
  backdrop-filter: blur(10px);
  width: fit-content;
}

.status-emoji {
  font-size: 16px;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
}

.skills-container {
  display: flex;
  gap: 0px;
  /* No spacing at all */
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
  /* Top align to ensure square fitting */
  position: relative;
  overflow: visible;
  /* Ensure animation effects are visible */
  padding: 4px;
  /* Reduce padding to minimize space */
}

.skill-tag {
  font-size: 14px;
  opacity: 0;
  /* 初始隐藏 */
  transform: translateX(400px) scale(0.2) rotate(35deg) skewX(20deg);
  /* 更强烈的初始变形 */
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  /* 更方形的圆角 */
  overflow: hidden;
  will-change: transform;
  /* 优化性能 */
  margin: 0;
  /* 完全移除边距 */
  backdrop-filter: blur(10px);
  /* 添加毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* 添加细边框 */
  min-height: 28px;
  /* 减少高度 */
  display: flex;
  align-items: center;
  padding: 4px 8px;
  /* 减少内边距 */
  box-sizing: border-box;
}

.skill-tag:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow:
    0 8px 25px rgba(0, 140, 255, 0.4),
    0 0 0 3px rgba(0, 140, 255, 0.2),
    0 0 15px rgba(0, 140, 255, 0.6);
  transition: all 0.3s ease;
  animation: impact 0.4s ease-out;
  z-index: 10;
  /* 确保hover时在最上层 */
}

/* 添加碰撞后的光晕效果 - 增强版 */
.skill-tag::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.9),
      rgba(0, 140, 255, 0.3),
      transparent);
  transition: left 0.6s ease;
  pointer-events: none;
  z-index: 1;
}

.skill-tag:hover::after {
  left: 100%;
}

/* 添加碰撞时的粒子效果 */
.skill-tag::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(0, 140, 255, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

/* Special effects during collision */
.skill-tag.impact {
  animation: shake 0.4s ease-in-out;
}

/* Statistics data styles */
.stats-section {
  margin: 32px 0;
}

.stats-header {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'");
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'");
  border-radius: 12px;
  backdrop-filter: blur(10px);
  font-size: 12px;
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
  font-weight: 500;
}

.update-info.fallback-data {
  background: v-bind("isDarkMode ? 'rgba(255, 165, 0, 0.1)' : 'rgba(255, 165, 0, 0.05)'");
  border-color: v-bind("isDarkMode ? 'rgba(255, 165, 0, 0.3)' : 'rgba(255, 165, 0, 0.2)'");
  color: v-bind("isDarkMode ? '#FFB366' : '#CC8400'");
}

.update-icon {
  font-size: 10px;
  opacity: 0.8;
}

.update-text {
  font-size: 11px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(85px, 1fr));
  gap: 10px;
  max-width: 900px;
}

.stat-item {
  text-align: center;
  padding: 10px 6px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
  border-radius: 10px;
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'");
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 140, 255, 0.15);
  border-color: rgba(0, 140, 255, 0.3);
}

.stat-item.loading {
  border-color: rgba(0, 140, 255, 0.2);
  background: v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.05)' : 'rgba(0, 140, 255, 0.03)'");
}

.stat-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 11px;
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
  font-weight: 500;
}

/* GitHub badge styles */
.stat-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 1px 4px;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  border-radius: 8px;
  font-size: 8px;
  color: white;
  font-weight: 600;
  opacity: 0.8;
}

.github-icon {
  font-size: 6px;
}

.badge-text {
  font-size: 7px;
}

/* Loading animation */
.shimmer {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 140, 255, 0.3) 50%, 
    transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Personal highlights styles */
.highlights-section {
  margin: 24px 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  max-width: 600px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'");
  border-radius: 8px;
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'");
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateX(4px);
  border-color: rgba(0, 140, 255, 0.2);
  background: v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.05)' : 'rgba(0, 140, 255, 0.03)'");
}

.highlight-bullet {
  font-size: 14px;
  flex-shrink: 0;
}

.highlight-text {
  font-size: 13px;
  color: v-bind("isDarkMode ? '#C0C0C0' : '#555555'");
  font-weight: 500;
}

/* Social links styles */
.social-section {
  margin-top: 32px;
}

.social-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'");
  border: 1px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'");
  border-radius: 20px;
  text-decoration: none;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  border-color: var(--hover-color);
  box-shadow: 0 4px 15px rgba(0, 140, 255, 0.2);
  color: var(--hover-color);
}

.social-icon {
  font-size: 16px;
}

.avatar {
  transition: transform 0.3s ease-in-out;
}

.avatar:hover {
  transform: scale(1.05);
}

.projects-section {
  margin-top: 32px;
  margin-bottom: 64px;
}

.projects-section h2 {
  font-size: 32px;
  margin-bottom: 24px;
}

.projectsCard {
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--boxShadow-light);
  background-color: rgba(58, 51, 83, 0.9);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: v-bind("isDarkMode ? '0 4px 12px rgba(255, 255, 255, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)'");
}

.tech-stack {
  margin-bottom: 64px;
}

.tech-stack h3 {
  font-size: 20px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.tech-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.category-section {
  background-color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
  border-radius: 8px;
  padding: 12px;
}

.category-title {
  font-size: 14px;
  margin-bottom: 12px;
  color: v-bind("isDarkMode ? '#e0e0e0' : '#333333'");
}

.tech-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tech-icon {
  width: 28px;
  height: 28px;
  padding: 5px;
  border-radius: 6px;
  background-color: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)'");
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tech-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tech-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: none;
}

:root[class='dark'] .tech-icon-img {
  filter: brightness(0.95);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 0 16px 16px;
    min-height: 50vh;
  }

  .content-sections {
    padding: 16px;
  }

  .name {
    font-size: 36px;
  }

  .role-container {
    font-size: 20px;
  }

  .description {
    font-size: 16px;
  }

  .skills-container {
    flex-wrap: wrap;
    gap: 0px;
    /* 移动端也保持无间距 */
    padding: 3px;
  }

  .skill-tag {
    font-size: 12px;
    /* 移动端稍小的字体 */
    margin: 0;
    /* 移动端也无边距 */
    padding: 3px 6px;
    /* 进一步减少移动端内边距 */
    min-height: 24px;
    /* 进一步减少移动端高度 */
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
    max-width: 100%;
  }

  .update-info {
    padding: 3px 8px;
    font-size: 10px;
    gap: 4px;
  }

  .update-icon {
    font-size: 8px;
  }

  .update-text {
    font-size: 9px;
  }

  .stat-item {
    padding: 6px 3px;
  }

  .stat-icon {
    font-size: 14px;
    margin-bottom: 3px;
  }

  .stat-value {
    font-size: 14px;
  }

  .stat-label {
    font-size: 8px;
  }

  .stat-badge {
    top: 2px;
    right: 2px;
    padding: 1px 3px;
  }

  .badge-text {
    font-size: 6px;
  }

  .social-links {
    gap: 12px;
  }

  .social-link {
    padding: 6px 12px;
    font-size: 13px;
  }

  .social-title {
    font-size: 16px;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .highlight-item {
    padding: 6px 10px;
  }

  .highlight-text {
    font-size: 12px;
  }

  .projects-section h2 {
    font-size: 28px;
  }

  .tech-categories {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .tech-icons {
    gap: 6px;
  }

  .tech-icon {
    width: 24px;
    height: 24px;
    padding: 4px;
  }

  .category-title {
    font-size: 13px;
  }

  .scroll-indicator {
    bottom: 20px;
  }

  .scroll-text {
    font-size: 12px;
  }

  .scroll-arrow {
    font-size: 18px;
  }
}
</style>
