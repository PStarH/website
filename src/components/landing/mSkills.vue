<template>
  <section class="skills-section" role="main" aria-label="Technical Skills">
    <div class="skills-container">
      <h2 class="section-title" id="skills-title">Skills</h2>
      <div class="skills-list">
        <div 
          v-for="(skill, index) in skills" 
          :key="index"
          class="skill-item"
          @click="toggleDetails(skill)"
          @keydown.enter="toggleDetails(skill)"
          @keydown.space.prevent="toggleDetails(skill)"
          tabindex="0"
          :aria-expanded="selectedSkill === skill"
          :aria-describedby="`skill-details-${index}`"
        >
          <div class="skill-header">
            <h3 class="skill-title">{{ skill.title }}</h3>
            <div class="skill-level" :aria-label="`Skill level: ${skill.level} percent`">{{ skill.level }}%</div>
          </div>
          <div class="skill-progress">
            <div class="progress-bar" role="progressbar" :aria-valuenow="skill.level" aria-valuemin="0" aria-valuemax="100">
              <div 
                class="progress-fill" 
                :style="{ width: skill.level + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Expandable Details -->
          <transition name="expand">
            <div v-if="selectedSkill === skill" class="skill-details" :id="`skill-details-${index}`">
              <p class="skill-description">{{ skill.description }}</p>
              <div class="skill-stats">
                <div class="stat-row">
                  <span class="stat-label">Experience:</span>
                  <span class="stat-value">{{ skill.experience }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Projects:</span>
                  <span class="stat-value">{{ skill.projects }}</span>
                </div>
              </div>
              <div class="skill-technologies">
                <h4>Technologies:</h4>
                <div class="tech-tags">
                  <span 
                    v-for="tech in skill.technologies" 
                    :key="tech" 
                    class="tech-tag"
                  >{{ tech }}</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const selectedSkill = ref(null)

const skills = ref([
  {
    title: 'JavaScript / TypeScript',
    level: 90,
    description: 'Expert in modern JavaScript and TypeScript development with extensive experience in both frontend and backend applications.',
    experience: '7+ years',
    projects: '50+',
    technologies: ['Vue.js', 'React', 'Node.js', 'Express', 'TypeScript', 'ES6+']
  },
  {
    title: 'React / NextJS',
    level: 85,
    description: 'Proficient in React ecosystem including Next.js, Redux, and modern React patterns for building scalable web applications.',
    experience: '5+ years',
    projects: '30+',
    technologies: ['React', 'Next.js', 'Redux', 'Context API', 'React Router', 'Hooks']
  },
  {
    title: 'C# / .NET',
    level: 80,
    description: 'Strong background in C# and .NET framework for enterprise applications and web services development.',
    experience: '4+ years',
    projects: '25+',
    technologies: ['ASP.NET Core', 'Entity Framework', 'Web API', 'Blazor', 'LINQ', 'Azure']
  },
  {
    title: 'Svelte',
    level: 75,
    description: 'Experience with Svelte framework for building fast and lightweight web applications with minimal boilerplate.',
    experience: '2+ years',
    projects: '15+',
    technologies: ['SvelteKit', 'Svelte Store', 'Vite', 'Rollup', 'CSS-in-JS']
  },
  {
    title: 'C++',
    level: 88,
    description: 'Advanced C++ programming for competitive programming, algorithms, and system-level applications.',
    experience: '6+ years',
    projects: '40+',
    technologies: ['STL', 'Boost', 'Qt', 'OpenGL', 'Algorithm Design', 'Data Structures']
  },
  {
    title: 'Objective-C',
    level: 60,
    description: 'iOS development experience using Objective-C for native mobile applications and frameworks.',
    experience: '2+ years',
    projects: '10+',
    technologies: ['UIKit', 'Core Data', 'Foundation', 'Cocoa Touch', 'Xcode', 'iOS SDK']
  },
  {
    title: 'Python',
    level: 85,
    description: 'Extensive Python experience in data science, machine learning, web development, and automation scripting.',
    experience: '5+ years',
    projects: '35+',
    technologies: ['Django', 'Flask', 'NumPy', 'Pandas', 'TensorFlow', 'PyTorch']
  },
  {
    title: 'Rust',
    level: 70,
    description: 'Systems programming with Rust for performance-critical applications and WebAssembly development.',
    experience: '2+ years',
    projects: '12+',
    technologies: ['Cargo', 'WebAssembly', 'Tokio', 'Serde', 'Actix', 'Tauri']
  },
  {
    title: 'Data Structure / Algorithms / ACM-ICPC',
    level: 92,
    description: 'Competitive programming expertise with strong algorithmic thinking and problem-solving skills.',
    experience: '8+ years',
    projects: '1000+ problems',
    technologies: ['Graph Theory', 'Dynamic Programming', 'Number Theory', 'Geometry', 'String Algorithms']
  },
  {
    title: 'Unity3D',
    level: 75,
    description: 'Game development using Unity3D for 2D and 3D games, VR experiences, and interactive applications.',
    experience: '3+ years',
    projects: '20+',
    technologies: ['C# Scripting', 'Shader Programming', 'Animation', 'Physics', 'UI/UX', 'Asset Store']
  }
])

const toggleDetails = (skill) => {
  if (selectedSkill.value === skill) {
    selectedSkill.value = null
  } else {
    selectedSkill.value = skill
  }
}
</script>

<style scoped>
.skills-section {
  padding: 2rem 0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.skills-container {
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

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.skill-item:hover,
.skill-item:focus {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
  outline: none;
}

.skill-item:focus {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 2px #667eea;
}

.skill-item:active {
  transform: scale(0.98);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.skill-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.skill-level {
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.skill-progress {
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
  transition: width 0.8s ease;
}

.skill-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.skill-description {
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.skill-stats {
  margin-bottom: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.stat-value {
  color: #667eea;
  font-weight: 600;
  font-size: 0.8rem;
}

.skill-technologies h4 {
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tech-tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Responsive Design */
@media (max-width: 480px) {
  .skills-container {
    padding: 0 0.75rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .skill-item {
    padding: 0.75rem;
  }
  
  .skill-title {
    font-size: 0.9rem;
  }
  
  .skill-level {
    font-size: 0.8rem;
  }
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .skill-item {
    transition: none;
  }
  
  .skill-item:hover,
  .skill-item:focus {
    transform: none;
    transition: box-shadow 0.3s ease;
  }
  
  .progress-fill {
    transition: none;
  }
  
  .expand-enter-active,
  .expand-leave-active {
    transition: none;
  }
}
</style>