<template>
    <div class="container">
      <h1 class="title">Competition Progresses</h1>
  
      <div class="slider-container">
        <transition name="fade" mode="out-in">
          <div :key="currentIndex" class="slide">
            <div class="image-container">
              <img
                :src="competitions[currentIndex].image"
                :alt="competitions[currentIndex].title"
                class="slide-image"
              />
              <div class="image-overlay"></div>
            </div>
            <div class="slide-content">
              <div class="subtitle-container">
                <h3 class="slide-subtitle">{{ competitions[currentIndex].subtitle }}</h3>
                <img :src="competitions[currentIndex].icon" :alt="competitions[currentIndex].title + ' icon'" class="slide-icon" />
              </div>
              <p class="achievement">{{ competitions[currentIndex].achievement }}</p>
              <p class="description">{{ competitions[currentIndex].description }}</p>
              <button
                v-if="competitions[currentIndex].downloadLink"
                class="download-button"
                @click="openLink(competitions[currentIndex].downloadLink)"
              >
                Revision Pack Download Link
              </button>
            </div>
          </div>
        </transition>
        <button @click="prevSlide" class="nav-button prev-button">‹</button>
        <button @click="nextSlide" class="nav-button next-button">›</button>
      </div>
  
      <div class="dots-container">
        <button
          v-for="(_, index) in competitions"
          :key="index"
          @click="currentIndex = index"
          class="dot-button"
          :class="{ active: currentIndex === index }"
        ></button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'

  const competitions = ref([
    {
      title: 'AMC12',
      subtitle: 'AMC12',
      icon: '/website/images/AMCIcon.png',
      image: '/website/images/AMC1.jpg',
      achievement: 'Achieved Honor Roll of Distinction in 2023 AMC12B with the score of 144 out of 150',
      description: 'Improved from initial challenges in AMC10 to achieving Honor Roll of Distinction in AMC12B. Focused on enhancing time management and maintaining composure during exams. Systematic preparation included regular practice tests, group study, and utilizing various resources.',
      downloadLink: 'https://pan.baidu.com/s/1ha8qqiRw-FattYG8qPQfQQ/?pwd=mkp4',
    },
    {
      title: 'AIME',
      subtitle: 'AIME',
      icon: '/website/images/AMCIcon.png',
      image: '/website/images/AIME.jpg',
      achievement: 'Achieved 11 out of 15 in 2024 AIME II',
      description: 'Followed a structured plan to prepare for AIME, aiming for USA(J)MO qualification. Built a strong foundation through camps, online lectures, and advanced topic study. Practiced regularly with increasing frequency, diversifying problem-solving skills across various math competitions.',
    },
    {
      title: 'BPhO',
      subtitle: 'BPhO',
      icon: '/website/images/bphoicon.png',
      image: '/website/images/bpho.jpg',
      achievement: 'Achieved Silver Award in the Intermediate Physic Challenge',
      description: 'Inspired by an enthusiastic middle school physics teacher, developed a strong interest in the subject. Unexpectedly participated in the British Physics Olympiad during Grade 9 after seeing a poster, approaching it with curiosity and adventure, resulting in a Silver Award.',
    },
  ])
  
  const currentIndex = ref(0)
  
  const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % competitions.value.length
  }
  
  const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + competitions.value.length) % competitions.value.length
  }
  
  const openLink = (url) => {
    window.open(url, '_blank')
  }
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    padding: 2rem 1rem;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .slider-container {
    position: relative;
    max-width: 42rem;
    margin: 0 auto;
  }
  
  .slide {
    background-color: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .image-container {
    position: relative;
    height: 18rem;
  }
  
  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  .image-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  .slide-title {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
    padding: 0 1rem;
  }
  
  .slide-content {
    padding: 1.5rem;
  }
  
  .subtitle-container {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .slide-subtitle {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-right: 1rem;
  }
  
  .slide-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .achievement {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .description {
    font-size: 0.875rem;
    color: #4b5563;
    margin-bottom: 1rem;
  }
  
  .download-button {
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    transition: background-color 0.3s;
    border: none;
    cursor: pointer;
  }
  
  .download-button:hover {
    background-color: #2563eb;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.5);
    color: #1f2937;
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 1.25rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }
  
  .prev-button {
    left: 0;
  }
  
  .next-button {
    right: 0;
  }
  
  .dots-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .dot-button {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #d1d5db;
    margin: 0 0.25rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .dot-button.active {
    background-color: #3b82f6;
    transform: scale(1.25);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @media (min-width: 640px) {
    .container {
      padding: 2rem 1.5rem;
    }
  
    .image-container {
      height: 24rem;
    }
  
    .slide-title {
      font-size: 2.25rem;
    }
  
    .slide-content {
      padding: 1.5rem;
    }
  
    .slide-subtitle {
      font-size: 1.5rem;
    }
  
    .slide-icon {
      width: 2.5rem;
      height: 2.5rem;
    }
  
    .achievement {
      font-size: 1.125rem;
    }
  
    .description {
      font-size: 1rem;
    }
  
    .download-button {
      font-size: 1rem;
      padding: 0.625rem 1.25rem;
    }
  
    .nav-button {
      padding: 0.5rem 0.75rem;
      font-size: 1.5rem;
    }
  }
  </style>