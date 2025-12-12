<script setup>
import { ref, onMounted, onUnmounted, inject, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'vue-router'
import Lenis from 'lenis'
import Gramophone from './Gramophone.vue'

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

// Inspiration sources
const inspirationSources = ref([
  {
    title: 'Philosophy',
    subtitle: 'Ockham, Stoic, Kantian',
    description: 'The lens through which I stress-test my designs.',
    icon: '📚'
  },
  {
    title: 'History',
    subtitle: 'Thucydides, Institutional Cycles',
    description: 'The framework I use to gauge longevity.',
    icon: '📜'
  },
  {
    title: 'Art & Nature',
    subtitle: 'Minimalist music, fractals, swarms',
    description: 'My muse for finding structure and rhythm.',
    icon: '🎵'
  }
])

// Working method steps
const workingSteps = ref([
  {
    number: 1,
    text: 'Distill the problem into a single, potent sentence.'
  },
  {
    number: 2,
    text: 'Craft a minimal, functional prototype to test its soul.'
  },
  {
    number: 3,
    text: 'Iterate with data and human feedback until it tells a clear story.'
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

  heroTypingInterval = setInterval(() => {
    if (charIndex < currentLine.length) {
      typedHeroText.value += currentLine[charIndex]
      charIndex++
    } else {
      clearInterval(heroTypingInterval)

      // Wait before starting fade out
      heroTimeout = setTimeout(() => {
        gsap.to('.hero-typing-text', {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            currentHeroLine.value = (currentHeroLine.value + 1) % heroLines.length

            // Wait a moment before typing next line
            setTimeout(() => {
              gsap.to('.hero-typing-text', {
                opacity: 1,
                duration: 0.5,
                onComplete: typeHeroLine
              })
            }, 1000)
          }
        })
      }, 3000)
    }
  }, 50)
}

// Cursor blink
const startCursorBlink = () => {
  setInterval(() => {
    showHeroCursor.value = !showHeroCursor.value
  }, 530)
}

// Initialize animations
onMounted(async () => {
  await nextTick()

  // Initialize Lenis for mobile
  lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 2,
    infinite: false,
    wheelMultiplier: 1.0,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // Start hero typing animation
  typeHeroLine()
  startCursorBlink()

  // Animate positioning text
  gsap.from('.positioning-text', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 1,
    scrollTrigger: {
      trigger: '.positioning-section',
      start: 'top 80%',
    }
  })

  // Animate short self section
  gsap.from('.short-self p', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.short-self',
      start: 'top 70%',
    }
  })

  // Animate gramophone
  gsap.from('.gramophone-section', {
    opacity: 0,
    y: 30,
    duration: 1,
    scrollTrigger: {
      trigger: '.gramophone-section',
      start: 'top 70%',
    }
  })

  // Animate core narrative paragraphs
  gsap.from('.narrative-text', {
    opacity: 0,
    y: 40,
    duration: 1.2,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.core-narrative',
      start: 'top 60%',
    }
  })

  // Animate inspiration cards
  gsap.from('.inspiration-card', {
    opacity: 0,
    scale: 0.9,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.inspiration-section',
      start: 'top 70%',
    }
  })

  // Animate code poems
  gsap.from('.code-poem-card', {
    opacity: 0,
    x: -50,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.code-poems-section',
      start: 'top 70%',
    }
  })

  // Animate working method cards
  gsap.from('.method-card', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.working-method-section',
      start: 'top 70%',
    }
  })

  // Animate closing invitation
  gsap.from('.closing-text', {
    opacity: 0,
    scale: 0.95,
    duration: 1.5,
    scrollTrigger: {
      trigger: '.closing-section',
      start: 'top 70%',
    }
  })

  // Animate CTA buttons
  gsap.from('.cta-button', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
    }
  })
})

onUnmounted(() => {
  // Clear intervals and timeouts
  if (heroTypingInterval) clearInterval(heroTypingInterval)
  if (heroTimeout) clearTimeout(heroTimeout)
  
  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  
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
  <div class="code-poet-about mobile" :class="{ 'dark-mode': isDarkMode }">

    <!-- 1. Hero Section with Typing Animation -->
    <section class="hero-section">
      <div class="particles-bg"></div>
      <div class="hero-content">
        <div class="hero-typing-text">
            {{ typedHeroText }}<span class="cursor" :class="{ 'blink': showHeroCursor }">|</span>
          </div>
        </div>
      </section>

      <!-- 2. Top Micro-Positioning -->
      <section class="positioning-section">
        <div class="positioning-text">
          <div class="name">Xinghan Pan</div>
          <div class="title">Code Poet</div>
          <div class="subtitle">Grounded in Philosophy & History</div>
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
        <div class="narrative-text">I am both an engineer and a thinker.</div>
        <div class="narrative-text">When I code, I treat problems as propositions and constraints as poetic meter.</div>
        <div class="narrative-text">History teaches me to see a system's lifespan; philosophy compels me to ask "should we?";</div>
        <div class="narrative-text">poetry shows me how to capture a truth with the fewest words.</div>
        <div class="narrative-text">My projects are not technological demonstrations, but vessels for posing questions, probing ethics, and leaving room for imagination.</div>
        <div class="narrative-text">When I build a privacy tool, I am preserving civic dignity.</div>
        <div class="narrative-text">When I architect a distributed system, I am contemplating the flow of power.</div>
        <div class="narrative-text">My goal is simple: to use technology to ask questions that endure, not to chase what fades.</div>
        <div class="narrative-footnote">"Every project is a thought experiment."</div>
      </section>

      <!-- 5. Source Code of Inspiration -->
      <section class="inspiration-section section-container">
        <h2 class="section-title">Source Code of Inspiration</h2>
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

      <!-- 6. How to Read My Projects -->
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

      <!-- 7. Code Poems -->
      <section class="code-poems-section section-container">
        <h2 class="section-title">Code Poems</h2>
        <div class="poems-grid">
          <div
            v-for="(poem, index) in codePoems"
            :key="poem.title"
            class="code-poem-card"
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
        </div>
      </section>

      <!-- 8. My Way of Working -->
      <section class="working-method-section section-container">
        <h2 class="section-title">My Method: Thought → Prototype → Story</h2>
        <div class="method-grid">
          <div
            v-for="step in workingSteps"
            :key="step.number"
            class="method-card"
          >
            <div class="method-number">{{ step.number }}</div>
            <p class="method-text">{{ step.text }}</p>
          </div>
        </div>
      </section>

      <!-- 9. Closing Invitation -->
      <section class="closing-section section-container">
        <div class="closing-text">
          <p>I am writing my next chapter, still searching for new light.</p>
          <p>If you, too, believe technology is a vessel for profound thought,</p>
          <p>let us write the next line, together.</p>
        </div>
      </section>

      <!-- Gramophone Visual -->
      <section class="gramophone-section section-container">
        <Gramophone />
      </section>

      <!-- 10. CTA Section -->
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

.code-poet-about.mobile {
  min-height: 100vh;
  background: v-bind("isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'");
  color: v-bind("isDarkMode ? '#e8e8e8' : '#2c3e50'");
  overflow-x: hidden;
  padding-bottom: 150px; /* Ensure footer is reachable */
}

// Hero Section
.hero-section {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'");
  overflow: hidden;
  padding: 0 20px;

  .particles-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(0, 140, 255, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 77, 109, 0.08) 0%, transparent 50%);
    animation: particleFloat 20s infinite ease-in-out;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .hero-typing-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    line-height: 1.8;
    font-weight: 400;
    text-align: center;
    background: linear-gradient(90deg, #008CFF, #FF4D6D);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.3px;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;

    .cursor {
      display: inline-block;
      width: 2px;
      height: 1.3rem;
      background: linear-gradient(180deg, #008CFF, #FF4D6D);
      margin-left: 3px;
      opacity: 1;

      &.blink {
        opacity: 0;
      }
    }
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
  padding: 30px 20px;
  text-align: center;

  .positioning-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: v-bind("isDarkMode ? '#cbd5e1' : '#64748b'");
    letter-spacing: 0.5px;

    div {
      margin: 8px 0;
    }

    .name {
      font-weight: 600;
      font-size: 1.1rem;
      color: v-bind("isDarkMode ? '#f1f5f9' : '#1e293b'");
    }

    .title {
      font-weight: 500;
      font-size: 1rem;
      background: linear-gradient(90deg, #008CFF, #FF4D6D);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-weight: 300;
      font-size: 0.85rem;
      color: v-bind("isDarkMode ? '#94a3b8' : '#64748b'");
    }
  }
}

// Section Container
.section-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
}

// Short Self Section
.short-self {
  p {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    line-height: 1.9;
    font-weight: 300;
    text-align: center;
    color: v-bind("isDarkMode ? '#e2e8f0' : '#475569'");
    margin: 15px 0;
  }
}

// Core Narrative Section
.core-narrative {
  .narrative-text {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    line-height: 2;
    font-weight: 400;
    color: v-bind("isDarkMode ? '#f8fafc' : '#334155'");
    margin: 20px 0;
    padding-left: 15px;
    text-align: left;
  }

  .narrative-footnote {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-style: italic;
    background: linear-gradient(90deg, #008CFF, #FF4D6D);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.2)' : 'rgba(0, 140, 255, 0.15)'");
  }
}

// Gramophone Section
.gramophone-section {
  padding: 30px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

// Section Title
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// Inspiration Section
.inspiration-section {
  .inspiration-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .inspiration-card {
    background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'");
    border: 1px solid rgba(0, 140, 255, 0.3);
    border-radius: 12px;
    padding: 25px 18px;
    text-align: center;
    backdrop-filter: blur(10px);

    .card-icon {
      font-size: 2.3rem;
      margin-bottom: 12px;
    }

    .card-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 6px;
      background: linear-gradient(90deg, #008CFF, #FF4D6D);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .card-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 400;
      color: v-bind("isDarkMode ? '#94a3b8' : '#64748b'");
      margin-bottom: 12px;
    }

    .card-description {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: v-bind("isDarkMode ? '#cbd5e1' : '#475569'");
    }
  }
}

// Read Projects Section
.read-projects-section {
  background: v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.05)' : 'rgba(0, 140, 255, 0.03)'");
  border: 1px solid rgba(0, 140, 255, 0.2);
  border-radius: 12px;

  .read-content {
    .read-text {
      h2 {
        text-align: center;
        margin-bottom: 25px;
      }

      p {
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        line-height: 1.9;
        color: v-bind("isDarkMode ? '#e2e8f0' : '#475569'");
        margin: 15px 0;
        text-align: center;
      }
    }
  }
}

// Code Poems Section
.code-poems-section {
  .poems-grid {
    display: grid;
    gap: 20px;
  }

  .code-poem-card {
    background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
    border: 1px solid rgba(0, 140, 255, 0.25);
    border-radius: 12px;
    padding: 18px;

    .poem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .poem-title {
        font-family: 'Fira Code', monospace;
        font-size: 0.95rem;
        background: linear-gradient(90deg, #008CFF, #FF4D6D);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
      }

      .copy-button {
        background: rgba(0, 140, 255, 0.1);
        border: 1px solid rgba(0, 140, 255, 0.3);
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 0.85rem;
        cursor: pointer;
        color: v-bind("isDarkMode ? '#cbd5e1' : '#64748b'");

        &.copied {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.6);
          color: #86efac;
        }
      }
    }

    .poem-code {
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      color: v-bind("isDarkMode ? '#e2e8f0' : '#334155'");
      background: v-bind("isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.04)'");
      border: 1px solid v-bind("isDarkMode ? 'rgba(0, 140, 255, 0.15)' : 'rgba(0, 140, 255, 0.1)'");
      border-radius: 8px;
      padding: 14px;
      overflow-x: auto;
      margin-bottom: 10px;

      code {
        white-space: pre;
      }
    }

    .poem-caption {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      font-style: italic;
      color: v-bind("isDarkMode ? '#94a3b8' : '#64748b'");
      text-align: right;
    }
  }
}

// Working Method Section
.working-method-section {
  background: v-bind("isDarkMode ? 'rgba(255, 77, 109, 0.05)' : 'rgba(255, 77, 109, 0.03)'");
  border: 1px solid rgba(255, 77, 109, 0.2);
  border-radius: 12px;

  .method-grid {
    display: grid;
    gap: 18px;
  }

  .method-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: v-bind("isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'");
    border: 1px solid rgba(0, 140, 255, 0.25);
    border-radius: 12px;
    padding: 22px 18px;
    text-align: center;

    .method-number {
      font-family: 'Playfair Display', serif;
      font-size: 2.3rem;
      font-weight: 700;
      background: linear-gradient(180deg, #008CFF, #FF4D6D);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .method-text {
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: v-bind("isDarkMode ? '#e2e8f0' : '#475569'");
    }
  }
}

// Closing Section
.closing-section {
  text-align: center;
  padding: 50px 20px;

  .closing-text {
    p {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      line-height: 1.9;
      font-weight: 400;
      background: linear-gradient(90deg, #008CFF, #FF4D6D);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 12px 0;
    }
  }
}

// CTA Section
.cta-section {
  text-align: center;
  padding-bottom: 50px;

  .cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 35px;
  }

  .cta-button {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    padding: 14px 28px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
    font-weight: 500;
    width: 100%;

    .arrow {
      transition: transform 0.3s ease;
    }

    &.primary {
      background: linear-gradient(90deg, #008CFF, #FF4D6D);
      color: white;
      border: none;
    }

    &.secondary {
      background: transparent;
      border: 2px solid #008CFF;
      color: #008CFF;
    }
  }

  .footer-signature {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 300;
    color: v-bind("isDarkMode ? '#64748b' : '#94a3b8'");
    letter-spacing: 0.5px;
  }
}
</style>
