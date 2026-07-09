type LearningStatus = "not-started" | "in-progress" | "mastered";

type Topic = {
  title: string;
  status: LearningStatus;
};

const topics: Topic[] = [
  { title: "Inference", status: "in-progress" },
  { title: "Generics", status: "not-started" },
  { title: "Runtime boundaries", status: "not-started" }
];

function describeTopic(topic: Topic): string {
  return `${topic.title}: ${topic.status}`;
}

for (const topic of topics) {
  console.log(describeTopic(topic));
}