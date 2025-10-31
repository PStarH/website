<script setup>
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const isDarkMode = inject('isDarkMode', ref(true))

// Hero typing animation state
const heroLines = [
  'I write poetry, using code for lines and philosophy for rhyme.',
  'I set algorithms ablaze with insights from history.',
  'I cultivate poems of humanity in the quiet soil of logic.'
]
const currentHeroLine = ref(0)
const typedHeroText = ref('')
const showHeroCursor = ref(true)
let heroTypingInterval = null
let heroTimeout = null

// Lenis smooth scroll
let lenis = null

// Code poems with copy functionality
const codePoems = ref([
  {
    title: 'morning.js',
    code: `let dawn = true;\nif (dawn) compose("hello world");\nelse meditate("try again");`,
    caption: 'poem #1: on beginnings and hope'
  },
  {
    title: 'memory.py',
    code: `def remember():\n    for moment in chronicle:\n        if "insight" in moment:\n            weave(moment)\n    return symphony_of(meaning)`,
    caption: 'poem #2: on memory and recursion'
  },
  {
    title: 'commit.msg',
    code: `commit -m "weave thought into function"\npush origin main\nthe world contracts`,
    caption: 'poem #3: on creation and release'
  }
])

const copiedPoem = ref(null)

// My Method - moved from working method section
const inspirationSources = ref([
  {
    title: 'Step 1',
    subtitle: 'Distill',
    description: 'Distill the problem into a single, potent sentence.',
    icon: '�'
  },
  {
    title: 'Step 2',
    subtitle: 'Prototype',
    description: 'Craft a minimal, functional prototype to test its soul.',
    icon: '⚡'
  },
  {
    title: 'Step 3',
    subtitle: 'Iterate',
    description: 'Iterate with data and human feedback until it tells a clear story.',
    icon: '🔄'
  }
])

// Copy code poem to clipboard
const copyCodePoem = async (index) => {
  const poem = codePoems.value[index]
  try {
    await navigator.clipboard.writeText(poem.code)
    copiedPoem.value = index
    setTimeout(() => {
      copiedPoem.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Hero typing animation
const typeHeroLine = () => {
  const currentLine = heroLines[currentHeroLine.value]
  let charIndex = 0

  typedHeroText.value = ''
  showHeroCursor.value = true

  heroTypingInterval = setInterval(() => {
    if (charIndex < currentLine.length) {
      typedHeroText.value += currentLine[charIndex]
      charIndex++
    } else {
      clearInterval(heroTypingInterval)
      
      // Wait 2.5 seconds while showing the complete text
      heroTimeout = setTimeout(() => {
        // Clear text
        typedHeroText.value = ''
        
        // Move to next line
        currentHeroLine.value = (currentHeroLine.value + 1) % heroLines.length
        
        // Wait 300ms before starting next line
        setTimeout(() => {
          typeHeroLine()
        }, 300)
      }, 2500)
    }
  }, 50)
}

// Initialize animations
onMounted(async () => {
  await nextTick()

  // Initialize Lenis
  lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 2,
    infinite: false,
    wheelMultiplier: 1.0,
  })

  function raf(time) {
    lenis.raf(time)
    ScrollTrigger.update()
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // Start hero typing animation
  typeHeroLine()

  // Wait for DOM to be fully ready
  await nextTick()

  // 1. Hero section entrance - subtle fade in
  gsap.from('.hero-section', {
    opacity: 0,
    duration: 1.5,
    ease: 'power2.out'
  })

  // 2. Positioning section - staggered reveal
  gsap.from('.positioning-text span', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 0.5
  })

  // 3. Short self paragraphs - scroll-triggered stagger
  const shortSelfParas = gsap.utils.toArray('.short-self p')
  if (shortSelfParas.length > 0) {
    gsap.set(shortSelfParas, { opacity: 1, x: 0 }) // Ensure visibility
    gsap.fromTo(shortSelfParas,
      { opacity: 0, x: -30 },
      {
        scrollTrigger: {
          trigger: '.short-self',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      }
    )
  }

  // 4. Core narrative - flowing line by line animation
  const narrativeTexts = gsap.utils.toArray('.narrative-text')
  if (narrativeTexts.length > 0) {
    gsap.set(narrativeTexts, { opacity: 1, y: 0 }) // Ensure visibility
    gsap.fromTo(narrativeTexts,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: '.core-narrative',
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power1.out'
      }
    )
  }

  // Narrative footnote with special effect
  const narrativeFootnote = document.querySelector('.narrative-footnote')
  if (narrativeFootnote) {
    gsap.set(narrativeFootnote, { opacity: 1, scale: 1 }) // Ensure visibility
    gsap.fromTo(narrativeFootnote,
      { opacity: 0, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: narrativeFootnote,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.2)'
      }
    )
  }

  // 5. Read projects section - smooth reveal with scale
  const readProjectsSection = document.querySelector('.read-projects-section')
  if (readProjectsSection) {
    gsap.set(readProjectsSection, { opacity: 1, scale: 1 }) // Ensure visibility
    gsap.fromTo(readProjectsSection,
      { opacity: 0, scale: 0.97 },
      {
        scrollTrigger: {
          trigger: readProjectsSection,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out'
      }
    )
  }

  // 6. Code poems - floating entrance with alternating directions
  gsap.utils.toArray('.code-poem-card').forEach((card, index) => {
    const isRight = index % 2 === 0

    gsap.set(card, { opacity: 1, x: 0, y: 0 }) // Ensure visibility
    gsap.fromTo(card,
      { opacity: 0, x: isRight ? 50 : -50, y: 30 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'power2.out'
      }
    )

    // Continuous floating effect
    gsap.to(card, {
      y: -8,
      duration: 3 + (index * 0.5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.3
    })
  })

  // Animate poem arrows
  const poemArrows = gsap.utils.toArray('.poem-arrow')
  if (poemArrows.length > 0) {
    gsap.set(poemArrows, { opacity: 1, scale: 1 }) // Ensure visibility
    gsap.fromTo(poemArrows,
      { opacity: 0, scale: 0.5 },
      {
        scrollTrigger: {
          trigger: '.code-poems-section',
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.5)'
      }
    )
  }

  // 7. Inspiration cards - staggered entrance
  const inspirationCards = gsap.utils.toArray('.inspiration-card')
  if (inspirationCards.length > 0) {
    gsap.set(inspirationCards, { opacity: 1, y: 0, scale: 1 }) // Ensure visibility
    gsap.fromTo(inspirationCards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.inspiration-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)'
      }
    )
  }

  // 8. Closing section - poetic line-by-line reveal
  const closingLines = gsap.utils.toArray('.closing-line')
  if (closingLines.length > 0) {
    gsap.set(closingLines, { opacity: 1, y: 0 }) // Ensure visibility
    gsap.fromTo(closingLines,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: '.closing-section',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.25,
        ease: 'power1.out'
      }
    )
  }

  // 9. CTA buttons - smooth entrance
  const ctaButtons = gsap.utils.toArray('.cta-button')
  if (ctaButtons.length > 0) {
    gsap.set(ctaButtons, { opacity: 1, y: 0, scale: 1 }) // Ensure visibility
    gsap.fromTo(ctaButtons,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.3)'
      }
    )
  }

  // Footer signature fade in
  const footerSig = document.querySelector('.footer-signature')
  if (footerSig) {
    gsap.set(footerSig, { opacity: 1 }) // Ensure visibility
    gsap.fromTo(footerSig,
      { opacity: 0 },
      {
        scrollTrigger: {
          trigger: footerSig,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        duration: 1,
        ease: 'power1.out'
      }
    )
  }

  // Add parallax effect to section titles
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      y: -30,
      ease: 'none'
    })
  })
})

onUnmounted(() => {
  // Clear intervals and timeouts
  if (heroTypingInterval) clearInterval(heroTypingInterval)
  if (heroTimeout) clearTimeout(heroTimeout)

  // Kill all GSAP animations and ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')

  // Destroy Lenis instance
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
})

const navigateToProjects = () => {
  router.push('/project')
}
</script>

<template>
  <div class="code-poet-about" :class="{ 'dark-mode': isDarkMode }">

    <!-- 1. Hero Section with Typing Animation -->
    <section class="hero-section">
      <div class="particles-bg"></div>
      <div class="hero-content">
        <div class="hero-typing-text">
          {{ typedHeroText }}<span class="cursor">|</span>
        </div>
      </div>
    </section>

      <!-- 2. Top Micro-Positioning -->
      <section class="positioning-section">
        <div class="positioning-text">
          <span class="name">Xinghan Pan</span>
          <span class="separator">—</span>
          <span class="title">Code Poet</span>
          <span class="dot">·</span>
          <span class="subtitle">Grounded in Philosophy & History</span>
        </div>
      </section>

      <!-- 3. Short Self (TL;DR) -->
      <section class="short-self section-container">
        <p>I am Xinghan Pan. By day, I engineer systems; by night, I write with ideas.</p>
        <p>My code seeks logical purity; my projects seek human resonance.</p>
        <p>Each function is a sentence, each iteration a footnote.</p>
        <p>To see my work or discuss a complex problem, explore my projects or send me an email.</p>
      </section>

      <!-- 4. Core Narrative (Deep Version) -->
      <section class="core-narrative section-container">
        <div class="narrative-text">I am a student who loves both building and thinking.</div>
        <div class="narrative-text">When I code, I see problems as ideas to shape, and rules as rhythm to follow.</div>
        <div class="narrative-text">History helps me understand how systems rise and fall.</div>
        <div class="narrative-text">Philosophy makes me ask not only "can we build it?" but "should we?"</div>
        <div class="narrative-text">Poetry teaches me to say more with less.</div>
        <div class="narrative-text">My projects are not just tools—they are ways to explore meaning, ethics, and human stories.</div>
        <div class="narrative-text">When I make a learning app, I think about curiosity and growth.</div>
        <div class="narrative-text">When I design an AI system, I think about how it treats people.</div>
        <div class="narrative-text">My goal is simple: to use code to ask lasting questions, not to chase short trends.</div>
        <div class="narrative-footnote">"Every project is a thought experiment."</div>
      </section>

      <!-- 5. How to Read My Projects -->
      <section class="read-projects-section section-container">
        <div class="read-content">
          <div class="read-text">
            <h2 class="section-title">How to Read My Projects</h2>
            <p>Look beyond the tech stack.</p>
            <p>Observe how the problem is framed, the trade-offs made, and its potential human impact.</p>
            <p>Treat each project as a short thesis — from idea to execution, from ethical resonance to your invitation to engage.</p>
          </div>
        </div>
      </section>

      <!-- 6. Code Poems -->
      <section class="code-poems-section section-container">
        <h2 class="section-title">Code Poems</h2>
        <div class="poems-grid">
          <template v-for="(poem, index) in codePoems" :key="poem.title">
            <!-- Arrow at the top of current card (pointing to it from previous card) -->
            <div v-if="index > 0" class="poem-arrow" :class="'arrow-to-' + (index % 2 === 0 ? 'right' : 'left')">
              <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                <path 
                  :d="index % 2 === 0 ? 'M 10 10 L 10 110 L 90 110' : 'M 90 10 L 90 110 L 10 110'" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  fill="none" 
                  stroke-linecap="round"
                />
                <polygon 
                  :points="index % 2 === 0 ? '90,110 85,105 85,115' : '10,110 15,105 15,115'" 
                  fill="currentColor"
                />
              </svg>
            </div>
            
            <div
              class="code-poem-card"
              :class="'poem-' + (index % 2 === 0 ? 'right' : 'left')"
            >
              <div class="poem-header">
                <span class="poem-title">{{ poem.title }}</span>
                <button
                  class="copy-button"
                  @click="copyCodePoem(index)"
                  :class="{ 'copied': copiedPoem === index }"
                >
                  {{ copiedPoem === index ? '✓' : '📋' }}
                </button>
              </div>
              <pre class="poem-code"><code>{{ poem.code }}</code></pre>
              <div class="poem-caption">{{ poem.caption }}</div>
            </div>
          </template>
        </div>
      </section>

      <!-- 7. My Method: Thought → Prototype → Story -->
      <section class="inspiration-section section-container">
        <h2 class="section-title">My Method: Thought → Prototype → Story</h2>
        <div class="inspiration-grid">
          <div
            v-for="source in inspirationSources"
            :key="source.title"
            class="inspiration-card"
          >
            <div class="card-icon">{{ source.icon }}</div>
            <h3 class="card-title">{{ source.title }}</h3>
            <div class="card-subtitle">{{ source.subtitle }}</div>
            <p class="card-description">{{ source.description }}</p>
          </div>
        </div>
      </section>

      <!-- 8. Closing Invitation -->
      <section class="closing-section section-container">
        <div class="closing-text">
          <div class="closing-line">I am writing my next chapter,</div>
          <div class="closing-line">still searching for new light.</div>
          <div class="closing-line">If you, too, believe technology is a vessel for profound thought,</div>
          <div class="closing-line">let us write the next line, together.</div>
        </div>
      </section>

      <!-- 9. CTA Section -->
      <section class="cta-section section-container">
        <div class="cta-buttons">
          <button class="cta-button primary" @click="navigateToProjects">
            Explore My Digital Verse
            <span class="arrow">→</span>
          </button>
          <a
            class="cta-button secondary"
            href="mailto:s22360.pan@stu.scie.com.cn"
          >
            Discuss an Idea
            <span class="arrow">→</span>
          </a>
        </div>
        <div class="footer-signature">
          © 2025 Xinghan Pan — Code Poet.
        </div>
      </section>

    </div>
</template>

<style scoped lang="less">
.code-poet-about {
  min-height: 100vh;
  background: transparent;
  color: v-bind("isDarkMode ? '#f1f5f9' : '#1e293b'");
  overflow-x: hidden;
  position: relative;

  // 顶部渐变过渡
  &::before {
    content: '';
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, 
      v-bind("isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(255, 255, 255, 0.8)'"),
      transparent
    );
    z-index: 999;
    pointer-events: none;
  }

  // 底部渐变过渡
  &::after {
    content: '';
    position: fixed;
    bottom: 75px;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to top, 
      v-bind("isDarkMode ? 'rgba(45, 45, 68, 0.8)' : 'rgba(232, 232, 232, 0.8)'"),
      transparent
    );
    z-index: 999;
    pointer-events: none;
  }
}

// Hero Section
.hero-section {
  position: relative;
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  overflow: hidden;
  margin-bottom: 0;
  padding: 40px 30px;

  .particles-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
    animation: particleFloat 20s infinite ease-in-out;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    width: 100%;
  }

  .hero-typing-text {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    line-height: 1.6;
    font-weight: 400;
    text-align: center;
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.3px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    .cursor {
      display: inline-block;
      width: 2px;
      height: 2.2rem;
      background: linear-gradient(180deg, #0ea5e9, #ec4899);
      margin-left: 5px;
      animation: blink 1s step-end infinite;
    }
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  50.01%, 100% {
    opacity: 0;
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.05);
  }
}

// Positioning Section
.positioning-section {
  padding: 20px 30px;
  text-align: center;
  background: transparent;
  border-bottom: 1px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(2, 132, 199, 0.1)'");

  .positioning-text {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: v-bind("isDarkMode ? '#e2e8f0' : '#475569'");
    letter-spacing: 0.5px;

    .name {
      font-weight: 700;
      color: v-bind("isDarkMode ? '#f8fafc' : '#0f172a'");
      font-size: 1.15rem;
    }

    .separator {
      margin: 0 10px;
      color: v-bind("isDarkMode ? '#64748b' : '#94a3b8'");
    }

    .title {
      font-weight: 600;
      background: linear-gradient(90deg, #0ea5e9, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .dot {
      margin: 0 8px;
      color: v-bind("isDarkMode ? '#64748b' : '#94a3b8'");
    }

    .subtitle {
      font-weight: 400;
      color: v-bind("isDarkMode ? '#cbd5e1' : '#64748b'");
    }
  }
}

// Section Container
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px 30px;
  position: relative;
}

// Short Self Section
// Short Self Section
.short-self {
  p {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    line-height: 1.7;
    font-weight: 400;
    text-align: center;
    color: v-bind("isDarkMode ? '#f1f5f9' : '#1e293b'");
    margin: 12px 0;
    transition: all 0.3s ease;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;

    &:hover {
      color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
      transform: translateX(3px);
    }
  }
}

// Core Narrative Section
.core-narrative {
  background: transparent;
  padding: 30px 30px;
  
  .narrative-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    line-height: 1.8;
    font-weight: 400;
    color: v-bind("isDarkMode ? '#f8fafc' : '#0f172a'");
    margin: 14px 0;
    padding-left: 30px;
    text-align: left;
    position: relative;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      width: 3px;
      height: 18px;
      background: linear-gradient(180deg, #0ea5e9, #ec4899);
      opacity: 0.5;
    }
  }

  .narrative-footnote {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-style: italic;
    color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
    text-align: center;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(2, 132, 199, 0.2)'");
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

// Section Title
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 25px;
  color: v-bind("isDarkMode ? '#f8fafc' : '#0f172a'");
  position: relative;
  padding-bottom: 12px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #0ea5e9, #ec4899);
    border-radius: 2px;
  }
}

// Inspiration Section
.inspiration-section {
  .inspiration-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
  }

  .inspiration-card {
    background: v-bind("isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)'");
    border: 1px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.3)' : 'rgba(2, 132, 199, 0.2)'");
    border-radius: 12px;
    padding: 28px 20px;
    text-align: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      transform: translateY(-3px);
      border-color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
      box-shadow: 0 10px 30px v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(2, 132, 199, 0.15)'");
      background: v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)'");
    }

    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
      filter: grayscale(0.2);
    }

    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: v-bind("isDarkMode ? '#f8fafc' : '#0f172a'");
    }

    .card-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: v-bind("isDarkMode ? '#94a3b8' : '#64748b'");
      margin-bottom: 12px;
    }

    .card-description {
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      line-height: 1.6;
      color: v-bind("isDarkMode ? '#cbd5e1' : '#475569'");
    }
  }
}

// Read Projects Section
.read-projects-section {
  background: v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.05)'");
  border: 1px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.25)' : 'rgba(2, 132, 199, 0.2)'");
  border-radius: 12px;
  padding: 30px;
  position: relative;
  overflow: hidden;

  // 添加装饰性渐变
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center,
      v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.05)' : 'rgba(14, 165, 233, 0.03)'") 0%,
      transparent 50%
    );
    animation: rotateGradient 20s linear infinite;
    pointer-events: none;
  }

  .read-content {
    position: relative;
    z-index: 1;
    
    .read-text {
      h2 {
        text-align: left;
        margin-bottom: 20px;
      }

      p {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        line-height: 1.8;
        color: v-bind("isDarkMode ? '#e2e8f0' : '#334155'");
        margin: 12px 0;
      }
    }
  }
}

@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Code Poems Section
.code-poems-section {
  background: transparent;
  padding: 30px 30px;
  
  .poems-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 1000px;
    margin: 0 auto;
  }

  .code-poem-card {
    background: v-bind("isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)'");
    border: 2px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.4)' : 'rgba(2, 132, 199, 0.3)'");
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px v-bind("isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'");
    width: 65%;
    position: relative;

    &.poem-right {
      margin-left: auto;
      margin-right: 5%;
    }

    &.poem-left {
      margin-left: 5%;
      margin-right: auto;
    }

    &:hover {
      border-color: v-bind("isDarkMode ? '#ec4899' : '#db2777'");
      box-shadow: 0 8px 24px v-bind("isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(219, 39, 119, 0.15)'");
      transform: translateY(-2px);
    }

    .poem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .poem-title {
        font-family: 'Fira Code', monospace;
        font-size: 1.05rem;
        color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
        font-weight: 700;
      }

      .copy-button {
        background: v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.15)'");
        border: 1px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.4)' : 'rgba(2, 132, 199, 0.4)'");
        border-radius: 6px;
        padding: 6px 14px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: v-bind("isDarkMode ? '#e2e8f0' : '#334155'");
        font-weight: 600;

        &:hover {
          background: v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.35)' : 'rgba(14, 165, 233, 0.25)'");
          border-color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
          transform: scale(1.05);
        }

        &.copied {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgba(34, 197, 94, 0.7);
          color: v-bind("isDarkMode ? '#86efac' : '#16a34a'");
        }
      }
    }

    .poem-code {
      font-family: 'Fira Code', monospace;
      font-size: 1rem;
      line-height: 1.7;
      color: v-bind("isDarkMode ? '#f8fafc' : '#0f172a'");
      background: v-bind("isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(226, 232, 240, 0.95)'");
      border: 2px solid v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.3)' : 'rgba(2, 132, 199, 0.3)'");
      border-radius: 8px;
      padding: 18px;
      overflow-x: auto;
      margin-bottom: 12px;
      font-weight: 500;
      box-shadow: inset 0 2px 8px v-bind("isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.05)'");

      code {
        white-space: pre;
        color: inherit;
        font-family: inherit;
      }
    }

    .poem-caption {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-style: italic;
      color: v-bind("isDarkMode ? '#94a3b8' : '#64748b'");
      text-align: right;
      font-weight: 500;
    }
  }

  .poem-arrow {
    height: 80px;
    display: flex;
    align-items: flex-start;
    position: relative;
    margin-bottom: -40px;
    width: 65%;
    
    &.arrow-to-left {
      // 左侧卡片，箭头在它的右上角（从右边过来）
      margin-left: 20%;
      margin-right: auto;
      justify-content: flex-end;
      padding-right: 45px; // 向右30px + 原来的15px
    }
    
    &.arrow-to-right {
      // 右侧卡片，箭头在它的左上角（从左边过来）
      margin-left: auto;
      margin-right: 20%;
      justify-content: flex-start;
      padding-left: 45px; // 向左30px + 原来的15px
    }

    svg {
      width: 100px;
      height: 150px;
      color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
      opacity: 0.7;
    }
  }
}

// Closing Section
.closing-section {
  text-align: center;
  padding: 25px 30px 20px;
  background: transparent;

  .closing-text {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    
    .closing-line {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      line-height: 1.9;
      font-weight: 400;
      color: v-bind("isDarkMode ? '#cbd5e1' : '#475569'");
      text-align: center;
      margin: 8px 0;
      font-style: italic;
    }
  }
}

// CTA Section
.cta-section {
  text-align: center;
  padding: 20px 30px 20px;
  margin-bottom: 0;
  background: transparent;

  .cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .cta-button {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    padding: 14px 30px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 600;

    .arrow {
      transition: transform 0.3s ease;
    }

    &:hover .arrow {
      transform: translateX(3px);
    }

    &.primary {
      background: linear-gradient(90deg, #0ea5e9, #ec4899);
      color: white;
      border: none;

      &:hover {
        box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
        transform: translateY(-2px);
      }
    }

    &.secondary {
      background: transparent;
      border: 2px solid v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");
      color: v-bind("isDarkMode ? '#0ea5e9' : '#0284c7'");

      &:hover {
        background: v-bind("isDarkMode ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)'");
        border-color: v-bind("isDarkMode ? '#ec4899' : '#db2777'");
        color: v-bind("isDarkMode ? '#ec4899' : '#db2777'");
        transform: translateY(-2px);
      }
    }
  }

  .footer-signature {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    color: v-bind("isDarkMode ? '#64748b' : '#94a3b8'");
    letter-spacing: 0.3px;
  }
}

// Responsive Design
@media (max-width: 768px) {
  .hero-section {
    min-height: 30vh;
    padding: 30px 20px;
  }

  .hero-typing-text {
    font-size: 1.4rem !important;
    padding: 0 15px;
    min-height: 70px !important;

    .cursor {
      height: 1.4rem !important;
    }
  }

  .positioning-section {
    padding: 15px 20px;
  }

  .positioning-text {
    font-size: 0.9rem !important;

    .separator,
    .dot {
      display: none;
    }

    span {
      display: block;
      margin: 4px 0;
    }
  }

  .section-container {
    padding: 20px 20px;
  }

  .short-self p {
    font-size: 1rem !important;
    margin: 10px 0 !important;
  }

  .core-narrative {
    padding: 25px 20px;
  }

  .narrative-text {
    font-size: 1.05rem !important;
    padding-left: 20px !important;
    margin: 12px 0 !important;
  }

  .section-title {
    font-size: 1.5rem !important;
    margin-bottom: 20px !important;
  }

  .inspiration-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  .inspiration-card {
    padding: 20px 16px !important;
  }

  .code-poems-section {
    padding: 25px 20px;
    
    .poems-grid {
      max-width: 100%;
    }
  }

  .code-poem-card {
    padding: 16px !important;
    width: 85% !important;
    
    &.poem-right,
    &.poem-left {
      margin-left: auto !important;
      margin-right: auto !important;
    }
  }

  .poem-code {
    font-size: 0.9rem !important;
    padding: 14px !important;
  }

  .poem-arrow {
    height: 60px !important;
    margin-bottom: -10px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    justify-content: center !important;
    
    svg {
      width: 60px !important;
      height: 60px !important;
    }
  }

  .closing-section {
    padding: 20px 20px 15px !important;
  }

  .closing-line {
    font-size: 1.05rem !important;
    line-height: 1.7 !important;
    margin: 6px 0 !important;
  }

  .cta-section {
    padding: 18px 20px 15px !important;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 15px !important;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
