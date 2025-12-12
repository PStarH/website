<script setup>
import { ref, onMounted, onUnmounted, computed, inject, nextTick, watchEffect, defineAsyncComponent } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { VueLenis, useLenis } from 'lenis/vue'

// Lazy load non-critical components for better performance
const TechStack = defineAsyncComponent(() => import('./TechStack.vue'))
const ArticleResearch = defineAsyncComponent(() => import('./ArticleResearch.vue'))
const Awards = defineAsyncComponent(() => import('./Awards.vue'))

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const router = useRouter()

// Lenis smooth scroll setup
const lenisRef = ref(null)
const lenisOptions = {
  lerp: 0.2, // Much faster response (was 0.15)
  duration: 0.8, // Even shorter for snappier feel (was 0.9)
  smoothWheel: true,
  syncTouch: false, // Better performance on touch devices
  touchMultiplier: 2,
  infinite: false,
  wheelMultiplier: 1.2, // Faster wheel scrolling (was 1.0)
}

const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst', 'NLP Developer', 'Creative Coder', 'Algorithm Designer', 'Automation Guru'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))
const lastGitHubUpdate = ref(null)
const isUsingFallbackData = ref(false)

// Avatar tilt effect
const avatarTilt = ref({ x: 0, y: 0 })
const avatarContainer = ref(null)

// Rating history data
const ratingHistory = ref([])

const skills = ref([
  { name: 'Full-stack Developer', type: 'info' },
  { name: 'AI Enthusiast', type: 'success' },
  { name: 'Data Analyst', type: 'warning' },
  { name: 'Innovator', type: 'primary' }
])

const stats = ref([
  { label: 'Started Coding', value: '2017', icon: '🚀', type: 'static' },
  { label: 'Years of Coding', value: '8+', icon: '💻', type: 'static' },
  { label: 'Public Repos', value: '...', icon: '📦', type: 'github', key: 'repos' },
  { label: 'Total Stars', value: '...', icon: '⭐', type: 'github', key: 'stars' },
  { label: 'Total Forks', value: '...', icon: '🍴', type: 'github', key: 'forks' },
  { label: 'Lines of Code', value: '...', icon: '📝', type: 'github', key: 'linesOfCode' },
  { label: 'Open Source Projects Participated', value: '...', icon: '🌟', type: 'github', key: 'openSourceProjects' },
  { label: 'Participated Projects Stars', value: '...', icon: '✨', type: 'static', key: 'participatedProjectsStars' },
  { label: 'Contributions Made', value: '...', icon: '📈', type: 'github', key: 'contributions' },
  { label: 'Languages Used', value: '...', icon: '🛠️', type: 'github', key: 'languages' },
  { label: 'CF Problems Solved', value: '...', icon: '🔥', type: 'codeforces', key: 'solvedProblems' },
  { label: 'CF Max Rating', value: '...', icon: '⚡', type: 'codeforces', key: 'maxRating' },
  { label: 'CF Current Rating', value: '...', icon: '🎯', type: 'codeforces', key: 'currentRating' }
])

// Pyramid stats (excluding the two static ones that will be side colliders)
const pyramidStats = computed(() => {
  return stats.value.filter(stat => 
    stat.label !== 'Started Coding' && 
    stat.label !== 'Years of Coding'
  ).slice(0, 10) // Ensure we only have 10 items for the pyramid
})

// All stats for final grid display (including side stats)
const allStatsForGrid = computed(() => {
  return stats.value.slice(0, 12) // All 12 stats including the side ones
})

const githubUsername = 'PStarH' // Replace with your GitHub username
const codeforcesUsername = 'transfeft' // Codeforces username
const isFirstLoad = ref(true)
const lastCodeforcesUpdate = ref(null) // Add Codeforces update tracking
const isUsingCodeforceseFallbackData = ref(false) // Add Codeforces fallback flag
let refreshInterval = null
let cursorBlinkInterval = null
let typingInterval = null
let typingTimeout = null

// Performance optimization flags
const prefersReducedMotion = ref(false)
const statsVisible = ref(false)
const statsObserver = ref(null)
const devicePerformance = ref('high') // high, medium, low

// Integrate Lenis with GSAP ScrollTrigger
let scrollTimeout = null
let lastScrollY = 0
let scrollDirection = 0
let cachedSections = [] // Cache sections for performance
let isSnapping = false // Flag to prevent snap during snap animation
const SNAP_SETTINGS = Object.freeze({
  previousThreshold: 0.08, // Require user to get closer to top before snapping upward
  nextThreshold: 0.82, // Small adjustment to avoid premature downward snaps
  minDistance: 80 // Minimum pixels away from target before triggering snap
})

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return

  // Update ScrollTrigger on Lenis scroll
  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  // Add Lenis raf to GSAP ticker for smooth animations
  function update(time) {
    lenisRef.value.lenis.raf(time * 1000)
  }
  gsap.ticker.add(update)

  // Enable lag smoothing to prevent jitter during performance drops
  gsap.ticker.lagSmoothing(500, 33)

  // Track scroll direction and detect when scrolling has stopped or slowing down
  lenisRef.value.lenis.on('scroll', ({ scroll, velocity }) => {
    // Don't process scroll events during snap animation
    if (isSnapping) return

    // Track scroll direction
    if (scroll > lastScrollY) {
      scrollDirection = 1 // scrolling down
    } else if (scroll < lastScrollY) {
      scrollDirection = -1 // scrolling up
    }
    lastScrollY = scroll

    // Clear previous timeout
    if (scrollTimeout) clearTimeout(scrollTimeout)

    // Detect when scrolling has slowed down significantly
    if (Math.abs(velocity) < 0.1) { // Increased threshold for faster snap trigger (was 0.05)
      scrollTimeout = setTimeout(() => {
        // Double check before snapping
        if (!isSnapping) {
          snapToNearestSection()
        }
      }, 50) // Reduced delay for faster response (was 100ms)
    }
  })

  // Cleanup on component unmount
  onInvalidate(() => {
    gsap.ticker.remove(update)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  })
})

// Improved section snap with damping feel
const snapToNearestSection = () => {
  if (!lenisRef.value?.lenis || isSnapping) return

  // Set flag to prevent cascading snaps
  isSnapping = true

  // Use cached sections if available, otherwise dynamically query all sections
  let sections = cachedSections

  if (cachedSections.length === 0) {
    // Dynamically get all sections including all content-sections children
    const contentSections = Array.from(document.querySelectorAll('.content-sections > *'))
    sections = [
      document.querySelector('.hero-section'),
      document.querySelector('.pyramid-section'),
      ...contentSections
    ].filter(Boolean)

    // Cache sections for next time
    if (sections.length > 0) {
      cachedSections = sections
    }
  }

  if (sections.length === 0) {
    isSnapping = false
    return
  }

  const scrollY = lenisRef.value.lenis.scroll
  const windowHeight = window.innerHeight

  // Special case: if we're at the very top (within 50px), always snap to absolute top
  if (scrollY < 50) {
    lenisRef.value.lenis.scrollTo(0, {
      duration: 0.3, // Very fast snap to top (was 0.4)
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      onComplete: () => {
        isSnapping = false
      }
    })
    return
  }

  // Find current section (the one we're viewing the most)
  let nearestSection = sections[0]
  let minDistance = Infinity
  let currentSectionIndex = 0

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight
    const sectionCenter = (sectionTop + sectionBottom) / 2
    const viewportCenter = scrollY + windowHeight / 2

    // Calculate how much of this section is in viewport
    const distance = Math.abs(viewportCenter - sectionCenter)

    if (distance < minDistance) {
      minDistance = distance
      nearestSection = section
      currentSectionIndex = index
    }
  })

  // Calculate position within current section (0 to 1)
  const sectionTop = nearestSection.offsetTop
  const sectionHeight = nearestSection.offsetHeight
  const positionInSection = (scrollY - sectionTop) / sectionHeight

  // Determine target section based on position and scroll direction
  let targetSection = nearestSection

  // Check if this is the last section
  const isLastSection = currentSectionIndex === sections.length - 1

  // Check if we're near the bottom of the page
  const documentHeight = document.documentElement.scrollHeight
  const viewportBottom = scrollY + windowHeight
  const distanceFromBottom = documentHeight - viewportBottom
  const nearPageBottom = distanceFromBottom < 100 // Within 100px of bottom

  // Only snap to next/previous if we're near the edges AND scrolling in that direction
  if (scrollDirection > 0 && positionInSection > SNAP_SETTINGS.nextThreshold && currentSectionIndex < sections.length - 1) {
    // Scrolling down and near bottom (>80%) - snap to next section
    targetSection = sections[currentSectionIndex + 1]
  } else if (scrollDirection < 0 && positionInSection < SNAP_SETTINGS.previousThreshold && currentSectionIndex > 0) {
    // Scrolling up and near top (<20%) - snap to previous section
    targetSection = sections[currentSectionIndex - 1]
  } else if (isLastSection && (positionInSection > 0.3 || nearPageBottom)) {
    // Special case: if on last section and either:
    // - in bottom 70% of section, OR
    // - near the page bottom
    // Don't snap - allow viewing all content including bottom
    isSnapping = false
    return
  } else {
    // In the middle (20%-80%) or wrong direction - stay on current section
    targetSection = nearestSection
  }

  // Special handling for hero-section: snap to absolute top (0) instead of section top
  const isHeroSection = targetSection === sections[0]
  const targetPosition = isHeroSection ? 0 : targetSection.offsetTop

  // Only snap if we're not already very close to target
  const distanceToTarget = Math.abs(targetPosition - scrollY)
  const minDistanceForSnap = Math.max(SNAP_SETTINGS.minDistance, windowHeight * 0.1)
  if (distanceToTarget > minDistanceForSnap) {
    lenisRef.value.lenis.scrollTo(isHeroSection ? 0 : targetSection, {
      offset: isHeroSection ? 0 : 8, // No offset for hero, 8px offset for others
      duration: 0.3, // Very fast snap for responsive feel (was 0.4s)
      easing: (t) => {
        // Custom easing for damping feel - quick deceleration
        return 1 - Math.pow(1 - t, 3)
      },
      lock: true,
      onComplete: () => {
        // Reset flag when snap animation completes
        isSnapping = false
      }
    })
  } else {
    // If we're already close to target, just reset the flag
    isSnapping = false
  }
}

onMounted(() => {
  // Detect user's motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches

  // Listen for changes in motion preference
  motionQuery.addEventListener('change', (e) => {
    prefersReducedMotion.value = e.matches
  })

  // Detect device performance
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4

  if (cores <= 2 || memory <= 2) {
    devicePerformance.value = 'low'
  } else if (cores <= 4 || memory <= 4) {
    devicePerformance.value = 'medium'
  } else {
    devicePerformance.value = 'high'
  }

  typeNextRole()
  cursorBlinkInterval = setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)

  // Wait for DOM rendering to complete before executing animations
  nextTick(() => {
    animateSkills()
    setupPyramidAnimation()

    // Only setup animations if user prefers motion
    if (!prefersReducedMotion.value) {
      setupVortexAnimation() // Now creates snowflake effect
      setupAvatarTiltEffect() // Add avatar tilt effect
    }

    // Clear any stale cache older than 24 hours on startup
    clearStaleCache()

    // Setup Intersection Observer for lazy API calls
    setupStatsObserver()
  })

  // Update time display text every minute
  setInterval(() => {
    if (lastGitHubUpdate.value || lastCodeforcesUpdate.value) {
      // Trigger computed property recalculation for both services
      lastGitHubUpdate.value = lastGitHubUpdate.value
      lastCodeforcesUpdate.value = lastCodeforcesUpdate.value
    }
  }, 60000) // Update time display every 60 seconds

  // Set up 15-minute refresh interval for GitHub data (only if stats are visible)
  refreshInterval = setInterval(() => {
    if (statsVisible.value) {
      fetchGitHubStats()
      fetchCodeforcesStats()
    }
  }, 15 * 60 * 1000) // 15 minutes
})

// Clean up intervals when component is unmounted
onUnmounted(() => {
  // Clear all intervals
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (cursorBlinkInterval) {
    clearInterval(cursorBlinkInterval)
  }
  if (typingInterval) {
    clearInterval(typingInterval)
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }

  // Disconnect Intersection Observer
  if (statsObserver.value) {
    statsObserver.value.disconnect()
    statsObserver.value = null
  }

  // Kill all GSAP animations and ScrollTriggers
  gsap.killTweensOf('*')
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())

  // Clear any pending timeouts
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  // Destroy Lenis instance if it exists
  if (lenisRef.value?.lenis) {
    lenisRef.value.lenis.destroy()
  }

  // Clean up all particle elements
  const particleElements = document.querySelectorAll('.collision-particle, .impact-particle, .snowflake-particle, .star-particle, .snowflake-container')
  particleElements.forEach(element => {
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  })
})

// Disabled: Using CSS scroll-snap instead
/*
function setupSmoothScroll() {
  // Only add scroll snap when user actively scrolls to statistics section
  ScrollTrigger.create({
    trigger: '#statisticsSection',
    start: 'top 50%', // Changed to trigger only when actively scrolling
    end: 'center center',
    onEnter: () => {
      // Only snap if user is actively scrolling down (not on page load)
      if (window.scrollY > 200) { // Only if user has scrolled past hero section
        gsap.to(window, {
          duration: 0.8,
          scrollTo: {
            y: '#statisticsSection',
            offsetY: 0
          },
          ease: 'power2.out'
        })
      }
    }
  })

  // Add scroll snap when leaving statistics section
  ScrollTrigger.create({
    trigger: '#statisticsSection',
    start: 'bottom 30%',
    end: 'bottom top',
    onLeave: () => {
      // Snap to the project section when scrolling down past statistics
      gsap.to(window, {
        duration: 1.0,
        scrollTo: {
          y: '.projects-section', // Target the actual projects section
          offsetY: -80 // Offset to show the divider properly
        },
        ease: 'power2.out'
      })
    },
    onEnterBack: () => {
      // Snap back to statistics section when scrolling up
      gsap.to(window, {
        duration: 0.8,
        scrollTo: {
          y: '#statisticsSection',
          offsetY: 0
        },
        ease: 'power2.out'
      })
    }
  })
}
*/

// Clear stale cache data to ensure fresh experience
function clearStaleCache() {
  // Clear GitHub cache
  const githubCacheKey = `github-stats-${githubUsername}`
  const githubCached = localStorage.getItem(githubCacheKey)

  if (githubCached) {
    try {
      const { timestamp } = JSON.parse(githubCached)
      const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60)

      // Clear cache if it's older than 24 hours
      if (hoursSinceCache > 24) {
        localStorage.removeItem(githubCacheKey)
        console.log('Cleared stale GitHub cache (>24 hours old)')
      }
    } catch (error) {
      // Clear invalid cache data
      localStorage.removeItem(githubCacheKey)
      console.log('Cleared invalid GitHub cache data')
    }
  }

  // Clear Codeforces cache
  const codeforcesCacheKey = `codeforces-stats-${codeforcesUsername}`
  const codeforcesCached = localStorage.getItem(codeforcesCacheKey)

  if (codeforcesCached) {
    try {
      const { timestamp } = JSON.parse(codeforcesCached)
      const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60)

      // Clear cache if it's older than 24 hours
      if (hoursSinceCache > 24) {
        localStorage.removeItem(codeforcesCacheKey)
        console.log('Cleared stale Codeforces cache (>24 hours old)')
      }
    } catch (error) {
      // Clear invalid cache data
      localStorage.removeItem(codeforcesCacheKey)
      console.log('Cleared invalid Codeforces cache data')
    }
  }
}

// Setup Intersection Observer for lazy loading API data
function setupStatsObserver() {
  const statsSection = document.getElementById('statisticsSection')
  if (!statsSection) return

  // Create Intersection Observer to detect when stats section is near viewport
  statsObserver.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible.value) {
          statsVisible.value = true
          // Load stats data when section is about to be visible
          fetchGitHubStats(true)
          fetchCodeforcesStats(true)
          // Disconnect observer after first trigger
          if (statsObserver.value) {
            statsObserver.value.disconnect()
          }
        }
      })
    },
    {
      // Trigger when section is 300px away from viewport
      rootMargin: '300px',
      threshold: 0
    }
  )

  statsObserver.value.observe(statsSection)
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

// Get Codeforces statistics data
// Get Codeforces statistics data
async function fetchCodeforcesStats(forceRefresh = false) {
  try {
    // Check cache (5-minute validity period)
    const cacheKey = `codeforces-stats-${codeforcesUsername}`
    const cached = localStorage.getItem(cacheKey)
    
    // On first load or force refresh, always fetch fresh data
    // Otherwise, use cache if it's less than 5 minutes old
    if (!forceRefresh && !isFirstLoad.value && cached) {
      try {
        const { data, timestamp, version } = JSON.parse(cached)
        lastCodeforcesUpdate.value = timestamp
        isUsingCodeforceseFallbackData.value = false
        
        // Check both time validity and cache version
        if (Date.now() - timestamp < 5 * 60 * 1000 && version === '1.0') {
          console.log('Using cached Codeforces data')
          updateStatsWithCodeforcesData(data)
          return
        }
      } catch (error) {
        // Invalid cache format, remove it
        localStorage.removeItem(cacheKey)
        console.log('Removed invalid Codeforces cache format')
      }
    }

    console.log(forceRefresh ? 'Force refreshing Codeforces data...' : 'Fetching fresh Codeforces data...')
    
    // Fetch user info to get current rating
    const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesUsername}`)
    if (!userResponse.ok) {
      if (userResponse.status === 403 || userResponse.status === 429) {
        console.warn('Codeforces API rate limit exceeded, using cached data if available')
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            lastCodeforcesUpdate.value = timestamp
            isUsingCodeforceseFallbackData.value = false
            updateStatsWithCodeforcesData(data, true)
            return
          } catch (error) {
            console.warn('Could not parse cached Codeforces data')
          }
        }
      }
      throw new Error(`Failed to fetch Codeforces user data: ${userResponse.status}`)
    }
    const userResult = await userResponse.json()
    
    if (userResult.status !== 'OK') {
      throw new Error(`Codeforces API error: ${userResult.comment}`)
    }
    
    const userInfo = userResult.result[0]
    const currentRating = userInfo.rating || 0
    const maxRating = userInfo.maxRating || 0
    
    // Fetch user submissions to count solved problems
    const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesUsername}`)
    if (!submissionsResponse.ok) throw new Error('Failed to fetch Codeforces submissions data')
    const submissionsResult = await submissionsResponse.json()
    
    if (submissionsResult.status !== 'OK') {
      throw new Error(`Codeforces submissions API error: ${submissionsResult.comment}`)
    }
    
    // Count unique solved problems (verdict = 'OK')
    const solvedProblems = new Set()
    submissionsResult.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`
        solvedProblems.add(problemId)
      }
    })
    
    // Fetch rating history
    let ratingChanges = []
    try {
      const ratingResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesUsername}`)
      if (ratingResponse.ok) {
        const ratingResult = await ratingResponse.json()
        if (ratingResult.status === 'OK') {
          ratingChanges = ratingResult.result.map(contest => ({
            contestName: contest.contestName,
            rating: contest.newRating,
            ratingChange: contest.newRating - contest.oldRating,
            date: new Date(contest.ratingUpdateTimeSeconds * 1000)
          }))
          ratingHistory.value = ratingChanges
        }
      }
    } catch (error) {
      console.warn('Could not fetch rating history:', error)
    }
    
    const statsData = {
      solvedProblems: solvedProblems.size,
      currentRating,
      maxRating
    }
    
    // Cache data with version to ensure freshness
    const currentTimestamp = Date.now()
    const cacheData = {
      data: statsData,
      timestamp: currentTimestamp,
      version: '1.0' // Version for cache invalidation if needed
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    
    lastCodeforcesUpdate.value = currentTimestamp
    isUsingCodeforceseFallbackData.value = false

    updateStatsWithCodeforcesData(statsData)
    console.log('Codeforces data updated successfully')

  } catch (error) {
    console.error('Error fetching Codeforces stats:', error)
    // Use fallback data if API call fails
    const fallbackData = {
      solvedProblems: 0,
      currentRating: 0,
      maxRating: 0
    }
    updateStatsWithCodeforcesData(fallbackData, true)
    
    // Set fallback flag and don't set update timestamp for fallback data
    isUsingCodeforceseFallbackData.value = true
    // Only set timestamp if there's no previous valid timestamp
    if (!lastCodeforcesUpdate.value) {
      lastCodeforcesUpdate.value = null
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
    animatePyramidStatsUpdate()
  })
}

// Update statistics with Codeforces data
function updateStatsWithCodeforcesData(data, isFallback = false) {
  const { solvedProblems, currentRating, maxRating } = data
  
  stats.value = stats.value.map(stat => {
    if (stat.type === 'codeforces') {
      switch (stat.key) {
        case 'solvedProblems':
          return { ...stat, value: solvedProblems.toString() }
        case 'currentRating':
          return { ...stat, value: currentRating.toString() }
        case 'maxRating':
          return { ...stat, value: maxRating.toString() }
        default:
          return stat
      }
    }
    return stat
  })

  // Add animation effects
  nextTick(() => {
    animateStatsUpdate()
    animatePyramidStatsUpdate()
  })
}

// Pyramid statistics data update animation - optimized for performance
function animatePyramidStatsUpdate() {
  const pyramidItems = document.querySelectorAll('.pyramid-stat .stat-value')
  if (pyramidItems.length === 0) return
  
  // Use batch processing to reduce reflow/repaint
  gsap.set(pyramidItems, { 
    willChange: 'transform, opacity',
    force3D: true 
  })
  
  // Create a single timeline for better performance
  const tl = gsap.timeline({
    onComplete: () => {
      // Reset will-change to auto after animation
      gsap.set(pyramidItems, { willChange: 'auto' })
    }
  })
  
  pyramidItems.forEach((item, index) => {
    tl.fromTo(item, {
      scale: 1,
      opacity: 1
    }, {
      scale: 1.15, // Reduced scale change to minimize reflow
      opacity: 0.95,
      duration: 0.25, // Shorter duration for snappier feel
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      force3D: true
    }, index * 0.03) // Reduced delay for faster completion
  })
}

// Statistics data update animation - optimized for performance
function animateStatsUpdate() {
  const statItems = document.querySelectorAll('.stat-value')
  if (statItems.length === 0) return
  
  // Use batch processing to reduce reflow/repaint
  gsap.set(statItems, { 
    willChange: 'transform, opacity',
    force3D: true 
  })
  
  // Create a single timeline for better performance
  const tl = gsap.timeline({
    onComplete: () => {
      // Reset will-change to auto after animation
      gsap.set(statItems, { willChange: 'auto' })
    }
  })
  
  statItems.forEach((item, index) => {
    tl.fromTo(item, {
      scale: 1,
      opacity: 1
    }, {
      scale: 1.1, // Reduced scale change to minimize reflow
      opacity: 0.9,
      duration: 0.2, // Shorter duration for snappier feel
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      force3D: true
    }, index * 0.05) // Reduced stagger for faster completion
  })
}

function animateSkills() {
  const tl = gsap.timeline()

  // Initialize all skill tags to invisible state with hardware acceleration
  gsap.set('.skill-tag', {
    opacity: 0,
    x: 300, // Reduced from 400
    scale: 0.3, // Reduced from 0.2
    rotation: 25, // Reduced from 35
    skewX: 15, // Reduced from 20
    transformOrigin: 'center center',
    force3D: true,
    willChange: 'transform'
  })

  // Prepare container for vibration effects
  gsap.set('.skills-container', {
    transformOrigin: 'left center',
    force3D: true
  })

  // Create optimized collision animation
  skills.value.forEach((skill, index) => {
    // Stage 1: Optimized high-speed impact
    tl.to(`.skill-tag:nth-child(${index + 1})`, {
      opacity: 1,
      x: -8, // Reduced overshoot
      scale: 1.2, // Reduced scale
      rotation: -3,
      skewX: -1.5,
      duration: 0.18, // Slightly faster
      ease: 'power4.out',
      delay: index * 0.15 + 0.25, // Reduced intervals and initial delay
      force3D: true
    })

      // Stage 2: Optimized vibration rebound
      .to(`.skill-tag:nth-child(${index + 1})`, {
        x: 1.5, // Smaller rebound
        scale: 0.99,
        rotation: 0.3,
        duration: 0.12, // Faster vibration
        ease: 'power2.inOut',
        force3D: true,
        onStart: function () {
          // Optimized vibration effect
          gsap.to('.skills-container', {
            x: index % 2 === 0 ? 2 : -2, // Reduced intensity
            duration: 0.015,
            repeat: 1, // Fewer repeats
            yoyo: true,
            ease: 'power2.inOut',
            force3D: true
          })

          // Optimized shockwave effect
          gsap.fromTo(`.skill-tag:nth-child(${index + 1})`, {
            boxShadow: '0 0 0 0 rgba(0, 140, 255, 1), 0 0 0 0 rgba(255, 77, 109, 0.8)'
          }, {
            boxShadow: '0 0 0 20px rgba(0, 140, 255, 0), 0 0 0 30px rgba(255, 77, 109, 0)', // Reduced range
            duration: 0.3, // Faster duration
            ease: 'power2.out'
          })
        }
      })

      // Stage 3: Optimized stabilization
      .to(`.skill-tag:nth-child(${index + 1})`, {
        x: 0,
        scale: 1,
        rotation: 0,
        skewX: 0,
        duration: 0.2, // Faster stabilization
        ease: 'elastic.out(1.3, 0.5)', // Less bouncy
        force3D: true,
        onComplete: function () {
          // Restore container position immediately
          gsap.set('.skills-container', { x: 0 })
        }
      }, '-=0.04')

      // Stage 4: Optimized bounce
      .to(`.skill-tag:nth-child(${index + 1})`, {
        y: -3, // Reduced bounce height
        duration: 0.08,
        ease: 'power2.out',
        force3D: true
      }, '-=0.15')

      .to(`.skill-tag:nth-child(${index + 1})`, {
        y: 0,
        duration: 0.12,
        ease: 'bounce.out',
        force3D: true,
        onComplete: function () {
          // Add optimized particle explosion effect
          createOptimizedParticles(`.skill-tag:nth-child(${index + 1})`)
          // Reset will-change after animation
          gsap.set(`.skill-tag:nth-child(${index + 1})`, { willChange: 'auto' })
        }
      })
  })
  
  // Reset container will-change after all animations
  tl.set('.skills-container', { willChange: 'auto' })
}

// Create optimized particle explosion effect
function createOptimizedParticles(selector) {
  const element = document.querySelector(selector)
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Create fewer particles for better performance
  const particleCount = 4 // Optimized: Reduced from 6 to 4 (33% reduction)
  const fragment = document.createDocumentFragment()
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'collision-particle'

    // Optimized particle size
    const size = 3 + Math.random() * 3 // Smaller particles (3-6px)
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
      box-shadow: 0 0 ${size * 1.5}px ${color};
      will-change: transform;
    `

    fragment.appendChild(particle)
  }
  
  // Batch append all particles
  document.body.appendChild(fragment)
  
  // Animate all particles with optimized settings
  const particles = document.querySelectorAll('.collision-particle')
  particles.forEach((particle, i) => {
    // Smaller explosion pattern
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
    const distance = 25 + Math.random() * 25 // Smaller explosion radius
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance

    gsap.set(particle, { force3D: true }) // Enable hardware acceleration

    // Optimized particle animation
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0,
      opacity: 0,
      rotation: 180 + Math.random() * 180, // Less rotation variation
      duration: 0.3 + Math.random() * 0.1, // Faster and more consistent duration
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle)
        }
      }
    })
  })
}

function typeNextRole() {
  const role = roles.value[currentRoleIndex.value]
  let charIndex = 0

  // Clear any existing interval
  if (typingInterval) {
    clearInterval(typingInterval)
  }

  typingInterval = setInterval(() => {
    if (charIndex < role.length) {
      typedText.value += role[charIndex]
      charIndex++
    } else {
      clearInterval(typingInterval)
      typingInterval = null
      typingTimeout = setTimeout(() => {
        eraseRole()
      }, 2000)
    }
  }, 100)
}

function eraseRole() {
  // Clear any existing interval
  if (typingInterval) {
    clearInterval(typingInterval)
  }

  typingInterval = setInterval(() => {
    if (typedText.value.length > 0) {
      typedText.value = typedText.value.slice(0, -1)
    } else {
      clearInterval(typingInterval)
      typingInterval = null
      currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.value.length
      typingTimeout = setTimeout(() => {
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

// Calculate Codeforces update time
const codeforcesTimeAgoText = computed(() => {
  if (isUsingCodeforceseFallbackData.value) {
    return 'using offline data'
  }
  
  if (!lastCodeforcesUpdate.value) return ''
  
  const now = Date.now()
  const diff = now - lastCodeforcesUpdate.value
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
})

// Combined update status for display
const combinedUpdateText = computed(() => {
  const githubFallback = isUsingFallbackData.value
  const codeforcesFallback = isUsingCodeforceseFallbackData.value
  
  if (githubFallback && codeforcesFallback) {
    return 'Data using offline cache'
  }
  
  if (githubFallback) {
    return `GitHub offline, CF updated ${codeforcesTimeAgoText.value}`
  }
  
  if (codeforcesFallback) {
    return `GitHub updated ${timeAgoText.value}, CF offline`
  }
  
  // Both services are online - show the most recent update
  if (!lastGitHubUpdate.value && !lastCodeforcesUpdate.value) {
    return 'Loading...'
  }
  
  if (!lastGitHubUpdate.value) {
    return `Codeforces updated ${codeforcesTimeAgoText.value}`
  }
  
  if (!lastCodeforcesUpdate.value) {
    return `GitHub updated ${timeAgoText.value}`
  }
  
  // Both have timestamps - show the most recent
  const githubTime = lastGitHubUpdate.value
  const codeforcesTime = lastCodeforcesUpdate.value
  
  if (Math.abs(githubTime - codeforcesTime) < 30000) { // Within 30 seconds
    return `Data updated ${timeAgoText.value}`
  } else if (githubTime > codeforcesTime) {
    return `GitHub updated ${timeAgoText.value}`
  } else {
    return `Codeforces updated ${codeforcesTimeAgoText.value}`
  }
})

// Pyramid Animation Setup and Functions
function setupPyramidAnimation() {
  // Set initial positions for side stats (visible on screen from start)
  gsap.set('#leftStat', {
    x: -180, // Position on screen but to the left
    opacity: 1, // Fully visible
    scale: 1,
    rotation: 0,
    force3D: true
  })
  
  gsap.set('#rightStat', {
    x: 180, // Position on screen but to the right
    opacity: 1, // Fully visible
    scale: 1,
    rotation: 0,
    force3D: true
  })
  
  // Set pyramid stats to visible and in position
  gsap.set('.pyramid-stat', {
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
    opacity: 1,
    force3D: true
  })
  
  // Set initial state for final grid
  gsap.set('#finalGrid', {
    opacity: 0,
    force3D: true
  })
  
  // Setup scroll trigger for the animation (triggers when user scrolls to section)
  ScrollTrigger.create({
    trigger: '#statisticsSection',
    start: 'top 60%', // Start when section is 60% visible (was 80%)
    end: 'bottom 20%',
    onEnter: () => {
      showSideStatsAndTrigger()
    },
    onLeave: () => {
      // Reset when leaving the section
      resetPyramidAnimation()
    },
    onEnterBack: () => {
      // Trigger animation when scrolling back up
      showSideStatsAndTrigger()
    }
  })
}

function showSideStatsAndTrigger() {
  // Reset to ensure clean state
  resetPyramidAnimation()
  
  // Wait for user to fully see the section before starting animation
  setTimeout(() => {
    triggerPyramidAnimation()
  }, 800) // Increased delay for better user experience
}

function resetPyramidAnimation() {
  // Stop any ongoing animations efficiently
  gsap.killTweensOf(['#leftStat', '#rightStat', '.pyramid-stat', '.grid-stat-item', '#pyramidContainer', '#finalGrid'])
  
  // Batch reset all elements to initial state with hardware acceleration
  const resetElements = [
    { selector: '#leftStat', props: { x: -180, opacity: 1, scale: 1, rotation: 0, y: 0, force3D: true, willChange: 'auto' } },
    { selector: '#rightStat', props: { x: 180, opacity: 1, scale: 1, rotation: 0, y: 0, force3D: true, willChange: 'auto' } },
    { selector: '.pyramid-stat', props: { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, force3D: true, willChange: 'auto' } },
    { selector: '.grid-stat-item', props: { scale: 0.95, opacity: 0, y: 15, force3D: true, willChange: 'auto' } },
    { selector: '#finalGrid', props: { opacity: 0, force3D: true, willChange: 'auto' } },
    { selector: '#pyramidContainer', props: { x: 0, force3D: true, willChange: 'auto' } }
  ]
  
  // Apply all resets in batch for better performance
  resetElements.forEach(({ selector, props }) => {
    gsap.set(selector, props)
  })
}

function triggerPyramidAnimation() {
  // Optimized collision animation with performance improvements
  const tl = gsap.timeline()
  
  // Enable hardware acceleration for all animated elements
  gsap.set(['#leftStat', '#rightStat', '.pyramid-stat', '.grid-stat-item', '#pyramidContainer', '#finalGrid'], {
    force3D: true,
    willChange: 'transform'
  })
  
  // Phase 1: Side stats move toward center for collision (optimized)
  tl.to('#leftStat', {
    x: -100,
    y: -15,
    scale: 1.2, // Reduced scale for better performance
    rotation: -8,
    duration: 0.8, // Slightly faster
    ease: 'power2.inOut',
    force3D: true
  })
  .to('#rightStat', {
    x: 100,
    y: -15,
    scale: 1.2, // Reduced scale for better performance
    rotation: 8,
    duration: 0.8,
    ease: 'power2.inOut',
    force3D: true
  }, '-=0.8')
  
  // Phase 2: Brief pause before final collision
  .to({}, { duration: 0.15 }) // Shorter pause
  
  // Phase 3: Final collision approach (optimized)
  .to('#leftStat', {
    x: -40,
    y: 0,
    scale: 1.3, // Reduced scale
    rotation: -15,
    duration: 0.25, // Faster
    ease: 'power3.inOut',
    force3D: true
  })
  .to('#rightStat', {
    x: 40,
    y: 0,
    scale: 1.3, // Reduced scale
    rotation: 15,
    duration: 0.25, // Faster
    ease: 'power3.inOut',
    force3D: true
  }, '-=0.25')
  
  // Phase 4: Impact moment with optimized effects
  .to('#leftStat', {
    x: -10,
    scale: 1.4, // Reduced scale
    rotation: -20,
    duration: 0.12, // Faster
    ease: 'power4.out',
    force3D: true,
    onComplete: () => createOptimizedImpactExplosion('left')
  })
  .to('#rightStat', {
    x: 10,
    scale: 1.4, // Reduced scale
    rotation: 20,
    duration: 0.12, // Faster
    ease: 'power4.out',
    force3D: true,
    onComplete: () => createOptimizedImpactExplosion('right')
  }, '-=0.12')
  
  // Phase 5: Optimized screen shake
  .to('#pyramidContainer', {
    x: 4, // Reduced shake intensity
    duration: 0.03,
    repeat: 3, // Fewer repeats
    yoyo: true,
    ease: 'none',
    force3D: true
  }, '-=0.08')
  
  // Phase 6: Optimized pyramid stats scattering
  .to('.pyramid-stat', {
    x: () => (Math.random() - 0.5) * 300, // Reduced range
    y: () => (Math.random() - 0.5) * 200,
    rotation: () => (Math.random() - 0.5) * 120, // Reduced rotation
    scale: () => 0.6 + Math.random() * 0.2, // Less scale variation
    opacity: 0,
    duration: 0.8, // Faster
    ease: 'power2.out',
    force3D: true,
    stagger: {
      amount: 0.1, // Faster stagger
      from: 'random'
    }
  }, '-=0.05')
  
  // Phase 7: Optimized side stats scatter
  .to(['#leftStat', '#rightStat'], {
    x: () => (Math.random() - 0.5) * 200, // Reduced range
    y: () => (Math.random() - 0.5) * 150,
    rotation: () => (Math.random() - 0.5) * 80, // Reduced rotation
    scale: 0.5, // Fixed scale for consistency
    opacity: 0,
    duration: 0.6, // Faster
    ease: 'power2.out',
    force3D: true
  }, '-=0.5')
  
  // Phase 8: Show final grid
  .to('#finalGrid', {
    opacity: 1,
    duration: 0.3, // Faster
    ease: 'power2.out',
    force3D: true,
    delay: 0.05 // Shorter delay
  })
  
  // Phase 9: Optimized grid items appear
  .fromTo('.grid-stat-item', {
    opacity: 0,
    scale: 0.95, // Less scale change
    y: 15 // Reduced movement
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.4, // Faster
    ease: 'back.out(1.1)', // Less bouncy
    force3D: true,
    stagger: {
      amount: 0.2, // Faster stagger
      from: 'center'
    }
  }, '-=0.1')
  
  // Phase 10: Clean up and restore container position
  .set('#pyramidContainer', { x: 0, force3D: true })
  .set(['#leftStat', '#rightStat', '.pyramid-stat', '.grid-stat-item', '#pyramidContainer', '#finalGrid'], {
    willChange: 'auto' // Reset will-change to save memory
  })
}

function createOptimizedImpactExplosion(side) {
  const container = document.querySelector('#pyramidContainer')
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  
  // Create fewer but more visible particles for better performance
  const particleCount = 5 // Optimized: Reduced from 8 to 5 (38% reduction)
  const fragment = document.createDocumentFragment() // Use fragment for batch DOM operations
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'impact-particle'
    
    const size = 5 + Math.random() * 4 // Slightly smaller particles (5-9px)
    const colors = [
      'rgba(0, 140, 255, 0.9)',
      'rgba(255, 77, 109, 0.9)',
      'rgba(0, 255, 136, 0.8)',
      'rgba(255, 255, 255, 0.9)'
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    // Position explosion at collision point
    const explosionX = side === 'left' ? rect.left + 120 : rect.right - 120
    const explosionY = rect.top + rect.height / 2
    
    particle.style.cssText = `
      position: fixed;
      left: ${explosionX}px;
      top: ${explosionY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      box-shadow: 0 0 ${size * 2}px ${color};
      will-change: transform;
    `
    
    fragment.appendChild(particle)
  }
  
  // Batch append all particles
  document.body.appendChild(fragment)
  
  // Animate all particles at once with optimized settings
  const particles = document.querySelectorAll('.impact-particle')
  particles.forEach((particle, i) => {
    // Smaller explosion pattern for better performance
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const distance = 50 + Math.random() * 60 // Smaller explosion radius
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance
    
    gsap.set(particle, { force3D: true }) // Enable hardware acceleration
    
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0,
      opacity: 0,
      rotation: 90 + Math.random() * 90, // Less rotation
      duration: 0.6, // Faster duration
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle)
        }
      }
    })
  })
}

// Snowflake Animation Setup and Functions
function setupVortexAnimation() {
  // Create gentle snowflake particles
  createSnowflakeParticles()
  
  // Start the continuous snowfall animation
  startSnowflakeAnimation()
}

function createSnowflakeParticles() {
  const heroSection = document.querySelector('.hero-section')
  if (!heroSection) return

  // Don't create snowflakes if user prefers reduced motion
  if (prefersReducedMotion.value) return

  // Create container for snowflake particles
  const snowflakeContainer = document.createElement('div')
  snowflakeContainer.className = 'snowflake-container'
  snowflakeContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  `
  heroSection.appendChild(snowflakeContainer)

  // Define subtle snowflake colors (cool tones, very light)
  const snowflakeColors = [
    '#E8F4FD', '#F0F8FF', '#E6F3FF', '#F5FBFF', '#EBF7FF'
  ]

  // Define different snowflake shapes using Unicode snowflake characters
  const snowflakeShapes = ['❅', '❆', '❄', '⋄', '◊']

  // Adaptive particle count based on device performance
  let snowflakeCount = 6 // Default for high performance
  if (devicePerformance.value === 'medium') {
    snowflakeCount = 4
  } else if (devicePerformance.value === 'low') {
    snowflakeCount = 2
  }

  // Create optimized number of snowflakes
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div')
    const color = snowflakeColors[i % snowflakeColors.length]
    const shape = snowflakeShapes[i % snowflakeShapes.length]

    snowflake.className = 'snowflake-particle'

    const size = 10 + Math.random() * 6 // Reduced to 10-16px snowflakes
    const initialX = Math.random() * heroSection.offsetWidth
    const initialY = -20 - Math.random() * 100

    snowflake.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      color: ${color};
      font-size: ${size}px;
      line-height: 1;
      opacity: 0.12; /* Slightly reduced opacity */
      will-change: transform;
      user-select: none;
      pointer-events: none;
      text-shadow: 0 0 2px rgba(255, 255, 255, 0.2);
      filter: drop-shadow(0 0 1px rgba(0, 140, 255, 0.15));
    `
    snowflake.textContent = shape

    gsap.set(snowflake, {
      x: initialX,
      y: initialY,
      rotation: Math.random() * 360,
      force3D: true
    })

    fragment.appendChild(snowflake)
  }

  // Batch append all snowflakes
  snowflakeContainer.appendChild(fragment)
}

function startSnowflakeAnimation() {
  const snowflakes = document.querySelectorAll('.snowflake-particle')
  if (snowflakes.length === 0) return

  const heroSection = document.querySelector('.hero-section')
  const sectionHeight = heroSection.offsetHeight
  const sectionWidth = heroSection.offsetWidth

  snowflakes.forEach((snowflake, index) => {
    // Optimize snowflake falling animation
    const fallDuration = 12 + Math.random() * 6 // 12-18 seconds, more consistent
    const horizontalDrift = 30 + Math.random() * 40 // Reduced drift (30-70px)
    const rotationAmount = 120 + Math.random() * 240 // Moderate rotation
    const driftDirection = Math.random() > 0.5 ? 1 : -1
    
    // Create optimized falling animation
    function animateSnowflake() {
      const startX = Math.random() * sectionWidth
      const endX = startX + (horizontalDrift * driftDirection)
      const startY = -20 - Math.random() * 50
      const endY = sectionHeight + 50
      
      // Reset position with batch processing
      gsap.set(snowflake, {
        x: startX,
        y: startY,
        rotation: Math.random() * 360,
        opacity: 0.06 + Math.random() * 0.08, // Reduced opacity range (0.06-0.14)
        force3D: true
      })
      
      // Animate falling with optimized settings
      gsap.to(snowflake, {
        x: endX,
        y: endY,
        rotation: `+=${rotationAmount}`,
        duration: fallDuration,
        ease: 'none',
        force3D: true,
        onComplete: () => {
          // Restart with random delay
          setTimeout(() => animateSnowflake(), Math.random() * 800)
        }
      })
      
      // Simplified horizontal swaying with less intensity
      gsap.to(snowflake, {
        x: `+=${Math.sin(index) * 20}`, // Reduced sway amplitude
        duration: 8 + Math.random() * 4, // Slightly slower sway (8-12s)
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        force3D: true
      })
    }
    
    // Start animation with optimized staggered delay
    setTimeout(() => animateSnowflake(), index * 150 + Math.random() * 600)
  })
}

// Avatar tilt effect based on mouse position
function setupAvatarTiltEffect() {
  const avatarContainerEl = document.querySelector('.avatar-container')
  if (!avatarContainerEl) return

  avatarContainerEl.addEventListener('mouseenter', () => {
    avatarContainerEl.style.cursor = 'pointer'
  })

  avatarContainerEl.addEventListener('mousemove', (e) => {
    const rect = avatarContainerEl.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Calculate mouse position relative to center
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    // Calculate tilt angles (max 15 degrees)
    const maxTilt = 15
    const tiltX = -(mouseY / (rect.height / 2)) * maxTilt
    const tiltY = (mouseX / (rect.width / 2)) * maxTilt
    
    // Apply 3D transform to avatar
    avatarTilt.value = { x: tiltX, y: tiltY }
    
    const avatar = avatarContainerEl.querySelector('.avatar')
    if (avatar) {
      gsap.to(avatar, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
    
    // Also apply slight tilt to satellite system for more immersion
    const satelliteSystem = avatarContainerEl.querySelector('.satellite-system')
    if (satelliteSystem) {
      gsap.to(satelliteSystem, {
        rotationX: tiltX * 0.3,
        rotationY: tiltY * 0.3,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  })

  avatarContainerEl.addEventListener('mouseleave', () => {
    // Reset tilt when mouse leaves
    avatarTilt.value = { x: 0, y: 0 }
    
    const avatar = avatarContainerEl.querySelector('.avatar')
    const satelliteSystem = avatarContainerEl.querySelector('.satellite-system')
    
    if (avatar) {
      gsap.to(avatar, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
    
    if (satelliteSystem) {
      gsap.to(satelliteSystem, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
    }
  })
}

// Star effect for clicking satellite icons
const createStarEffect = (event, techName) => {
  const clickX = event.clientX
  const clickY = event.clientY
  
  // Create multiple stars with different colors based on tech
  const techColors = {
    'PyTorch': ['#FF6B35', '#FF8E53', '#FFAD71'],
    'Python': ['#3776AB', '#4B8BBE', '#306998'],
    'Vue.js': ['#4FC08D', '#42B883', '#35495E'],
    'VS Code': ['#007ACC', '#1E90FF', '#4169E1'],
    'TypeScript': ['#3178C6', '#007ACC', '#2B7CD6']
  }
  
  const colors = techColors[techName] || ['#FFD700', '#FFA500', '#FF6347']

  // Optimized: Create 5-8 stars (reduced from 8-12)
  const starCount = 5 + Math.random() * 3
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div')
    star.className = 'star-particle'
    
    const size = 4 + Math.random() * 8 // 4-12px stars
    const color = colors[Math.floor(Math.random() * colors.length)]
    
    // Different star shapes
    const starShapes = ['⭐', '✨', '💫', '🌟', '⭐', '✦', '✧', '★']
    const shape = starShapes[Math.floor(Math.random() * starShapes.length)]
    
    star.style.cssText = `
      position: fixed;
      left: ${clickX}px;
      top: ${clickY}px;
      font-size: ${size}px;
      color: ${color};
      pointer-events: none;
      z-index: 9999;
      filter: drop-shadow(0 0 3px ${color});
      text-shadow: 0 0 6px ${color};
    `
    star.textContent = shape
    
    document.body.appendChild(star)
    
    // Animate stars outward in a burst pattern
    const angle = (i / starCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const distance = 60 + Math.random() * 80 // 60-140px spread
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance
    
    gsap.to(star, {
      x: endX,
      y: endY,
      scale: 0.2,
      opacity: 0,
      rotation: 180 + Math.random() * 180,
      duration: 0.8 + Math.random() * 0.4,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        if (document.body.contains(star)) {
          document.body.removeChild(star)
        }
      }
    })
  }
  
  // Add a ripple effect on the clicked icon
  const target = event.target.closest('.satellite')
  if (target) {
    gsap.to(target, {
      scale: 1.3,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }
  
  // Optional: play a sound effect (if you have audio files)
  // const audio = new Audio('/sounds/star-click.mp3')
  // audio.volume = 0.3
  // audio.play().catch(() => {}) // Ignore audio errors
}
</script>

<template>
  <div class="landing-container">
    <VueLenis ref="lenisRef" :options="lenisOptions" root>
      <div class="homepage">
        <!-- First section: Introduction and skills -->
        <section class="hero-section">
      <div class="hero-content">
        <n-grid :cols="24" :x-gap="24" style="align-items: center;">
          <n-gi :span="8">
            <n-flex :justify="'start'">
              <div class="avatar-container" ref="avatarContainer">
                <n-avatar
                  :size="289"
                  :src="`/website/images/landingAvatar.jpg`"
                  round
                  class="avatar"
                  loading="lazy"
                  decoding="async"
                  :img-props="{ loading: 'lazy', decoding: 'async' }"
                />
                
                <!-- Satellite orbit system -->
                <div class="satellite-system">
                  <!-- PyTorch - 图标1: 最慢 11°/s, 最大轨道 520px, 0° -->
                  <div class="satellite-orbit orbit-1">
                    <div class="satellite satellite-1" @click="createStarEffect($event, 'PyTorch')">
                      <img src="https://api.iconify.design/logos/pytorch-icon.svg" :alt="'PyTorch'" class="tech-icon pytorch-icon" width="48" height="48" />
                    </div>
                  </div>
                  
                  <!-- Python - 图标2: 17°/s, 460px, 65° -->
                  <div class="satellite-orbit orbit-2">
                    <div class="satellite satellite-2" @click="createStarEffect($event, 'Python')">
                      <img src="https://api.iconify.design/logos/python.svg" :alt="'Python'" class="tech-icon python-icon" width="40" height="40" />
                    </div>
                  </div>
                  
                  <!-- Vue.js - 图标3: 23°/s, 400px, 150° -->
                  <div class="satellite-orbit orbit-3">
                    <div class="satellite satellite-3" @click="createStarEffect($event, 'Vue.js')">
                      <img src="https://api.iconify.design/logos/vue.svg" :alt="'Vue.js'" class="tech-icon vue-icon" width="32" height="32" />
                    </div>
                  </div>
                  
                  <!-- VS Code - 图标4: 29°/s, 340px, 225° -->
                  <div class="satellite-orbit orbit-4">
                    <div class="satellite satellite-4" @click="createStarEffect($event, 'VS Code')">
                      <img src="https://api.iconify.design/logos/visual-studio-code.svg" :alt="'VS Code'" class="tech-icon vscode-icon" width="26" height="26" />
                    </div>
                  </div>
                  
                  <!-- TypeScript - 图标5: 最快 37°/s, 最小轨道 280px, 310° -->
                  <div class="satellite-orbit orbit-5">
                    <div class="satellite satellite-5" @click="createStarEffect($event, 'TypeScript')">
                      <img src="https://api.iconify.design/logos/typescript-icon.svg" :alt="'TypeScript'" class="tech-icon typescript-icon" width="22" height="22" />
                    </div>
                  </div>
                </div>
              </div>
            </n-flex>
          </n-gi>
          <n-gi :span="16">
            <div class="intro">
              <h1 class="name" :style="gradientStyle">Hello, I'm Xinghan Pan!</h1>
              <div class="role-container">
                <span class="role">I'm a </span>
                <span class="typed-role">{{ typedText }}<span class="cursor"
                    :class="{ 'cursor-visible': showCursor }"></span></span>
              </div>
              <p class="description" style="font-weight: bold;">
                Building the future through code at SCIE. As a CS innovator
                passionate about AI research, I transform complex challenges into breakthrough solutions. My
                mission is creating technology that changes the world, one algorithm at a time.
              </p>
              <div class="skills-container">
                <n-tag v-for="(skill, index) in skills" :key="skill.name" :type="skill.type" class="skill-tag"
                  :data-index="index">
                  <template #icon>
                    <n-icon :component="ChevronRight" />
                  </template>
                  {{ skill.name }}
                </n-tag>
              </div>
            </div>
          </n-gi>
        </n-grid>
        
      </div>
    </section>

    <!-- Statistics Pyramid Section -->
    <section class="pyramid-section" id="statisticsSection">
      <div class="pyramid-container" id="pyramidContainer">

        <!-- Static side stats (colliders) -->
        <div class="side-stat left-stat" id="leftStat">
          <div class="stat-icon">🚀</div>
          <div class="stat-value">2017</div>
          <div class="stat-label">Started Coding</div>
        </div>

        <div class="side-stat right-stat" id="rightStat">
          <div class="stat-icon">💻</div>
          <div class="stat-value">8+</div>
          <div class="stat-label">Years of Coding</div>
        </div>

        <!-- Pyramid formation (10 stats in 1-2-3-4 formation) -->
        <div class="pyramid-formation" id="pyramidFormation">
          <!-- Row 1 (1 item) -->
          <div class="pyramid-row row-1">
            <div class="pyramid-stat" 
                 :data-type="pyramidStats[0].type" 
                 :data-key="pyramidStats[0].key"
                 :class="{ 'loading': pyramidStats[0].value === '...' }">
              <div class="stat-icon">{{ pyramidStats[0].icon }}</div>
              <div class="stat-value" :class="{ 'shimmer': pyramidStats[0].value === '...' }">
                {{ pyramidStats[0].value === '...' ? '—' : pyramidStats[0].value }}
              </div>
              <div class="stat-label">{{ pyramidStats[0].label }}</div>
              <n-tooltip v-if="pyramidStats[0].type === 'github'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="github-icon">🐙</span>
                    <span class="badge-text">Live</span>
                  </div>
                </template>
                Live data from GitHub API
              </n-tooltip>
              <n-tooltip v-if="pyramidStats[0].type === 'codeforces'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="cf-icon">🏆</span>
                    <span class="badge-text">CF</span>
                  </div>
                </template>
                Live data from Codeforces API
              </n-tooltip>
            </div>
          </div>

          <!-- Row 2 (2 items) -->
          <div class="pyramid-row row-2">
            <div v-for="(stat, index) in pyramidStats.slice(1, 3)" 
                 :key="stat.label" 
                 class="pyramid-stat"
                 :data-type="stat.type" 
                 :data-key="stat.key"
                 :class="{ 'loading': stat.value === '...' }">
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
              <n-tooltip v-if="stat.type === 'codeforces'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="cf-icon">🏆</span>
                    <span class="badge-text">CF</span>
                  </div>
                </template>
                Live data from Codeforces API
              </n-tooltip>
            </div>
          </div>

          <!-- Row 3 (3 items) -->
          <div class="pyramid-row row-3">
            <div v-for="(stat, index) in pyramidStats.slice(3, 6)" 
                 :key="stat.label" 
                 class="pyramid-stat"
                 :data-type="stat.type" 
                 :data-key="stat.key"
                 :class="{ 'loading': stat.value === '...' }">
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
              <n-tooltip v-if="stat.type === 'codeforces'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="cf-icon">🏆</span>
                    <span class="badge-text">CF</span>
                  </div>
                </template>
                Live data from Codeforces API
              </n-tooltip>
            </div>
          </div>

          <!-- Row 4 (4 items) -->
          <div class="pyramid-row row-4">
            <div v-for="(stat, index) in pyramidStats.slice(6, 10)" 
                 :key="stat.label" 
                 class="pyramid-stat"
                 :data-type="stat.type" 
                 :data-key="stat.key"
                 :class="{ 'loading': stat.value === '...' }">
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
              <n-tooltip v-if="stat.type === 'codeforces'" trigger="hover" placement="top">
                <template #trigger>
                  <div class="stat-badge">
                    <span class="cf-icon">🏆</span>
                    <span class="badge-text">CF</span>
                  </div>
                </template>
                Live data from Codeforces API
              </n-tooltip>
            </div>
          </div>
        </div>

        <!-- Final grid layout for scattered stats -->
        <div class="final-grid" id="finalGrid" style="opacity: 0;">
          <div v-for="(stat, index) in allStatsForGrid" 
               :key="stat.label" 
               class="grid-stat-item"
               :class="{ 'loading': stat.value === '...' }">
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
            <n-tooltip v-if="stat.type === 'codeforces'" trigger="hover" placement="top">
              <template #trigger>
                <div class="stat-badge">
                  <span class="cf-icon">🏆</span>
                  <span class="badge-text">CF</span>
                </div>
              </template>
              Live data from Codeforces API
            </n-tooltip>
          </div>
        </div>
      </div>
      
      <!-- Update info positioned at bottom -->
      <div class="stats-footer" v-if="lastGitHubUpdate || lastCodeforcesUpdate || isUsingFallbackData || isUsingCodeforceseFallbackData">
        <div class="update-info" :class="{ 
          'fallback-data': isUsingFallbackData || isUsingCodeforceseFallbackData,
          'partial-fallback': (isUsingFallbackData && !isUsingCodeforceseFallbackData) || (!isUsingFallbackData && isUsingCodeforceseFallbackData)
        }">
          <span class="update-icon">{{ 
            (isUsingFallbackData && isUsingCodeforceseFallbackData) ? '⚠️' : 
            (isUsingFallbackData || isUsingCodeforceseFallbackData) ? '⚠️' : '🔄' 
          }}</span>
          <span class="update-text">{{ combinedUpdateText }}</span>
        </div>
      </div>
    </section>

    <!-- Subsequent content areas -->
    <div class="content-sections">
      <!-- Use Suspense for lazy-loaded components -->
      <Suspense>
        <template #default>
          <Awards />
        </template>
        <template #fallback>
          <div class="section-loading">
            <n-spin size="medium" />
          </div>
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <ArticleResearch />
        </template>
        <template #fallback>
          <div class="section-loading">
            <n-spin size="medium" />
          </div>
        </template>
      </Suspense>

      <Suspense>
        <template #default>
          <TechStack />
        </template>
        <template #fallback>
          <div class="section-loading">
            <n-spin size="medium" />
          </div>
        </template>
      </Suspense>
    </div>
    </div>
  </VueLenis>
  </div>
</template>

<style scoped>
/* Wrapper container for transition compatibility */
.landing-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.homepage {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* First section styles - reduced height */
.hero-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0 24px 24px;
  padding-left: 0 24px 24px;
  padding-right: 0 24px 24px;
  max-width: 85vw;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 32px;
}

/* Subsequent content areas */
.content-sections {
  max-width: 85vw;
  margin: 0 auto;
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 24px;
}

/* Ensure each section takes full viewport height - but don't force display */
.content-sections > * {
  min-height: 100vh;
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
  width: 3px;
  height: 1.2em;
  background-color: #008CFF;
  vertical-align: text-bottom;
  margin-left: 2px;
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

.update-info.partial-fallback {
  background: v-bind("isDarkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.05)'");
  border-color: v-bind("isDarkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)'");
  color: v-bind("isDarkMode ? '#FFC947' : '#B8860B'");
}

.update-icon {
  font-size: 10px;
  opacity: 0.8;
}

.update-text {
  font-size: 11px;
}

/* Pyramid Section Styles */
.pyramid-section {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  margin: 0;
  position: relative;
  box-sizing: border-box;
  overflow: hidden; /* Prevent horizontal scrolling from off-screen elements */
}

.pyramid-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  will-change: transform; /* Optimize for animations */
  backface-visibility: hidden; /* Improve performance */
}

/* Stats footer positioning */
.stats-footer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.pyramid-formation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 40px 0;
}

.pyramid-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  align-items: center;
}

/* Final Grid Layout */
.final-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 900px;
  padding: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid-stat-item {
  text-align: center;
  padding: 20px 16px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'");
  border-radius: 16px;
  border: 2px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'");
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 
    0 4px 15px rgba(0, 140, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  will-change: transform, opacity; /* Optimize for animation */
  backface-visibility: hidden; /* Improve performance */
}

.grid-stat-item:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 
    0 8px 30px rgba(0, 140, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 140, 255, 0.4);
}

.grid-stat-item.loading {
  border-color: rgba(0, 140, 255, 0.3);
  background: v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.1)' : 'rgba(0, 140, 255, 0.05)'");
}

.grid-stat-item .stat-icon {
  font-size: 24px;
  margin-bottom: 12px;
}

.grid-stat-item .stat-value {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
  line-height: 1.2;
}

.grid-stat-item .stat-label {
  font-size: 12px;
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
}

.pyramid-stat {
  text-align: center;
  padding: 12px 8px;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'");
  border-radius: 12px;
  border: 2px solid v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'");
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-width: 90px;
  box-shadow: 
    0 4px 15px rgba(0, 140, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  will-change: transform, opacity; /* Optimize for animation */
  backface-visibility: hidden; /* Improve performance */
}

.pyramid-stat:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 8px 30px rgba(0, 140, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(0, 140, 255, 0.4);
}

.pyramid-stat.loading {
  border-color: rgba(0, 140, 255, 0.3);
  background: v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.1)' : 'rgba(0, 140, 255, 0.05)'");
}

.pyramid-stat .stat-icon {
  font-size: 18px;
  margin-bottom: 6px;
}

.pyramid-stat .stat-value {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.pyramid-stat .stat-label {
  font-size: 10px;
  color: v-bind("isDarkMode ? '#9E9E9E' : '#666666'");
  font-weight: 500;
  line-height: 1.2;
}

/* Side Stats (Colliders) */
.side-stat {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  padding: 18px 14px; /* Slightly reduced padding */
  background: v-bind("isDarkMode ? 'rgba(255, 77, 109, 0.15)' : 'rgba(255, 77, 109, 0.12)'");
  border-radius: 16px; /* Less rounded */
  border: 3px solid rgba(255, 77, 109, 0.3); /* Thinner border */
  backdrop-filter: blur(15px);
  cursor: pointer;
  min-width: 110px; /* Slightly smaller */
  box-shadow: 
    0 6px 25px rgba(255, 77, 109, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 77, 109, 0.15); /* Reduced glow */
  will-change: transform, opacity;
}

.left-stat {
  left: 250px; /* Position on screen but to the left */
}

.right-stat {
  right: 250px; /* Position on screen but to the right */
}

.side-stat .stat-icon {
  font-size: 26px; /* Slightly smaller */
  margin-bottom: 8px;
}

.side-stat .stat-value {
  font-size: 26px; /* Slightly smaller */
  font-weight: bold;
  color: #FF4D6D;
  margin-bottom: 6px;
  text-shadow: 0 0 5px rgba(255, 77, 109, 0.3); /* Reduced text glow */
}

.side-stat .stat-label {
  font-size: 13px; /* Slightly smaller */
  color: v-bind("isDarkMode ? '#FFB3C1' : '#CC3952'");
  font-weight: 600;
}

/* Impact Particles */
.impact-particle {
  background: radial-gradient(circle, rgba(0, 140, 255, 1) 0%, rgba(0, 140, 255, 0.8) 30%, transparent 70%);
  animation: particle-glow 0.8s ease-out;
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
  position: relative;
  z-index: 0; /* Let icons appear above the avatar */
}

.avatar:hover {
  transform: scale(1.05);
}

/* Avatar with satellite orbit system */
.avatar-container {
  position: relative;
  display: inline-block;
}

.satellite-system {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2; /* Put above the avatar */
  transform-style: preserve-3d;
  will-change: transform;
}

.avatar-container {
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  perspective: 1000px;
  cursor: pointer;
}

.avatar {
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  will-change: transform;
}

.satellite-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.satellite {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  pointer-events: auto; /* Enable clicks on satellites */
  cursor: pointer;
}

.satellite:hover {
  transform: translateX(-50%) scale(1.2);
  filter: drop-shadow(0 4px 15px rgba(0, 140, 255, 0.4));
}

.tech-icon {
  display: block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Individual icon size control based on speed (inverse relationship) */
.pytorch-icon {
  width: 36px !important;
  height: 36px !important;
}

.python-icon {
  width: 32px !important;
  height: 32px !important;
}

.vue-icon {
  width: 24px !important;
  height: 24px !important;
}

.vscode-icon {
  width: 18px !important;
  height: 18px !important;
}

.typescript-icon {
  width: 14px !important;
  height: 14px !important;
}

/* 五图标自然分散方案：
   • 五个角速度：11, 17, 23, 29, 37 °/s（质数保证不同步）  
   • 半径：480, 430, 380, 330, 280 px（更紧凑的50px间隔）  
   • 初始角度：0°, 12°, 24°, 36°, 48°（自然的小角度差，让速度差异产生分散效果）  
   • 动画时长 = 360 ÷ 角速度（秒）  
*/

/* 图标1 - PyTorch (11°/s) */
.orbit-1 {
  width: 480px; 
  height: 480px;
  animation: rotate-1 32.73s linear infinite; /*360/11*/
  transform: translate(-50%, -50%) rotate(0deg);
}
@keyframes rotate-1 { 
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); } 
}
.satellite-1 { 
  animation: satellite-counter-rotate-1 32.73s linear infinite; 
}
@keyframes satellite-counter-rotate-1 {
  from { transform: translateX(-50%) rotate(0deg); }
  to { transform: translateX(-50%) rotate(-360deg); }
}

/* 图标2 - Python (17°/s) */
.orbit-2 {
  width: 430px; 
  height: 430px;
  animation: rotate-2 21.18s linear infinite; /*360/17*/
  transform: translate(-50%, -50%) rotate(12deg);
}
@keyframes rotate-2 { 
  from { transform: translate(-50%, -50%) rotate(12deg); }
  to { transform: translate(-50%, -50%) rotate(372deg); } 
}
.satellite-2 { 
  animation: satellite-counter-rotate-2 21.18s linear infinite; 
}
@keyframes satellite-counter-rotate-2 {
  from { transform: translateX(-50%) rotate(-12deg); }
  to { transform: translateX(-50%) rotate(-372deg); }
}

/* 图标3 - Vue.js (23°/s) */
.orbit-3 {
  width: 380px; 
  height: 380px;
  animation: rotate-3 15.65s linear infinite; /*360/23*/
  transform: translate(-50%, -50%) rotate(24deg);
}
@keyframes rotate-3 { 
  from { transform: translate(-50%, -50%) rotate(24deg); }
  to { transform: translate(-50%, -50%) rotate(384deg); } 
}
.satellite-3 { 
  animation: satellite-counter-rotate-3 15.65s linear infinite; 
}
@keyframes satellite-counter-rotate-3 {
  from { transform: translateX(-50%) rotate(-24deg); }
  to { transform: translateX(-50%) rotate(-384deg); }
}

/* 图标4 - VS Code (29°/s) */
.orbit-4 {
  width: 340px; 
  height: 340px;
  animation: rotate-4 12.41s linear infinite; /*360/29*/
  transform: translate(-50%, -50%) rotate(36deg);
}
@keyframes rotate-4 { 
  from { transform: translate(-50%, -50%) rotate(36deg); }
  to { transform: translate(-50%, -50%) rotate(396deg); } 
}
.satellite-4 { 
  animation: satellite-counter-rotate-4 12.41s linear infinite; 
}
@keyframes satellite-counter-rotate-4 {
  from { transform: translateX(-50%) rotate(-36deg); }
  to { transform: translateX(-50%) rotate(-396deg); }
}

/* 图标5 - TypeScript (37°/s) */
.orbit-5 {
  width: 320px; 
  height: 320px;
  animation: rotate-5 9.73s linear infinite; /*360/37*/
  transform: translate(-50%, -50%) rotate(48deg);
}
@keyframes rotate-5 { 
  from { transform: translate(-50%, -50%) rotate(48deg); }
  to { transform: translate(-50%, -50%) rotate(408deg); } 

}
.satellite-5 { 
  animation: satellite-counter-rotate-5 9.73s linear infinite; 
}
@keyframes satellite-counter-rotate-5 {
  from { transform: translateX(-50%) rotate(-48deg); }
  to { transform: translateX(-50%) rotate(-408deg); }
}

/* Responsive adjustments for satellite system */
@media (max-width: 1024px) {
  .orbit-1 {
    width: 380px; /* PyTorch - scaled down from 480px */
    height: 380px;
  }
  
  .orbit-2 {
    width: 340px; /* Python - scaled down from 430px */
    height: 340px;
  }
  
  .orbit-3 {
    width: 300px; /* Vue.js - scaled down from 380px */
    height: 300px;
  }
  
  .orbit-4 {
    width: 260px; /* VS Code - scaled down from 330px */
    height: 260px;
  }
  
  .orbit-5 {
    width: 220px; /* TypeScript - scaled down from 280px */
    height: 220px;
  }
  
  /* Scale down icons for tablets while maintaining size relationships */
  .pytorch-icon {
    width: 38px !important;
    height: 38px !important;
  }

  .python-icon {
    width: 32px !important;
    height: 32px !important;
  }

  .vue-icon {
    width: 26px !important;
    height: 26px !important;
  }

  .vscode-icon {
    width: 21px !important;
    height: 21px !important;
  }

  .typescript-icon {
    width: 18px !important;
    height: 18px !important;
  }
}

@media (max-width: 768px) {
  .satellite-system {
    display: none; /* Hide satellite system on mobile for performance and clarity */
  }
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

  /* Pyramid Section Mobile Styles */
  .pyramid-section {
    padding: 24px 16px;
    min-height: 100vh;
  }

  .pyramid-container {
    height: 70vh;
    max-width: 100%;
  }

  .pyramid-formation {
    gap: 12px;
    margin: 20px 0;
    transform: scale(0.8);
  }

  .pyramid-row {
    gap: 8px;
  }

  .pyramid-stat {
    padding: 8px 6px;
    min-width: 65px;
    border-width: 1px;
  }

  .pyramid-stat .stat-icon {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .pyramid-stat .stat-value {
    font-size: 14px;
  }

  .pyramid-stat .stat-label {
    font-size: 8px;
  }

  .side-stat {
    padding: 14px 10px; /* Adjusted for mobile */
    min-width: 95px;
    border-width: 2px; /* Thinner border on mobile */
  }

  .left-stat {
    left: -150px; /* Adjusted for mobile, visible on screen */
  }

  .right-stat {
    right: -150px; /* Adjusted for mobile, visible on screen */
  }

  .side-stat .stat-icon {
    font-size: 20px; /* Smaller on mobile */
    margin-bottom: 6px;
  }

  .side-stat .stat-value {
    font-size: 20px; /* Smaller on mobile */
  }

  .side-stat .stat-label {
    font-size: 11px;
  }

  /* Final Grid Mobile Styles */
  .final-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 20px 16px;
    max-width: 100%;
  }

  .grid-stat-item {
    padding: 16px 10px;
    min-height: 120px;
    border-radius: 12px;
  }

  .grid-stat-item .stat-icon {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .grid-stat-item .stat-value {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .grid-stat-item .stat-label {
    font-size: 10px;
    line-height: 1.2;
  }

  /* Mobile stats footer */
  .stats-footer {
    bottom: 20px;
  }

  .stats-footer .update-info {
    padding: 3px 8px;
    font-size: 10px;
    gap: 4px;
  }

  .stats-footer .update-icon {
    font-size: 8px;
  }

  .stats-footer .update-text {
    font-size: 9px;
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

/* Snowflake Animation Styles */
.snowflake-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.snowflake-particle {
  position: absolute;
  will-change: transform;
  backface-visibility: hidden;
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Loading state for lazy-loaded sections */
.section-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

/* Dark mode adjustments for snowflakes */
.n-config-provider[data-theme="dark"] .snowflake-particle {
  opacity: 0.3 !important; /* Increased visibility in dark mode */
  color: #F0F8FF !important; /* Light blue-white for dark backgrounds */
}

/* Responsive adjustments for snowflakes */
@media (max-width: 768px) {
  .snowflake-particle {
    display: none; /* Hide snowflakes on mobile for performance */
  }
}

@media (max-width: 1024px) {
  .snowflake-container {
    opacity: 0.6; /* Reduce opacity on tablets */
  }

  .snowflake-particle {
    font-size: 6px !important; /* Smaller snowflakes on tablets */
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .snowflake-particle,
  .collision-particle,
  .impact-particle,
  .star-particle {
    display: none !important;
  }

  .skill-tag,
  .pyramid-stat,
  .grid-stat-item,
  .side-stat,
  .satellite,
  .avatar {
    animation: none !important;
    transition: none !important;
  }

  .satellite-orbit {
    animation: none !important;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Star effect styles */
.star-particle {
  will-change: transform, opacity;
  backface-visibility: hidden;
  user-select: none;
  animation: sparkle 0.1s ease-out;
}

@keyframes sparkle {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
}

/* Enhanced satellite hover effect */
.satellite {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.satellite:hover .tech-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) brightness(1.3) saturate(1.2);
  transform: scale(1.1);
}

.satellite:active {
  transform: translateX(-50%) scale(0.95);
}
</style>
