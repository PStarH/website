<script setup>
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider
} from 'naive-ui';
import store from './store/store';
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import gsap from 'gsap'
import {
  SplitText,
  ScrollSmoother,
  ScrollTrigger,
  Draggable
} from 'gsap/all';
import { onMounted } from 'vue';

hljs.registerLanguage('cpp', cpp)

store.state.display.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

const themeOverrides = {
  common: {
    "primaryColor": "#4350FFFF",
    "primaryColorHover": "#747EFEFF",
    "primaryColorPressed": "#182084FF",
    "primaryColorSuppl": "#3B44BEFF",
  },
};

onMounted(() => {
  document.fonts.ready.then(() => {
    gsap.registerPlugin(Draggable, ScrollTrigger, ScrollSmoother);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const smoother = ScrollSmoother.create({
      smooth: prefersReducedMotion ? 0 : 2,
      smoothTouch: prefersReducedMotion ? 0 : 0.1,
      normalizeScroll: true
    });

    const track = document.querySelector('.scrollbar');
    const thumb = document.querySelector('.scrollbar-thumb');
    const maxY = () => track.clientHeight - thumb.clientHeight;

    let scrollTween = gsap.to(thumb, {
      y: maxY,
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
      }
    });

    Draggable.create('.scrollbar-thumb', {
      type: "y",
      bounds: {
        minY: 0,
        maxY: () => track.clientHeight - thumb.clientHeight
      },
      inertia: true,
      onPress() {
        scrollTween.scrollTrigger.disable(false);
      },
      onDrag() {
        let progress = gsap.utils.normalize(0, maxY(), this.y);
        let scrollEnd = scrollTween.scrollTrigger.end;
        smoother.scrollTo(scrollEnd * progress, true);
      },
      onRelease() {
        let progress = gsap.utils.normalize(0, maxY(), this.y);
        scrollTween.scrollTrigger.enable();
        scrollTween.progress(progress);
      },
      onRefresh() {
        this.applyBounds();
      }
    })[0];
  })
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :hljs="hljs">
    <n-dialog-provider>
      <n-message-provider>
        <div id="smooth-wrapper">
          <div class="scrollbar">
            <div class="scrollbar-thumb"></div>
          </div>
          <div id="smooth-content" class="app">
            <router-view />
          </div>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style lang="less">
@import "./style.css";

#app {
  margin: 0 auto;
  padding: 0;
}

#smooth-wrapper {
  position: relative;
}

#smooth-content {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.scrollbar {
  position: fixed;
  width: var(--scrollbar-width, 1rem);
  top: 1rem;
  bottom: 1rem;
  right: 0;
  background: transparent;
  z-index: 2;
}

.scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 60%;
  height: 0.3rem;
  background: #fff;
  transition: width .5s cubic-bezier(.215, .61, .355, 1);
  will-change: width;
  z-index: 3;
  cursor: grab;
  margin: 0 auto;

  &:hover,
  &:active {
    width: 100%
  }
}
</style>