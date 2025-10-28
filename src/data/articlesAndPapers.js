// Articles and Research Publications Data
// This file contains all articles and research papers for easy management

export const articlesAndPapers = [
  // Papers (appear first)
  {
    title:
      "Enhancing RWKV-based Language Models for Long-Sequence Text Generation",
    type: "paper",
    description:
      "This paper introduces an enhanced RWKV architecture with adaptive temporal gating mechanisms for improved long-context language modeling. ",
    url: "https://arxiv.org/abs/2502.15485", 
    external: true,
  },
  {
    title: "Exploring RWKV for Sentence Embeddings: Layer-wise Analysis and Baseline Comparison for Semantic Similarity",
    type: "paper",
    description:
      "This paper investigates the efficacy of RWKV on sentence embeddings in a zero-shot setting",
    url: "https://arxiv.org/abs/2502.14620",
    external: true,
  },
  {
    title: "Meta-Learning Adaptation Phase Enhanced Feature Distillation for Accelerated Convergence and Improved Generalization",
    type: "paper",
    description:
      "Propose a novel framework that integrates a meta-learning adaptation phase with feature-level knowledge distillation to accelerate convergence and improve the generalization of lightweight neural networks.",
    url: "https://www.preprints.org/manuscript/202503.1636/v1",
    external: true,
  },
  {
    title: "Rest-Wake Training: A Comprehensive Study with Theoretical and Experimental Innovations on CIFAR-10",
    type: "paper",
    description: "Introduces a novel Rest-Wake training paradigm that alternates between active gradient updates (wake phase) and parameter consolidation (rest phase)",
    url: "https://arxiv.org/abs/2304.12348",
    external: true,
  },

  // Articles (appear after papers)
  {
    title: "Prediction for AI in 2025: The Dawn of an new AI era?",
    type: "article",
    description:
      "This article will suggest a few significant changes that might happen in 2025 from three different aspect: Application layer, Technology layer and Infrastructure layer",
    url: "https://medium.com/@sampan090611/prediction-for-ai-in-2025-the-dawn-of-an-new-ai-era-977536e4b4cc",
    external: true,
  },
  {
    title: "Which AI agent framework to use？Dify? LangChain? AutoGen? 9 Top used framework explained!",
    type: "article",
    description:
      "This guide explores several frameworks — Coze, Dify, FastGPT, MetaGPT, AutoGen, Spring AI, Swarm, LangChain, and LangGraph — to provide detailed insights into their workings and use cases.",
    url: "https://medium.com/@sampan090611/which-ai-agent-framework-to-use-dify-langchain-autogen-9-top-used-framework-explained-d9d16704ec24",
    external: true,
  },
  // {
  //   title: "Chinese CoT LLM Kimi K1.5 Unveiled: The Theory, Features, and Key Differences from Deepseek-R1",
  //   type: "article",
  //   description: "The newly released Kimi K1.5 is a reasoning-capable multimodal large model trained using reinforcement learning (RL). Kimi K1.5 establishes a simple yet effective RL algorithm through extended long-context capabilities and an improved strategy optimization approach. This algorithm avoids reliance on more complex techniques, such as Monte Carlo Tree Search, value functions, or reward model processes.",
  //   url: "https://medium.com/@sampan090611/chinese-cot-llm-kimi-k1-5-unveiled-the-theory-features-and-key-differences-from-deepseek-r1-8ae964161573",
  //   external: true,
  // },
  // {
  //   title: "GTC 2025: Decoding the future of AI — NVIDIA Leading the AI Revolution",
  //   type: "article",
  //   description: "In March 2025, in San Jose, NVIDIA’s annual GTC (GPU Technology Conference) once again captured the global tech community’s attention. However, this year was different. The conference was not just about showcasing technological advancements;",
  //   url: "https://medium.com/@sampan090611/gtc-2025-decoding-the-future-of-ai-nvidia-leading-the-ai-revolution-f882056c6b70",
  //   external: true,
  // },
  {
    title: "QwQ-32B: A Breakthrough in Dense Language Models",
    type: "article",
    description: "The article cover the technical principles, practical usage experience (including sample outputs and hardware performance), and the promising future prospects of QwQ-32B.",
    url: "https://medium.com/@sampan090611/qwq-32b-a-breakthrough-in-dense-language-models-a451f639ddfb",
    external: true,
  },
  {
    title: "The Dawn of the Agent Internet: Introducing the Model Context Protocol (MCP)",
    type: "article",
    description:
      "At its core, MCP employs a client-server architecture to facilitate communication between AI models and external resources . This design involves three key components: MCP Hosts, MCP Clients, and MCP Servers.",
    url: "https://medium.com/@sampan090611/the-dawn-of-the-agent-internet-introducing-the-model-context-protocol-mcp-4e21c9f65e17",
    external: true,
  },
  {
    title: "How to choose the Right Tech Stack for RAG Implementation?",
    type: "article",
    description: "This guide provides an overview of the key components of a RAG system, from document parsing to generation, and offers technology recommendations for each part",
    url: "https://medium.com/@sampan090611/how-to-choose-the-right-tech-stack-for-rag-implementation-c4a13b09153c",
    external: true,
  },
  {
    title: "Vue 3.6: Vapor Mode opening virtual DOM era",
    type: "article",
    description: "Vue 3.6’s Vapor Mode lets you skip the virtual DOM and work directly with real DOM. You add a single flag, gain huge speed and a much smaller bundle. Here’s how it works.",
    url: "https://medium.com/@sampan090611/vue-3-6-vapor-mode-opening-virtual-dom-era-dfd10023cd05",
    external: true,
  },
  {
    title: "AI Coding Assistants: Productivity Gains and Security Pitfalls",
    type: "article",
    description: "AI-powered coding agents have rapidly emerged as game-changers in software development. Tools like OpenAI Codex and GitHub Copilot can translate plain English into working code, streamlining routine tasks and dramatically boosting developer productivity. Codex, trained on billions of lines of code, powers Copilot and understands dozens of programming languages. Integrated directly into IDEs like VS Code, Copilot can autocomplete lines, suggest entire functions, and fill in boilerplate code based on comments.",
    url: "https://medium.com/@sampan090611/ai-coding-assistants-productivity-gains-and-security-pitfalls-46132db7d69d",
    external: true,
  },
  {
    title: "Experiences on Claude Code’s subagent, and little tips for using Claude Code",
    type: "article",
    description: "Claude have recently updated its sub-agent function in Claude Code, allowing the user to customize different agents. Moreover, it also released its new Claude-Opus-4.1, which Windsurf claims to have the same improvement as Claude 3.7 to Claude 4 (Haven’t really feel it by now). Anthropic’s models are by far the best in coding undoubtedly.",
    url: "https://medium.com/@sampan090611/experiences-on-claude-codes-subagent-and-little-tips-for-using-claude-code-c4759cd375a7",
    external: true,
  },
];

// Helper functions to filter data
export const getPapers = () =>
  articlesAndPapers.filter((item) => item.type === "paper");
export const getArticles = () =>
  articlesAndPapers.filter((item) => item.type === "article");
export const getAllContent = () => articlesAndPapers;
