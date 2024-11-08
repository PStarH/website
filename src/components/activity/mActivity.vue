<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
    NButton, NFlex, NEllipsis, NImage, NRow, NCol, NTimeline, NTimelineItem, NCard
} from 'naive-ui';
</script>

<template>
    <div class="body">
        <div style="font-weight: bold; font-size: 32px;">Extra-curriculum activities</div>
        <div style="padding-left: 10px;">
            <div class="subheading">AppliedCS club</div>
            <div class="time">Started from 2024-01-09</div>
            <div style="line-height: 24px;">The AppliedCS Club is dedicated to exploring the real-life
                applications of Computer Science across a wide range of disciplines. In the first semester, our
                discussions span Philosophy, Mathematics, Sociology, Music, and more, focusing on how computing
                principles and technologies intersect with and enhance these fields. In our meetings, we dive
                into real-world examples to understand the impact of Computer Science. From analyzing the
                influence of algorithms on social media in Sociology to exploring the role of AI in composing
                music, our discussions are engaging and insightful. We look at how philosophical questions about
                consciousness and ethics are challenged and expanded by developments in artificial intelligence.
                In Mathematics, we explore computational methods for solving complex problems and their
                implications for theoretical advancements. We brainstorm new ideas and innovative solutions,
                fostering a collaborative environment where creativity and critical thinking thrive. Each
                meeting encourages members to contribute their unique perspectives, leading to a rich exchange
                of ideas. Through these activities, we aim to not only understand the current state of Computer
                Science applications but also envision future possibilities and their societal impacts.</div>
            <div style="text-align: center;"><n-image width="300" height="300" src="/website/images/wordcloud.png" /></div>
            <div class="subheading">Student Council</div>
            <div class="time">Started from Grade 8</div>
            <div>
                <n-ellipsis expand-trigger="click" line-clamp="5" :tooltip="false">
                    My journey in the student council during middle school was a transformative experience that
                    significantly shaped my leadership skills and community involvement. As a council member, I had the
                    unique opportunity to spearhead several major events and initiatives, which not only enriched the
                    school environment but also taught me invaluable lessons in teamwork, organization, and
                    communication.

                    One of the most memorable projects I undertook was organizing the annual sports day. This event was
                    a colossal endeavor that required meticulous planning and coordination with teachers, students, and
                    volunteers. My responsibilities included drafting the event schedule, arranging for sports
                    equipment, and managing refreshments for participants and spectators. The objective was to create an
                    inclusive and enjoyable experience for everyone. Witnessing the excitement and joy on my classmates'
                    faces was incredibly rewarding and reinforced my belief in the importance of community-building
                    activities.

                    Another significant event I helped organize was the school art festival. This festival aimed to
                    showcase the diverse artistic talents of our students and foster a deeper appreciation for the arts.
                    I was involved in everything from setting up art displays to coordinating performances and managing
                    logistics on the day of the event. The art festival not only provided a platform for students to
                    express their creativity but also brought together the school community in a celebration of artistic
                    expression.

                    In addition to these large-scale events, I also led smaller projects, such as creating a reading
                    corner in the school library. This initiative was designed to encourage a love of reading among
                    students by providing a cozy and inviting space filled with a variety of books. Collaborating with
                    fellow council members, we selected and arranged books, decorated the space, and promoted the
                    reading corner through posters and announcements. The positive feedback from students and teachers
                    alike was immensely gratifying and demonstrated the impact of even small projects on the school
                    environment.

                    Transitioning to high school, I joined the sports division to continue my passion for promoting
                    student engagement and school spirit. My role involved creating propaganda materials for various
                    sports events, including posters, banners, and social media content. This experience allowed me to
                    blend my organizational skills with creativity, effectively engaging the student body and boosting
                    attendance and enthusiasm at sports events.

                    Through these experiences, I have grown as a leader and learned the importance of dedication,
                    collaboration, and effective communication. My involvement in the student council and the sports
                    division has not only enriched my school life but also prepared me for future challenges and
                    opportunities in community service and leadership.
                </n-ellipsis>
            </div>
            <n-card style="overflow: auto; border:1px solid grey;" title="Timeline">
                <n-timeline horizontal>
                    <n-timeline-item type="success" title="Joining the Student Council" content="First step"
                        time="2021-09" />
                    <n-timeline-item type="error" content="123" time="2018-04-03 20:46" />
                    <n-timeline-item type="warning" title="警告" content="哪里警告" time="2018-04-03 20:46" />
                    <n-timeline-item type="info" title="信息" content="是的" time="2018-04-03 20:46" />
                </n-timeline>
            </n-card>
        </div>
    </div>
</template>

<style>
.body {
    padding: 10px;

}

.subheading {
    font-size: 24px;
    font-weight: bold;
}

.time {
    color: rgb(136, 135, 135);
    font: 8px;
}
</style>