<script setup>
import { ref, onMounted, onUnmounted, computed, inject, nextTick } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { techStack, categories } from '../../data/techStack.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const router = useRouter()
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst', 'NLP Developer', 'Creative Coder', 'Algorithm Designer', 'Automation Guru'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))
const lastGitHubUpdate = ref(null)
const isUsingFallbackData = ref(false)

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

onMounted(() => {
  typeNextRole()
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)

  // Wait for DOM rendering to complete before executing animations
  nextTick(() => {
    animateSkills()
    setupSmoothScroll()
    setupPyramidAnimation()
    setupVortexAnimation()
    // Clear any stale cache older than 24 hours on startup
    clearStaleCache()
    // Force fresh data on first load to ensure users see current data
    fetchGitHubStats(true)
    fetchCodeforcesStats(true)
  })

  // Update time display text every minute
  setInterval(() => {
    if (lastGitHubUpdate.value || lastCodeforcesUpdate.value) {
      // Trigger computed property recalculation for both services
      lastGitHubUpdate.value = lastGitHubUpdate.value
      lastCodeforcesUpdate.value = lastCodeforcesUpdate.value
    }
  }, 60000) // Update time display every 60 seconds

  // Set up 15-minute refresh interval for GitHub data
  refreshInterval = setInterval(() => {
    fetchGitHubStats()
    fetchCodeforcesStats()
  }, 15 * 60 * 1000) // 15 minutes
})

// Clean up intervals when component is unmounted
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

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

// Pyramid statistics data update animation
function animatePyramidStatsUpdate() {
  const pyramidItems = document.querySelectorAll('.pyramid-stat .stat-value')
  pyramidItems.forEach((item, index) => {
    gsap.fromTo(item, {
      scale: 1,
      opacity: 1
    }, {
      scale: 1.3,
      opacity: 0.9,
      duration: 0.4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
      delay: index * 0.05
    })
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
  // Stop any ongoing animations
  gsap.killTweensOf(['#leftStat', '#rightStat', '.pyramid-stat', '.grid-stat-item', '#pyramidContainer', '#finalGrid'])
  
  // Reset all elements to initial state with hardware acceleration
  gsap.set('#leftStat', {
    x: -180,
    opacity: 1,
    scale: 1,
    rotation: 0,
    y: 0,
    force3D: true
  })
  
  gsap.set('#rightStat', {
    x: 180,
    opacity: 1,
    scale: 1,
    rotation: 0,
    y: 0,
    force3D: true
  })
  
  // Keep pyramid stats visible and in position
  gsap.set('.pyramid-stat', {
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
    opacity: 1,
    force3D: true
  })
  
  gsap.set('.grid-stat-item', {
    scale: 0.95,
    opacity: 0,
    y: 15,
    force3D: true
  })
  
  gsap.set('#finalGrid', {
    opacity: 0,
    force3D: true
  })
  
  gsap.set('#pyramidContainer', {
    x: 0,
    force3D: true
  })
}

function triggerPyramidAnimation() {
  // Smoother collision animation with bigger effects
  const tl = gsap.timeline()
  
  // Phase 1: Side stats move toward center for collision (smoother)
  tl.to('#leftStat', {
    x: -100,
    y: -15,
    scale: 1.3,
    rotation: -8,
    duration: 1.0, // Slightly longer for smoothness
    ease: 'power2.inOut', // Smoother easing
    force3D: true
  })
  .to('#rightStat', {
    x: 100,
    y: -15,
    scale: 1.3,
    rotation: 8,
    duration: 1.0,
    ease: 'power2.inOut',
    force3D: true
  }, '-=1.0')
  
  // Phase 2: Brief pause before final collision
  .to({}, { duration: 0.2 }) // Shorter pause
  
  // Phase 3: Final collision approach (smoother)
  .to('#leftStat', {
    x: -40,
    y: 0,
    scale: 1.5,
    rotation: -15,
    duration: 0.3,
    ease: 'power3.inOut', // Smoother easing
    force3D: true
  })
  .to('#rightStat', {
    x: 40,
    y: 0,
    scale: 1.5,
    rotation: 15,
    duration: 0.3,
    ease: 'power3.inOut',
    force3D: true
  }, '-=0.3')
  
  // Phase 4: Impact moment with bigger effects
  .to('#leftStat', {
    x: -10,
    scale: 1.6,
    rotation: -20,
    duration: 0.15,
    ease: 'power4.out',
    force3D: true,
    onComplete: () => createLightImpactExplosion('left')
  })
  .to('#rightStat', {
    x: 10,
    scale: 1.6,
    rotation: 20,
    duration: 0.15,
    ease: 'power4.out',
    force3D: true,
    onComplete: () => createLightImpactExplosion('right')
  }, '-=0.15')
  
  // Phase 5: More noticeable screen shake
  .to('#pyramidContainer', {
    x: 6,
    duration: 0.04,
    repeat: 4,
    yoyo: true,
    ease: 'none',
    force3D: true
  }, '-=0.1')
  
  // Phase 6: Bigger pyramid stats scattering
  .to('.pyramid-stat', {
    x: () => (Math.random() - 0.5) * 400, // Increased range
    y: () => (Math.random() - 0.5) * 250,
    rotation: () => (Math.random() - 0.5) * 200,
    scale: () => 0.5 + Math.random() * 0.3,
    opacity: 0,
    duration: 1.0, // Longer for smoother motion
    ease: 'power2.out',
    force3D: true,
    stagger: {
      amount: 0.15, // Better stagger timing
      from: 'random'
    }
  }, '-=0.05')
  
  // Phase 7: Bigger side stats scatter
  .to(['#leftStat', '#rightStat'], {
    x: () => (Math.random() - 0.5) * 300, // Increased range
    y: () => (Math.random() - 0.5) * 200,
    rotation: () => (Math.random() - 0.5) * 120,
    scale: 0.4,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    force3D: true
  }, '-=0.7')
  
  // Phase 8: Show final grid
  .to('#finalGrid', {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    force3D: true,
    delay: 0.1
  })
  
  // Phase 9: Smoother grid items appear
  .fromTo('.grid-stat-item', {
    opacity: 0,
    scale: 0.9,
    y: 20
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.6,
    ease: 'back.out(1.2)', // More bouncy
    force3D: true,
    stagger: {
      amount: 0.3, // Better stagger
      from: 'center'
    }
  }, '-=0.2')
  
  // Phase 10: Restore container position
  .set('#pyramidContainer', { x: 0, force3D: true })
  
}

function createLightImpactExplosion(side) {
  const container = document.querySelector('#pyramidContainer')
  const rect = container.getBoundingClientRect()
  
  // Create more visible explosion with more particles
  for (let i = 0; i < 15; i++) { // Increased from 6 to 15
    const particle = document.createElement('div')
    particle.className = 'impact-particle'
    
    const size = 4 + Math.random() * 6 // Bigger particles (4-10px)
    const colors = [
      'rgba(0, 140, 255, 0.9)',
      'rgba(255, 77, 109, 0.9)',
      'rgba(0, 255, 136, 0.8)',
      'rgba(255, 255, 255, 0.9)',
      'rgba(255, 196, 0, 0.8)'
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
      box-shadow: 0 0 ${size * 3}px ${color};
    `
    
    document.body.appendChild(particle)
    
    // Bigger explosion pattern
    const angle = (i / 15) * Math.PI * 2 + (Math.random() - 0.5) * 0.6
    const distance = 80 + Math.random() * 120 // Bigger explosion radius
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance
    
    gsap.to(particle, {
      x: endX,
      y: endY,
      scale: 0,
      opacity: 0,
      rotation: 180 + Math.random() * 180,
      duration: 0.8 + Math.random() * 0.4, // Longer duration
      ease: 'power2.out',
      force3D: true,
      onComplete: () => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle)
        }
      }
    })
  }
}

// Vortex Animation Setup and Functions
function setupVortexAnimation() {
  // Create tech stack vortex particles
  createVortexParticles()
  
  // Start the continuous vortex animation
  startVortexAnimation()
}

function createVortexParticles() {
  const heroSection = document.querySelector('.hero-section')
  if (!heroSection) return

  // Create container for vortex particles
  const vortexContainer = document.createElement('div')
  vortexContainer.className = 'vortex-container'
  vortexContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
  `
  heroSection.appendChild(vortexContainer)

  // Define colorful block colors
  const blockColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#AED6F1'
  ]

  // Calculate content boundaries to avoid text and avatar
  const heroContent = heroSection.querySelector('.hero-content')
  const contentRect = heroContent ? heroContent.getBoundingClientRect() : null
  const heroRect = heroSection.getBoundingClientRect()
  
  // Define safe zone boundaries (avoid central content area)
  const centerX = heroSection.offsetWidth / 2
  const centerY = heroSection.offsetHeight / 2
  const safeZoneWidth = 500 // Avoid 500px width around center
  const safeZoneHeight = 300 // Avoid 300px height around center

  // Create minimal spiraling blocks for performance
  for (let i = 0; i < 8; i++) { // Reduced from 12 to 8
    const particle = document.createElement('div')
    const color = blockColors[i % blockColors.length]
    
    particle.className = 'vortex-particle'
    
    const size = 4 + Math.random() * 3 // Even smaller: 4-7px blocks
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 1px;
      opacity: 0.2; /* Even more subtle */
      will-change: transform;
    `
    
    // Set initial position avoiding the center content area
    const angle = (i / 20) * Math.PI * 2
    const minRadius = Math.max(safeZoneWidth, safeZoneHeight) / 2 + 50 // Start outside safe zone
    const radius = minRadius + Math.random() * 100
    
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius
    
    gsap.set(particle, {
      x: x,
      y: y,
      rotation: Math.random() * 360,
      force3D: true
    })
    
    vortexContainer.appendChild(particle)
  }
}

function startVortexAnimation() {
  const particles = document.querySelectorAll('.vortex-particle')
  if (particles.length === 0) return

  const heroSection = document.querySelector('.hero-section')
  const centerX = heroSection.offsetWidth / 2
  const centerY = heroSection.offsetHeight / 2
  
  // Define safe zone to avoid content
  const safeZoneWidth = 500
  const safeZoneHeight = 300
  const minRadius = Math.max(safeZoneWidth, safeZoneHeight) / 2 + 80

  particles.forEach((particle, index) => {
    // Very simple orbit parameters
    const baseRadius = minRadius + (index % 3) * 80 // Only 3 orbital layers, more spaced
    const rotationSpeed = 0.2 + (index % 2) * 0.1 // Even slower: 0.2, 0.3
    const direction = index % 2 === 0 ? 1 : -1
    const startAngle = (index / particles.length) * Math.PI * 2
    
    // Single, very slow rotation animation
    gsap.to(particle, {
      duration: 40 / rotationSpeed, // Much slower rotation (40s base)
      ease: 'none',
      repeat: -1,
      onUpdate: function() {
        const currentTime = this.totalTime()
        const angle = startAngle + direction * (currentTime / this.duration()) * Math.PI * 2
        
        const x = centerX + Math.cos(angle) * baseRadius
        const y = centerY + Math.sin(angle) * baseRadius
        
        gsap.set(particle, { x, y, force3D: true })
      }
    })
    
    // Remove scale and opacity animations to improve performance
  })
}
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
  padding-top: 0 24px 24px;
  padding-left: 0 24px 24px;
  padding-right: 0 24px 24px;
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 32px;
}

/* Subsequent content areas */
.content-sections {
  max-width: 1080px;
  margin: 0 auto;
  padding-right: 24px;
  padding-left: 24px;
  padding-bottom: 24px;
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
  max-width: 1200px;
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

/* Vortex Animation Styles */
.vortex-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.vortex-particle {
  position: absolute;
  border-radius: 1px;
  will-change: transform;
  backface-visibility: hidden;
}

/* Remove hover effects for better performance */

/* Dark mode adjustments for vortex */
.n-config-provider[data-theme="dark"] .vortex-particle {
  opacity: 0.25 !important;
}

/* Responsive adjustments for vortex */
@media (max-width: 768px) {
  .vortex-particle {
    display: none; /* Hide vortex on mobile for performance */
  }
}

@media (max-width: 1024px) {
  .vortex-container {
    opacity: 0.7; /* Reduce opacity on tablets */
  }
}
</style>
