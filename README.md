# 🚀 DataPilot AI
https://data-pilot-ai-autonomous-ai-data-an.vercel.app/
### Autonomous AI Data Analyst

**DataPilot AI** transforms raw data into actionable insights using autonomous AI agents.

Upload a CSV, ask questions in natural language, and let DataPilot AI explore your dataset, identify patterns, generate visualizations, and explain its findings—all without requiring you to write SQL or Python.

> **Upload → Analyze → Discover → Explain → Act.**

---

## ✨ Why DataPilot AI?

Traditional data analysis often requires multiple steps:

`Clean Data → Write Queries → Analyze → Create Charts → Interpret Results`

**DataPilot AI simplifies this workflow with an autonomous AI analyst.**

Instead of only answering the question you ask, DataPilot can reason about the dataset, determine relevant analyses, and surface useful insights.

### 🧠 What makes it different?

* 🤖 **Autonomous Analysis** — The agent determines what analysis is useful.
* 💬 **Natural Language Queries** — Ask questions using plain English.
* 📊 **Interactive Analytics** — Turn data into meaningful visualizations.
* 🔍 **Insight Discovery** — Identify trends, patterns, relationships, and anomalies.
* 🧹 **Data Understanding** — Automatically inspect the structure and quality of uploaded data.
* 💡 **Actionable Insights** — Go beyond statistics and explain what the results mean.
* 🔄 **Follow-up Analysis** — Continue investigating an insight with conversational questions.
* 🧠 **Agentic Reasoning** — Gemini Managed Agents orchestrate the analysis workflow.

---

## 🎯 Example

Upload a sales dataset and ask:

> **"What caused the decline in sales last quarter?"**

Instead of simply returning a number, DataPilot can investigate the dataset and surface findings such as:

```text
📉 Sales declined by 12.4% in Q3.

🔎 Key finding:
The West region contributed 68% of the overall decline.

📊 Major contributors:
• Product A → -18.2%
• Product B → -11.7%
• Product C → -8.4%

💡 Recommendation:
Investigate inventory availability and pricing changes
in the West region for Products A and B.
```

You can then continue:

> **"Why did Product A perform poorly?"**

The analysis becomes an interactive investigation rather than a single question-and-answer interaction.

---

## 🧩 Core Features

### 📁 Upload Your Data

Upload CSV datasets and let DataPilot automatically understand the available columns, data types, and structure.

### 🤖 Autonomous Data Analysis

DataPilot can determine which analytical steps are relevant instead of requiring users to manually specify every operation.

### 💬 Chat With Your Data

Ask questions naturally:

```text
"What's our total revenue?"

"Which product performed best?"

"Show me monthly sales trends."

"Are there any unusual values?"

"Which region is growing fastest?"

"Why did revenue decrease?"
```

### 📊 Visual Analytics

Generate visual representations of important patterns and relationships in the dataset.

### 🔍 Anomaly & Pattern Detection

Identify unusual values, unexpected changes, trends, and potentially important relationships.

### 🧠 Follow-Up Reasoning

DataPilot maintains the analytical context so users can progressively investigate their data.

```text
User: Why did revenue decrease?

DataPilot: Revenue decreased primarily in the West region.

User: Why?

DataPilot: Product A and Product B accounted for most of
the decline.

User: Show me the monthly trend.

DataPilot: [Interactive visualization]
```

### 💡 Actionable Recommendations

Transform analytical findings into understandable conclusions and potential next steps.

---

## 🏗️ How It Works

```text
                  ┌─────────────────┐
                  │    CSV Upload   │
                  └────────┬────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Data Understanding │
                │  Schema & Profiling  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │    Gemini Agent     │
                │  Reasoning & Planning│
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Autonomous Analysis │
                │ • Trends            │
                │ • Patterns          │
                │ • Anomalies         │
                │ • Statistics        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Visualizations &    │
                │     Insights        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  Recommendations    │
                └─────────────────────┘
```

---

## 🧠 Agentic Workflow

DataPilot is designed around an **agentic analysis workflow** rather than a simple prompt-response architecture.

The agent can:

1. Understand the user's analytical goal.
2. Inspect the available dataset.
3. Determine relevant analytical operations.
4. Execute the required analysis.
5. Interpret the results.
6. Generate visualizations when useful.
7. Explain the findings.
8. Suggest further investigation.

This allows the system to behave more like an **AI data analyst** than a conventional chatbot.

---

## 🛠️ Technology

### AI

* **Gemini**
* **Gemini Managed Agents**

### Data

* CSV-based datasets
* Automated data inspection and analysis

### Application

* AI-powered conversational analytics
* Interactive data visualization
* Agent-based analytical workflow

> Add your exact frontend, backend, visualization, and deployment technologies here once they are finalized.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mannat-0776/DataPilot-AI-Autonomous-AI-Data-Analyst.git

cd DataPilot-AI-Autonomous-AI-Data-Analyst
```

### 2. Install dependencies

Use the package manager and installation command required by your project.

```bash
# Example
npm install
```

### 3. Configure environment variables

Create an environment file:

```bash
.env
```

Add the required Gemini/API configuration:

```env
GEMINI_API_KEY=your_api_key_here
```

> Update these variables to match the actual configuration used by your application.

### 4. Run the application

```bash
npm run dev
```

Then open the local development URL shown by your application.

---

## 📊 Use Cases

DataPilot AI can be used for:

* 📈 Business intelligence
* 💰 Sales analysis
* 📣 Marketing analytics
* 👥 Customer analysis
* 📦 Product performance analysis
* 💹 Financial data exploration
* 🧪 Exploratory data analysis
* 🎓 Data science learning
* 📊 Rapid dataset exploration

---

## 🌟 What Makes DataPilot AI Unique?

Most data-analysis assistants follow:

```text
Question → Answer
```

DataPilot aims for:

```text
Question
   ↓
Understand the goal
   ↓
Inspect the data
   ↓
Plan the analysis
   ↓
Execute the analysis
   ↓
Discover insights
   ↓
Explain the evidence
   ↓
Recommend next steps
```

The goal is to move from **"AI that answers questions"** to **"AI that investigates data."**

---

## 🔮 Future Roadmap

* [ ] Excel file support
* [ ] Automatic data-cleaning suggestions
* [ ] Advanced anomaly detection
* [ ] Automatic dashboard generation
* [ ] One-click analytical reports
* [ ] What-if analysis
* [ ] Predictive analytics
* [ ] Forecasting
* [ ] Multiple dataset support
* [ ] Database connectivity
* [ ] Export insights as PDF
* [ ] Insight history and analysis memory
* [ ] Evidence-backed explanations
* [ ] Role-based analysis modes
* [ ] Real-time data sources

---

## 🧪 Example Questions

Try asking DataPilot:

```text
What are the most important trends in this dataset?

Which category generates the most revenue?

What are the biggest anomalies?

Show me the relationship between price and sales.

Which region has the highest growth?

What factors are associated with customer churn?

What changed compared to the previous period?

Give me the three most important insights from this dataset.

What should I investigate next?
```

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "Add your feature"

# Push the branch
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

Add the project's applicable license here.

---

## 👩‍💻 Author

**Mannat**

GitHub:
https://github.com/mannat-0776

---

## ⭐ Support the Project

If you find **DataPilot AI** useful, consider giving the repository a ⭐ on GitHub.

### DataPilot AI

> **Your data. Your questions. Autonomous insights.** 🚀
