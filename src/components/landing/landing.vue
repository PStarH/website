<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const roles = ref(['Full-stack Developer', 'AI Enthusiast', 'Data Analyst', 'NLP Developer', 'Creative Coder', 'Algorithm Designer', 'Automation Guru'])
const currentRoleIndex = ref(0)
const typedText = ref('')
const showCursor = ref(true)
const isDarkMode = inject('isDarkMode', ref(true))

const skills = ref([
  { name: 'Full-stack Developer', type: 'info' },
  { name: 'AI Enthusiast', type: 'success' },
  { name: 'Data Analyst', type: 'warning' },
  { name: 'Innovator', type: 'primary' }
])

const techStack = [
  // Frontend Core & UI Frameworks
  {
    name: 'Vue.js',
    icon: 'logos:vue',
    category: 'frontend'
  },
  {
    name: 'React',
    icon: 'logos:react',
    category: 'frontend'
  },
  {
    name: 'Next.js',
    icon: 'logos:nextjs-icon',
    category: 'frontend'
  },
  {
    name: 'Nuxt.js',
    icon: 'logos:nuxt-icon',
    category: 'frontend'
  },

  // UI Libraries
  {
    name: 'Tailwind CSS',
    icon: 'logos:tailwindcss-icon',
    category: 'frontend'
  },
  {
    name: 'Naive UI',
    icon: 'logos:naiveui',
    category: 'frontend'
  },
  {
    name: 'Element Plus',
    icon: 'logos:element',
    category: 'frontend'
  },
  {
    name: 'Element UI',
    icon: 'logos:element',
    category: 'frontend'
  },

  // Frontend Tools
  {
    name: 'Vite',
    icon: 'logos:vitejs',
    category: 'frontend'
  },
  {
    name: 'Vercel',
    icon: 'logos:vercel-icon',
    category: 'frontend'
  },

  // Backend
  {
    name: 'Node.js',
    icon: 'logos:nodejs-icon',
    category: 'backend'
  },
  {
    name: 'Django',
    icon: 'logos:django-icon',
    category: 'backend'
  },
  {
    name: 'FastAPI',
    icon: 'simple-icons:fastapi',
    category: 'backend'
  },
  {
    name: 'Flask',
    icon: 'logos:flask',
    category: 'backend'
  },
  {
    name: 'Spring Boot',
    icon: 'logos:spring-icon',
    category: 'backend'
  },
  {
    name: '.NET Core',
    icon: 'logos:dotnet',
    category: 'backend'
  },

  // Databases
  {
    name: 'MongoDB',
    icon: 'logos:mongodb-icon',
    category: 'database'
  },
  {
    name: 'MySQL',
    icon: 'logos:mysql',
    category: 'database'
  },
  {
    name: 'SQLite',
    icon: 'logos:sqlite',
    category: 'database'
  },
  {
    name: 'Redis',
    icon: 'logos:redis',
    category: 'database'
  },
  {
    name: 'Elasticsearch',
    icon: 'logos:elasticsearch',
    category: 'database'
  },

  // DevOps & Cloud
  {
    name: 'Docker',
    icon: 'logos:docker-icon',
    category: 'devops'
  },
  {
    name: 'Git',
    icon: 'logos:git-icon',
    category: 'devops'
  },
  {
    name: 'GitHub Actions',
    icon: 'logos:github-actions',
    category: 'devops'
  },
  {
    name: 'Azure',
    icon: 'logos:microsoft-azure',
    category: 'devops'
  },
  {
    name: 'Alibaba Cloud',
    icon: 'simple-icons:alibabacloud',
    category: 'devops'
  },
  {
    name: 'Nginx',
    icon: 'logos:nginx',
    category: 'devops'
  },

  // Development Tools
  {
    name: 'VS Code',
    icon: 'logos:visual-studio-code',
    category: 'tools'
  },
  {
    name: 'PyCharm',
    icon: 'logos:pycharm',
    category: 'tools'
  },
  {
    name: 'CLion',
    icon: 'logos:clion',
    category: 'tools'
  },
  {
    name: 'DataSpell',
    icon: 'logos:dataspell',
    category: 'tools'
  },
  {
    name: 'DataGrip',
    icon: 'logos:datagrip',
    category: 'tools'
  },
  {
    name: 'Postman',
    icon: 'logos:postman-icon',
    category: 'tools'
  },
  // Programming Languages
  {
    name: 'Python',
    icon: 'logos:python',
    category: 'language'
  },
  {
    name: 'TypeScript',
    icon: 'logos:typescript-icon',
    category: 'language'
  },
  {
    name: 'JavaScript',
    icon: 'logos:javascript',
    category: 'language'
  },
  {
    name: 'Java',
    icon: 'logos:java',
    category: 'language'
  },
  {
    name: 'C++',
    icon: 'logos:c-plusplus',
    category: 'language'
  },
  {
    name: 'C#',
    icon: 'logos:c-sharp',
    category: 'language'
  },
  {
    name: 'Rust',
    icon: 'logos:rust',
    category: 'language'
  },
  {
    name: 'Selenium',
    icon: 'logos:selenium',
    category: 'testing'
  },

  // Data Science & AI
  {
    name: 'TensorFlow',
    icon: 'logos:tensorflow',
    category: 'ai'
  },
  {
    name: 'PyTorch',
    icon: 'logos:pytorch-icon',
    category: 'ai'
  },
  {
    name: 'Scikit-learn',
    icon: 'vscode-icons:file-type-python',
    category: 'ai'
  },
  {
    name: 'OpenAI',
    icon: 'simple-icons:openai',
    category: 'ai'
  },
  {
    name: 'Anthropic',
    icon: 'logos:anthropic',
    category: 'ai'
  },
  {
    name: 'Hugging Face',
    icon: 'simple-icons:huggingface',
    category: 'ai'
  },
  {
    name: 'LangChain',
    icon: 'ph:robot-bold',
    category: 'ai'
  },
  {
    name: 'CUDA',
    icon: 'simple-icons:nvidia',
    category: 'ai'
  },
  {
    name: 'MLflow',
    icon: 'simple-icons:mlflow',
    category: 'ai'
  },

  // Data Engineering & Analytics
  {
    name: 'Pandas',
    icon: 'simple-icons:pandas',
    category: 'data'
  },
  {
    name: 'NumPy',
    icon: 'logos:numpy',
    category: 'data'
  },
  {
    name: 'Jupyter',
    icon: 'logos:jupyter',
    category: 'data'
  },

  // Development Tools
  {
    name: 'Xcode',
    icon: 'logos:xcode',
    category: 'tools'
  },
  {
    name: 'Android Studio',
    icon: 'logos:android-icon',
    category: 'tools'
  },

  // Data Science & Tools
  {
    name: 'Anaconda',
    icon: 'simple-icons:anaconda',
    category: 'data'
  },

  // AI Tools
  {
    name: 'Ollama',
    icon: 'carbon:machine-learning',
    category: 'ai'
  },

  // Programming Languages
  {
    name: 'HTML',
    icon: 'logos:html-5',
    category: 'language'
  },
  {
    name: 'CSS',
    icon: 'logos:css-3',
    category: 'language'
  },

  // Data Science & AI
  {
    name: 'spaCy',
    icon: 'simple-icons:spacy',
    category: 'ai'
  },
  {
    name: 'OpenCV',
    icon: 'simple-icons:opencv',
    category: 'ai'
  },

]

const categories = [
  { name: 'Frontend & UI', id: 'frontend' },
  { name: 'Backend & Databases', id: ['backend', 'database'] },
  { name: 'DevOps & Tools', id: ['devops', 'tools'] },
  { name: 'Languages & Testing', id: ['language', 'testing'] },
  { name: 'AI, ML & Data', id: ['ai', 'data'] }
]

onMounted(() => {
  typeNextRole()
  setInterval(() => {
    showCursor.value = !showCursor.value
  }, 500)
})

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
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
}))
</script>

<template>
  <div class="homepage">
    <n-grid :cols="24" :x-gap="24">
      <n-gi :span="16">
        <div class="intro">
          <h1 class="name" :style="gradientStyle">Hello, I'm Xinghan Pan!</h1>
          <div class="role-container">
            <span class="role">I'm a </span>
            <span class="typed-role">{{ typedText }}<span class="cursor"
                :class="{ 'cursor-visible': showCursor }">|</span></span>
          </div>
          <p class="description">
            Currently studying at Shenzhen College of International Education, I'm a passionate computer science student
            dedicated to learning algorithms and exploring the frontiers of artificial intelligence. My drive to
            innovate
            in these fields makes me eager to contribute to and thrive in small but impactful projects.
          </p>
        </div>
      </n-gi>
      <n-gi :span="8">
        <n-flex :justify="'end'">
          <n-avatar :size="289" :src="`/website/images/landingAvatar.jpg`" round class="avatar" />
        </n-flex>
      </n-gi>
    </n-grid>
    <n-tag v-for="skill in skills" :key="skill.name" :type="skill.type" class="skill-tag">
      <template #icon>
        <n-icon :component="ChevronRight" />
      </template>
      {{ skill.name }}
    </n-tag>
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
</template>

<style scoped>
.homepage {
  padding: 48px 24px;
  max-width: 1080px;
  margin: 24px 0;
  flex: 1;
  padding: 24 px 0;
  margin: 0 auto;
  width: 100%;
}

.intro {
  margin-bottom: 48px;
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

.description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: v-bind("isDarkMode ? '#E0E0E0' : '#333333'");
}

.skills {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.skill-tag {
  font-size: 14px;
}

.avatar {
  transition: transform 0.3s ease-in-out;
}

.avatar:hover {
  transform: scale(1.05);
}

.projects-section {
  margin-top: 64px;
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
  margin-bottom: 24px;
}

.tech-stack h3 {
  font-size: 20px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #008CFF, #FF4D6D);
  -webkit-background-clip: text;
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
  .homepage {
    padding: 24px 16px;
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

  .skills {
    flex-wrap: wrap;
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
}
</style>
