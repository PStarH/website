<template>
  <div class="gramophone-wrapper">
    <div class="gramophone-scene">
      <!-- Floating Glass Planes (Deconstructed Base) -->
      <div class="glass-plane plane-1"></div>
      <div class="glass-plane plane-2"></div>
      <div class="glass-plane plane-3"></div>
      
      <!-- Main Player Assembly -->
      <div class="player-assembly">
        <!-- Base Plate -->
        <div class="base-plate"></div>
        
        <!-- Record Platter -->
        <div class="record-container" :class="{ 'is-playing': isPlaying }">
          <div class="record-vinyl">
            <div class="record-grooves"></div>
            <div class="record-label"></div>
            <div class="record-spindle"></div>
          </div>
        </div>

        <!-- Tonearm -->
        <div class="tonearm-assembly" :class="{ 'is-playing': isPlaying }">
          <div class="tonearm-pivot"></div>
          <div class="tonearm-rod"></div>
          <div class="tonearm-head"></div>
        </div>
      </div>

      <!-- Floating Abstract Elements -->
      <div class="floating-shard shard-1"></div>
      <div class="floating-shard shard-2"></div>
    </div>

    <!-- Controls -->
    <div class="controls-overlay">
      <button class="play-btn" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
        <span v-if="!isPlaying">▶</span>
        <span v-else>❚❚</span>
      </button>
    </div>
    
    <!-- Audio Element -->
    <audio ref="audioPlayer" src="/music.mp4" loop></audio>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const isPlaying = ref(false)
const audioPlayer = ref(null)

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
}

watch(isPlaying, (newValue) => {
  if (audioPlayer.value) {
    if (newValue) {
      audioPlayer.value.play().catch(e => {
        console.error("Audio play failed:", e)
        isPlaying.value = false // Revert if play fails (e.g. user interaction policy)
      })
    } else {
      audioPlayer.value.pause()
    }
  }
})
</script>

<style scoped>
.gramophone-wrapper {
  width: 100%;
  height: 500px; /* Increased height to prevent clipping */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible; /* Allow 3D elements to extend */
  background: transparent;
}

.gramophone-scene {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  transform: rotateX(55deg) rotateZ(45deg) translateZ(-50px);
  /* Removed hover transform to keep it static as requested */
}

/* --- Glass Planes (Deconstructed Look) --- */
.glass-plane {
  position: absolute;
  background: rgba(100, 150, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  transform-style: preserve-3d;
}

.plane-1 {
  width: 340px;
  height: 340px;
  top: -20px;
  left: -20px;
  transform: translateZ(-40px);
  background: rgba(50, 80, 150, 0.15);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}

.plane-2 {
  width: 300px;
  height: 300px;
  top: 0;
  left: 0;
  transform: translateZ(-20px);
  background: rgba(80, 120, 200, 0.1);
}

.plane-3 {
  width: 280px;
  height: 280px;
  top: 10px;
  left: 10px;
  transform: translateZ(0px); /* Main surface level */
  background: rgba(150, 200, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* --- Player Assembly --- */
.player-assembly {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: translateZ(10px);
}

/* --- Record --- */
.record-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%) translateZ(5px);
  transform-style: preserve-3d;
}

.record-vinyl {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  /* Bright orange/red gradient with conic section to show spin */
  background: conic-gradient(from 0deg, #ff3300, #ff6600, #cc2200, #ff3300);
  box-shadow: 
    0 0 15px rgba(255, 80, 0, 0.4),
    inset 0 0 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.is-playing .record-vinyl {
  animation: spin 2s linear infinite;
}

.record-grooves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    rgba(0, 0, 0, 0.1) 0, 
    rgba(0, 0, 0, 0.1) 2px, 
    transparent 3px, 
    transparent 4px
  );
  /* Add a shine effect */
  background-image: 
    repeating-radial-gradient(
      rgba(0, 0, 0, 0.1) 0, 
      rgba(0, 0, 0, 0.1) 2px, 
      transparent 3px, 
      transparent 4px
    ),
    linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
}

.record-label {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70px;
  height: 70px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #ff4400;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.record-spindle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #e0e0e0;
}

/* --- Tonearm --- */
.tonearm-assembly {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  transform: translateZ(50px) rotate(45deg); /* Higher Z, rotated away */
  transform-origin: 88px 12px; /* Pivot center */
  transition: transform 1s ease-in-out;
  pointer-events: none;
}

.tonearm-assembly.is-playing {
  /* Rotate counter-clockwise to move arm IN towards center */
  transform: translateZ(50px) rotate(-20deg);
}

.tonearm-pivot {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transform: translateZ(2px);
}

.tonearm-rod {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 140px;
  height: 6px;
  background: rgba(255, 255, 255, 0.95);
  transform-origin: right center;
  /* Removed individual rotation */
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.tonearm-head {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 36px;
  background: #222;
  transform-origin: right center;
  /* Fixed position relative to rod */
  transform: translateX(-135px) rotate(-10deg); 
  border-radius: 2px;
}

/* --- Floating Shards (Abstract Deconstruction) --- */
.floating-shard {
  position: absolute;
  background: rgba(150, 200, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);
  transform-style: preserve-3d;
}

.shard-1 {
  width: 60px;
  height: 200px;
  right: -40px;
  top: 50px;
  transform: rotateY(-90deg) translateZ(50px);
  background: linear-gradient(to bottom, rgba(100, 150, 255, 0.05), rgba(100, 150, 255, 0.2));
}

.shard-2 {
  width: 200px;
  height: 60px;
  top: -40px;
  left: 50px;
  transform: rotateX(90deg) translateZ(50px);
  background: linear-gradient(to right, rgba(100, 150, 255, 0.05), rgba(100, 150, 255, 0.2));
}

/* --- Controls --- */
.controls-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.play-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  font-size: 14px;
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
