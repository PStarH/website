<template>
  <div class="article-research-section-mobile">
    <h2 :style="gradientStyle">Articles & Research</h2>
    <n-space vertical size="large">
      <div class="article-card-mobile">
        <div class="article-header-mobile">
          <div class="article-title-mobile"><b>Machine Learning & AI Research</b></div>
          <div class="article-date-mobile">2024</div>
        </div>
        <div class="article-content-mobile">
          <n-text :depth="3">
            Exploring deep learning architectures and their applications in natural language processing. 
            Focus on transformer models and attention mechanisms.
          </n-text>
        </div>
        <div class="article-tags-mobile">
          <n-tag type="info" size="small">ML</n-tag>
          <n-tag type="success" size="small">NLP</n-tag>
          <n-tag type="warning" size="small">DL</n-tag>
        </div>
      </div>
      
      <div class="article-card-mobile">
        <div class="article-header-mobile">
          <div class="article-title-mobile"><b>Algorithm Optimization</b></div>
          <div class="article-date-mobile">2023</div>
        </div>
        <div class="article-content-mobile">
          <n-text :depth="3">
            Research on advanced algorithm optimization strategies including dynamic programming 
            and graph algorithm improvements.
          </n-text>
        </div>
        <div class="article-tags-mobile">
          <n-tag type="primary" size="small">Algorithms</n-tag>
          <n-tag type="info" size="small">Optimization</n-tag>
        </div>
      </div>
      
      <div class="article-card-mobile">
        <div class="article-header-mobile">
          <div class="article-title-mobile"><b>Data Visualization</b></div>
          <div class="article-date-mobile">2023</div>
        </div>
        <div class="article-content-mobile">
          <n-text :depth="3">
            Comprehensive study on modern data visualization techniques and 
            interactive dashboard development.
          </n-text>
        </div>
        <div class="article-tags-mobile">
          <n-tag type="success" size="small">Data Science</n-tag>
          <n-tag type="warning" size="small">Viz</n-tag>
        </div>
      </div>
    </n-space>
    
    <div class="research-stats-mobile">
      <n-grid :cols="3" :x-gap="8" :y-gap="8">
        <n-gi>
          <div class="stat-card-mobile">
            <div class="stat-icon-mobile">📄</div>
            <div class="stat-value-mobile">12+</div>
            <div class="stat-label-mobile">Papers</div>
          </div>
        </n-gi>
        <n-gi>
          <div class="stat-card-mobile">
            <div class="stat-icon-mobile">🏆</div>
            <div class="stat-value-mobile">5</div>
            <div class="stat-label-mobile">Awards</div>
          </div>
        </n-gi>
        <n-gi>
          <div class="stat-card-mobile">
            <div class="stat-icon-mobile">👥</div>
            <div class="stat-value-mobile">8+</div>
            <div class="stat-label-mobile">Collabs</div>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'

const isDarkMode = inject('isDarkMode', ref(true))

const gradientStyle = computed(() => ({
  background: 'linear-gradient(90deg, #008CFF, #FF4D6D)',
  'background-clip': 'text',
  '-webkit-background-clip': 'text',
  color: 'transparent',
  '-webkit-text-fill-color': 'transparent'
}))
</script>

<style scoped>
.article-research-section-mobile {
  margin-bottom: 48px;
  padding: 0 16px;
}

.article-research-section-mobile h2 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 700;
  text-align: center;
}

.article-card-mobile {
  border-radius: 12px;
  padding: 16px;
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  transition: all 0.3s ease;
}

.article-card-mobile:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(0, 140, 255, 0.15);
}

.article-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 8px;
}

.article-title-mobile {
  font-size: 16px;
  color: var(--n-text-color);
  flex: 1;
  line-height: 1.4;
}

.article-date-mobile {
  font-size: 12px;
  color: var(--n-text-color-disabled);
  font-weight: 500;
  white-space: nowrap;
}

.article-content-mobile {
  margin-bottom: 12px;
  line-height: 1.5;
  font-size: 14px;
}

.article-tags-mobile {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.research-stats-mobile {
  margin-top: 24px;
  padding: 16px;
  background: var(--n-card-color);
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}

.stat-card-mobile {
  text-align: center;
  padding: 12px 8px;
  border-radius: 8px;
  background: var(--n-body-color);
  transition: all 0.3s ease;
}

.stat-card-mobile:active {
  transform: scale(0.95);
  background: var(--n-card-color);
}

.stat-icon-mobile {
  font-size: 20px;
  margin-bottom: 4px;
}

.stat-value-mobile {
  font-size: 16px;
  font-weight: 700;
  color: var(--n-primary-color);
  margin-bottom: 2px;
}

.stat-label-mobile {
  font-size: 11px;
  color: var(--n-text-color-disabled);
  font-weight: 500;
}

/* Touch-friendly interactions */
@media (hover: none) and (pointer: coarse) {
  .article-card-mobile:hover {
    transform: none;
    box-shadow: none;
  }
  
  .stat-card-mobile:hover {
    transform: none;
    background: var(--n-body-color);
  }
}
</style>
