<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    NButton, NFlex, NEllipsis, NImage
} from 'naive-ui';

const AMCimages = [
    '/website/images/AMC1.jpg',
    '/website/images/AMC2.jpg',
    '/website/images/AMC3.jpg',
    '/website/images/AMC4.jpg'
];
const currentIndex = ref(0);
const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % AMCimages.length;
};

// Function to move to the previous slide
const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + AMCimages.length) % AMCimages.length;
};

// Computed property to get the current image
const currentImage = computed(() => AMCimages[currentIndex.value]);


</script>

<template>
    <div class="body">
        <div class="sheading" style="font-size: 2rem;">Competition Progresses</div>
        <n-flex>
            <div class="sheading">AMC12</div>
            <img src="/website/images/AMCIcon.png" alt="" style="max-width: 48px;">
        </n-flex>
        <div><b style="font-size: 15px;">2023 AMC12B: <br> Honor Roll of Distinction <br> 144 out of
                150</b></div>
        <div class="content-container">
            <n-flex>
                <n-ellipsis style="width: 400px; padding-right: 25px;" expand-trigger="click" :line-clamp="5"
                    :tooltip="false">
                    My experience for the AMC contest is full of twist and turns. ÍThe first time I participate in
                    AMC
                    is in
                    2022, where I participated the AMC10 contest of the year. I did well in practice before the
                    test;
                    however, I didn't performed well in the actual test due to nervousness and unpreparedness to the
                    time
                    restriction. In 2023, after that experience, I took a step back to analyze what went wrong. It
                    became
                    clear that while my theoretical knowledge was solid, I needed to improve my test-taking skills,
                    especially in managing time and staying calm under pressure. I decided to take a systematic
                    approach
                    to
                    addressing these issues. I began taking past AMC12 papers and similar problem for other contest
                    under
                    timed conditions weekly and increased the frequency as the exam approached. I also reviewed my
                    mistakes
                    thoroughly to target my weaknesses, joined a study group to discuss problems and strategies with
                    classmates, and utilized additional resources like online forums and workshops. By the time the
                    2023
                    AMC12 rolled around, I felt much more prepared. My practice had paid off, and I was able to
                    apply
                    the
                    strategies I had developed. The test experience was markedly different from my first attempt; I
                    managed
                    my time efficiently, approached each problem with confidence, and maintained my composure
                    throughout.
                    The result was an Honor Roll of Distinction, which was a gratifying acknowledgment of my hard
                    work
                    and
                    improvement. Through this experience, I've gain experience on how to prepare for exams and this
                    made
                    me
                    to prepare better for future exams.

                </n-ellipsis>
                <div class="carousel">
                    <button @click="prevSlide" class="carousel-control prev">‹</button>
                    <n-image style="width:300px" :src="currentImage" class="carousel-img" alt="AMC Image"/>
                    <button @click="nextSlide" class="carousel-control next">›</button>
                </div>

            </n-flex>
        </div>
        <div>
            <n-button style="border: 2px; border-radius: 10px; border-color: bisque;" tag="a"
                href="https://pan.baidu.com/s/1ha8qqiRw-FattYG8qPQfQQ/?pwd=mkp4" target="_blank" secondary strong round>
                {{ "Revision Pack Download Link" }}
            </n-button>
        </div>
        <n-flex style="width: 300px;">
            <div class="sheading">AIME</div>
            <img src="/website/images/AMCIcon.png" alt="" style="max-width: 48px;">
        </n-flex>
        <div style="width: 800px;"><b style="font-size: 17px;">Achieved 11 out of 15 in 2024 AIME II </b></div>
        <n-flex style="align-items: center;">
            <n-ellipsis style="width: 750px;" :tooltip="false" expand-trigger="click" line-clamp="5">
                To prepare for the AIME, I followed a structured and strategic plan outlined in the provided document. I
                started by understanding my preparation stage and setting clear goals, aiming to qualify for USA(J)MO.
                Throughout the summer and fall, I built a strong mathematical foundation by attending camps, engaging in
                online lectures, and studying advanced topics. Initially, I practiced AIME problems once a week,
                gradually increasing the frequency to every three days as the exam approached. Beyond AIME, I
                diversified my problem-solving skills by tackling problems from other contests like HMMT, PUMAC, CMIMC,
                and ARML, ensuring a broad and deep understanding of mathematical concepts. In the final weeks, I
                intensified my practice with more frequent timed sessions, participated in mock exams, and devised a
                clear test-day strategy. Utilizing resources like AoPS books, handouts, and mock contests, I maintained
                consistency and persistence, ensuring I was well-prepared and confident on the exam day. </n-ellipsis>
        </n-flex>
        <div style="text-align: center;"><n-image width="300" src="/website/images/AIME.jpg"></n-image></div>

        <n-flex style="width: 300px;">
            <div class="sheading">BPhO</div>
            <img src="/website/images/bphoicon.png" alt="" style="max-width: 150px;">
        </n-flex>
        <div style="width: 800px;"><b style="font-size: 17px;">Silver Award in the Intermediate Physic
                Challenge</b></div>
        <n-flex style="align-items: center;">
            <n-ellipsis style="width: 750px;" :tooltip="false" expand-trigger="click" line-clamp="5">
                In middle school, my physics teacher made every lesson feel like an adventure. He wasn't just a teacher;
                he was also a kind friend who went beyond the curriculum to connect with us on a personal level. His
                enthusiasm for physics was infectious and made my curiosity in the subject soar. I found myself eagerly
                looking forward to each class, not because I had to, but because I wanted to. He had a unique way of
                turning complex concepts into engaging stories, making physics incredibly fascinating and relatable.
                Despite my newfound interest, I wasn't preparing for any major competitions like the British Physics
                Olympiad (BPhO). One day during my Grade 9 year, I was walking past the physics faculty's office when a
                brightly colored poster caught my eye. It was an announcement for an upcoming physics competition. The
                idea of testing my knowledge and skills intrigued me, so I decided to sign up, even though I had never
                considered myself particularly competitive in academics. I approached the registration with a sense of
                adventure, much like the way my teacher had taught me to approach physics itself. Unexpectedly, I won
                the
                silver award.
            </n-ellipsis>
        </n-flex>
        <div style="text-align: center;"> <n-image width="250" src="/website/images/bpho.jpg"></n-image>
        </div>
    </div>
</template>

<style>
.sheading {
    font-size: 1.5rem;
    font-weight: bold;
}

.body {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 4rem;
}

.content-container {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    /* Adjust space between text and carousel */
    padding-bottom: 10px;
}

.carousel {
    position: relative;
    width: 350px;
    /* Set a fixed width for the carousel */
    height: 240px;
    /* Fixed height to match carousel-img */
    display: flex;
    align-items: center;
    justify-content: center;
}

.carousel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>