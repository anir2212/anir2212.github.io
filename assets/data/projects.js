// Generated from ~/Desktop/Projects/Tracked/entries via the project ledger. Edit there, then regenerate.
window.PROJECTS = [
 {
  "id": "screenexplain",
  "name": "ScreenExplain",
  "tagline": "Android and FastAPI finance-news assistant that explains articles with source-linked context",
  "domain": "Full-stack",
  "tags": [
   "LLM",
   "RAG",
   "Android",
   "Finance news"
  ],
  "dataNote": "Live news feeds; small documented runs",
  "repo": null,
  "live": null,
  "repoNote": "Code is in an access-controlled GitHub repository, so no public code link is shown.",
  "headline": {
   "value": "Sourced",
   "label": "every remembered claim links back to its article"
  },
  "problem": "Finance news is hard to interpret in isolation. ScreenExplain explains the current story in plain language and pulls in related earlier claims with article IDs, URLs and dates, so the context can be traced to its source.",
  "built": [
   "Article pipeline that extracts clean text, checks finance relevance, deduplicates, and finds related earlier articles by vector similarity and entity overlap.",
   "Structured LLM calls that produce a plain-language explanation plus source-linked entities, events and atomic claims, stored in PostgreSQL/pgvector.",
   "Scheduled GitHub Actions news ingestion, plus a durable queue that lets the Android app request news for up to 20 saved stock tickers.",
   "Separate queue that scores whole-article tone with pretrained FinBERT for eligible saved articles; it is not a stock-price prediction.",
   "Android accessibility service: in a user-started reading session, long-pressing a Yahoo Finance article image opens or requests its summary."
  ],
  "results": [
   "One documented scheduled cloud run saved 8 of 8 attempted articles; an earlier manual run saved 2 of 5. Separate runs, not a throughput benchmark.",
   "Live Yahoo scroll test on an earlier release: 18 titles sent in nine phone requests; the hosted API accepted 10, found 4 readable articles, saved 3 summaries.",
   "October release source checks: 25 backend tests passed (1 database integration test skipped) and 21 hosted-API tests passed.",
   "Android 0.3.1 installed on a Samsung phone; long presses opened saved summaries on both the Yahoo Home and News card layouts."
  ],
  "limits": [
   "Cloud migrations, app-requested ingestion and auto-scoring after the October release are unverified; a hosted health check timed out on 2026-10-18.",
   "No summarization-accuracy, production-scale adoption or financial-prediction result has been measured.",
   "FinBERT gives article-level tone only, not company-specific sentiment or price impact.",
   "A LangGraph question-answering prototype exists only as unreleased local work; it is not in the app or the main branch."
  ],
  "stack": [
   "Python",
   "FastAPI",
   "PostgreSQL/pgvector",
   "SQLAlchemy",
   "Kotlin (Android)",
   "GitHub Actions",
   "FinBERT",
   "sentence-transformers",
   "Neon",
   "Render"
  ]
 },
 {
  "id": "easyboard",
  "name": "EasyBoard",
  "tagline": "Step-by-step transit companion for travellers with Down syndrome, with a caregiver in the loop",
  "domain": "Mobile",
  "tags": [
   "Accessibility",
   "React Native",
   "Supabase",
   "Transit"
  ],
  "dataNote": "Two sample trips; simulated GPS",
  "repo": null,
  "live": null,
  "repoNote": "Local repository only; not yet public.",
  "featured": "#easyboard",
  "headline": {
   "value": "1 step",
   "label": "at a time: one action per screen, read aloud"
  },
  "problem": "Standard transit apps assume riders can read a route map, handle unexpected changes and follow several instructions at once. EasyBoard breaks each Singapore journey into one read-aloud action at a time, with a caregiver kept informed.",
  "built": [
   "Expo (React Native, TypeScript) app for iOS and Android with separate traveller and caregiver modes.",
   "Trip steps, progress tracking, walking guidance and route ranking in one dependency-free module shared by app and server, so both agree on the current step.",
   "Supabase Edge Functions (Deno) are the only place LTA and OneMap API keys are used; no provider key reaches the phone.",
   "Caregiver access, consent and data retention enforced in PostgreSQL Row-Level Security rather than app code, with pgTAP tests for those policies.",
   "Offline demo mode with two real sample trips (bus 34 to Our Tampines Hub, and an MRT practice trip) and simulated phone position."
  ],
  "results": [
   "Demo mode runs offline end to end on Android and iOS with two sample trips and simulated positioning.",
   "pgTAP database security tests cover the Row-Level Security policies.",
   "A screen recording of the working app is kept with the project."
  ],
  "limits": [
   "This is a prototype. Live mode has not been run; it needs Supabase, LTA, OneMap and Expo accounts.",
   "The demo covers two fixed sample journeys, not general Singapore routing.",
   "Position is simulated in demo mode, not real GPS tracking in the field.",
   "No user testing of this prototype with the target population has been recorded."
  ],
  "stack": [
   "Expo",
   "React Native",
   "TypeScript",
   "Supabase",
   "PostgreSQL",
   "Deno",
   "pgTAP"
  ]
 },
 {
  "id": "p01-pocketlm",
  "name": "PocketLM",
  "tagline": "A small local language model that turns short requests into valid device commands",
  "domain": "AI & ML",
  "tags": [
   "LLMs",
   "Fine-tuning",
   "Quantisation",
   "Tool calling"
  ],
  "dataNote": "Synthetic + public; generated holdout",
  "repo": "https://github.com/anir2212/pocketlm",
  "repoNote": "Public main includes the QLoRA results (merged PR #2); raw run artifacts remain local.",
  "headline": {
   "value": "637/728",
   "label": "exact tool calls on held-out requests"
  },
  "problem": "Device assistants must turn short requests into valid, bounded commands, and know when to ask for clarification or refuse. PocketLM tests how well a small model running on a laptop can meet that contract.",
  "built": [
   "A 12.8M-parameter byte-level GPT built from scratch in PyTorch and trained reproducibly on TinyStories (seeded, pinned data revision).",
   "An 8,697-row tool-calling corpus across 13 mock tools: synthetic examples checked against JSON schemas, de-duplicated, and mixed with public function-call data.",
   "A 728-row held-out test set using different request templates and two device tools absent from device training, to test generalisation rather than memorisation.",
   "LoRA fine-tuning at three ranks, NF4 QLoRA on a Colab GPU and DPO preference tuning, with checkpoint export and resume for interrupted cloud runs.",
   "GGUF conversion for llama.cpp, with each model scored with and without a grammar that constrains output, plus speed benchmarks and a mock-device demo."
  ],
  "results": [
   "Rank-8 LoRA: 637/728 exact (87.50%) on generated held-out requests; it also won the predeclared validation-loss selection rule.",
   "Returned NF4-trained rank-16 adapter: 604/728 exact (82.97%) on the same requests. Training settings differed, so the gap is not an NF4 effect.",
   "Rank-8 as a Q4_K_M GGUF with grammar-constrained decoding: 629/728 exact (the decoding constraint also changed).",
   "Scratch GPT: 1,000 training steps in 64.3 s on a local Mac (Apple MPS)."
  ],
  "limits": [
   "The QLoRA and rank-8 runs changed several settings, so the 604 vs 637 gap does not isolate an effect of NF4 quantisation.",
   "The LoRA comparison used a controlled 2,000-row subset, not full-corpus training.",
   "Checkpoint-resume is tested locally but not yet exercised on CUDA; repeated-request latency and broader capability comparisons are pending.",
   "Byte-level perplexity is not comparable to word-level or BPE-token perplexity."
  ],
  "stack": [
   "Python",
   "PyTorch",
   "Hugging Face PEFT",
   "Hugging Face TRL",
   "llama.cpp",
   "GGUF / GBNF",
   "lm-eval",
   "MinHash",
   "pytest",
   "Google Colab"
  ]
 },
 {
  "id": "p02-opspilot",
  "name": "OpsPilot",
  "tagline": "A local incident copilot that matches alerts to runbooks and waits for human approval",
  "domain": "AI & ML",
  "tags": [
   "RAG",
   "AI agents",
   "Observability"
  ],
  "dataNote": "Synthetic incidents, runbooks, faults",
  "repo": "https://github.com/anir2212/opspilot",
  "repoNote": null,
  "headline": {
   "value": "0.675",
   "label": "Recall@5 when retrieving the right runbook"
  },
  "problem": "On-call engineers must quickly match a firing alert to past incidents and the right runbook, then decide on a fix. OpsPilot builds that loop plus a test environment with labelled faults, so the assistant can be scored against known answers.",
  "built": [
   "Three small services (Gateway, Payments, Backups) with a fault injector for eight labelled synthetic faults that logs ground truth for scoring.",
   "Prometheus alert rules for each fault plus a payment error-rate rule; Alertmanager sends firing and resolved alerts to a webhook that stores them in PostgreSQL.",
   "Retrieval over 20 runbooks and 80 synthetic past incidents, stored as embeddings in PostgreSQL with pgvector.",
   "A LangGraph triage workflow whose threads survive restarts, with an approval gate: the agent proposes actions and a human must approve them.",
   "A web incident console, Slack and Teams adapters, OpenTelemetry tracing into Grafana, Loki and Tempo, and a local Kubernetes (kind) smoke deployment."
  ],
  "results": [
   "Reranked retrieval reached Recall@5 of 0.675 on 40 authored development questions.",
   "A fault detector, revised on its development set, found 32/32 injected fault episodes.",
   "On 40 authored fixtures, the five-step path with a local 0.5B model scored Root@1 of 0.156 and abstained on 4/8 false alarms.",
   "A kind smoke deployment passes; committed screenshots show three synthetic faults firing in Grafana and three alerts grouped in Alertmanager."
  ],
  "limits": [
   "All incidents, runbooks and faults are synthetic, and resource faults are simulated; scores do not estimate production incident performance.",
   "Slack and Teams adapters have local tests only; no real channel demo has been run.",
   "Whether cited runbooks actually support the triage answers (semantic citation support) was not measured.",
   "A local kind smoke deployment is not a production Kubernetes rollout."
  ],
  "stack": [
   "Python",
   "LangGraph",
   "PostgreSQL",
   "pgvector",
   "Prometheus",
   "Alertmanager",
   "Grafana",
   "OpenTelemetry",
   "Docker Compose",
   "kind"
  ]
 },
 {
  "id": "p09-payguard",
  "name": "PayGuard",
  "tagline": "Practice card-payment system with a double-entry ledger, fraud scoring and analyst review",
  "domain": "Finance & risk",
  "tags": [
   "Payments",
   "Fraud detection",
   "Kotlin",
   "Event streaming"
  ],
  "dataNote": "Synthetic data + public benchmark",
  "repo": "https://github.com/anir2212/payguard",
  "repoNote": null,
  "headline": {
   "value": "7,501",
   "label": "card authorisations in 15 s on a local load test"
  },
  "problem": "A card authorisation must be decided quickly, leave an auditable record of money movement, and still respond when the fraud scorer is unavailable. PayGuard explores these trade-offs using synthetic cards.",
  "built": [
   "Kotlin/Ktor card API writing to a PostgreSQL double-entry ledger, so every money movement is auditable",
   "Python ONNX fraud scorer with a 50 ms timeout and rules fallback, plus off/shadow/enforce modes so a model can run in shadow before deciding anything",
   "Transactional outbox to Kafka that records declines as well as approvals, with Redis-backed fraud features updated from the stream",
   "Read-only LangGraph case-drafting agent on a local Ollama model: drafts await analyst review, and it can never freeze a card or contact a customer",
   "Settlement reconciliation, Prometheus/Grafana monitoring with a score-drift index, and a React analyst console; the full stack starts with one command"
  ],
  "results": [
   "15 s local k6 test, rules only: 7,501 authorisations at a 500/s offered rate, 6.077 ms p95, no auth errors; Kafka and fraud scoring paused",
   "LightGBM PR-AUC 0.9574 on an intentionally learnable synthetic holdout; 0.7733 on a separate public benchmark with a different feature set",
   "Kotlin/PostgreSQL tests passed 13/13; Python (pytest, ruff) and React test suites also pass",
   "A one-command simulation runs a card-testing burst end to end and records the measured output"
  ],
  "limits": [
   "No real cards, customers, card network or authenticated users — fake tokens and demo credentials, for local learning only",
   "Load-test and model figures are demonstrations, not production capacity or fraud-performance claims",
   "The rules-only latency figure does not measure fraud scoring or end-to-end throughput",
   "Fraud training data is intentionally learnable synthetic data, kept separate from the public benchmark"
  ],
  "stack": [
   "Kotlin",
   "Ktor",
   "PostgreSQL",
   "Python",
   "ONNX Runtime",
   "Kafka",
   "Redis",
   "LangGraph",
   "React",
   "Docker Compose"
  ]
 },
 {
  "id": "p08-modelaudit",
  "name": "ModelAudit",
  "tagline": "Workbench that audits credit-scoring models and writes evidence-linked review reports",
  "domain": "Finance & risk",
  "tags": [
   "Credit risk",
   "Model validation",
   "XGBoost",
   "Explainability"
  ],
  "dataNote": "Public UCI datasets; fictional policies",
  "repo": "https://github.com/anir2212/model-audit",
  "repoNote": null,
  "headline": {
   "value": "0.7908",
   "label": "test AUC, XGBoost on public Taiwan credit data"
  },
  "problem": "Validating a credit model is a separate job from building one: the output is a defensible review document (a workpaper) where every finding links to its evidence and every threshold is set in advance. This project builds that validation side.",
  "built": [
   "An interpretable weight-of-evidence scorecard and an XGBoost challenger, trained on two licensed public UCI credit datasets",
   "Audit checks declared up front in a YAML registry, so review criteria are fixed before results are seen; findings re-checked on a second cohort where available",
   "TreeSHAP explanations, a retrospective delinquency survival analysis, and an offline harness testing a policy-question retrieval layer against unsafe inputs",
   "Downloads source data from the official UCI repository and verifies pinned SHA-256 hashes before use",
   "Generates evidence-linked HTML/PDF workpapers, viewable in a local-only Streamlit dashboard"
  ],
  "results": [
   "Taiwan UCI test AUC: scorecard 0.7837, XGBoost 0.7908. German Credit: scorecard 0.8142, XGBoost 0.8032",
   "Fictional-policy retrieval harness passed 12/12 authored fact questions and 4/4 injection cases with deterministic responses; no LLM ran",
   "The run's workpapers and compact evidence JSON are committed to the repo for review"
  ],
  "limits": [
   "Educational model validation only — not a lending system, fairness certification, or legal or regulatory assessment",
   "Taiwan data has no application dates, so its ID-order split is a proxy, not true out-of-time validation",
   "Audit thresholds are local review heuristics, not regulatory thresholds"
  ],
  "stack": [
   "Python",
   "scikit-learn",
   "XGBoost",
   "SHAP",
   "pandas",
   "Streamlit",
   "pytest"
  ]
 },
 {
  "id": "p10-finrecon",
  "name": "FinRecon",
  "tagline": "Finance reconciliation pipeline where every reported number traces back to its source row",
  "domain": "Data engineering",
  "tags": [
   "Data lineage",
   "Reconciliation",
   "DuckDB",
   "Data quality"
  ],
  "dataNote": "Synthetic data (seeded feeds)",
  "repo": "https://github.com/anir2212/finrecon",
  "repoNote": null,
  "headline": {
   "value": "74/74",
   "label": "data-quality checks passing on the finance feeds"
  },
  "problem": "In finance operations a number is worth little unless you can show where it came from. FinRecon makes every reconciliation break, audit finding and anomaly traceable to the raw rows, files and hashes behind it.",
  "built": [
   "Loads six synthetic finance feeds into DuckDB, tagging every row with its source file hash and line number",
   "Rule-based reconciler matching the general ledger to the bank feed; one trace command returns the exact source rows and SHA-256 hashes behind any figure",
   "74 delivery and finance data-quality controls that fail the run (non-zero exit) when a check breaks, so they work as a gate",
   "Audit screens, including an out-of-hours posting rule (Singapore time) and an optional IsolationForest anomaly screen",
   "Contract-term extraction at exact character positions, and a fixed-question finance assistant answered only through allow-listed SQL"
  ],
  "results": [
   "Seeded pipeline classified 123/123 generated cases and passed 74/74 quality checks; a hand-authored edge fixture classified 15/15 boundary cases",
   "Hand-authored 24-row fixture: posting-time rule caught 2, no false alarms, none missed; IsolationForest caught 2 with 1 false alarm",
   "On a 120-row synthetic anomaly run, six postings were flagged: three injected anomalies and three false positives",
   "DuckDB directly checked 394 staging and 129 mart rows across eight dbt-compatible SQL models; the 26-test suite passed"
  ],
  "limits": [
   "All feeds are seeded synthetic data; consistency on fixtures is not external accuracy",
   "The dbt CLI has never been installed or run — the SQL models were executed directly in DuckDB",
   "Contract extraction and the assistant are deterministic baselines; no CUAD evaluation or LLM layer has been run",
   "The weekly scheduler is a reviewable template, not loaded; anomaly scores are review signals, not fraud probabilities"
  ],
  "stack": [
   "Python",
   "DuckDB",
   "SQL",
   "pandas",
   "scikit-learn",
   "Streamlit",
   "pytest"
  ]
 },
 {
  "id": "risk-monitor",
  "name": "Portfolio Risk Monitor",
  "tagline": "Live portfolio risk dashboard that recalculates VaR and other risk measures on every price bar",
  "domain": "Finance & risk",
  "tags": [
   "Market risk",
   "VaR",
   "Anomaly detection",
   "FastAPI"
  ],
  "dataNote": "Synthetic price feed by default",
  "repo": null,
  "live": null,
  "repoNote": "Local repository only; not yet public.",
  "headline": {
   "value": "Live VaR",
   "label": "risk recalculated on every price bar"
  },
  "problem": "Risk dashboards are usually static notebooks or need a paid data subscription. This is a live, bar-by-bar risk engine that a reviewer can start with one command, using a deterministic synthetic price feed by default.",
  "built": [
   "Event-driven engine: a replay or synthetic feed drives an in-memory event bus that marks a seeded portfolio to market on every bar.",
   "Risk measures recalculated each bar: NAV, day P&L, volatility, VaR at 95% and 99%, expected shortfall, beta, drawdown and each position's risk share.",
   "Limit-breach and anomaly alerts, with an Isolation Forest trained on first start and anomaly markers on intraday candlestick charts.",
   "Hypothetical stress shocks, a rolling VaR backtest, simulated trades, and controls to pause, change speed or inject price jumps.",
   "Optional Yahoo Finance backfill of adjusted daily history from the 2008 stress window onward; holdings persist across feed switches."
  ],
  "results": [
   "One command (make demo) creates the database schema, seeds a $1,000,000 portfolio, trains the anomaly model and starts a 60x synthetic simulation.",
   "Brings up the dashboard and FastAPI docs locally; a dashboard screenshot is committed to the repository.",
   "Tests do not require internet access; only the optional Yahoo backfill does."
  ],
  "limits": [
   "Single-user research tool: no broker connection, order execution, authentication or real-money workflow.",
   "The default feed is deterministic synthetic price data, not market data.",
   "Yahoo data can change or be rate-limited, and yfinance cannot return intraday history beyond 60 days.",
   "Stress shocks are hypothetical; the VaR backtest runs on replayed or synthetic data."
  ],
  "stack": [
   "Python",
   "FastAPI",
   "PostgreSQL",
   "scikit-learn",
   "yfinance",
   "Docker Compose"
  ]
 },
 {
  "id": "p04-gamerec",
  "name": "GameRec",
  "tagline": "Five game recommenders tested on time-ordered data, served by an API, with A/B test statistics",
  "domain": "AI & ML",
  "tags": [
   "Recommender systems",
   "A/B testing",
   "Evaluation"
  ],
  "dataNote": "Seeded synthetic corpus",
  "repo": "https://github.com/anir2212/gamerec",
  "repoNote": null,
  "headline": {
   "value": "0.4026",
   "label": "NDCG@10 on time-ordered test data"
  },
  "problem": "Many recommender demos stop at one offline score on a random split. Whether a recommender is ready to ship depends on time-ordered testing, new-user performance, serving rules and reading A/B results correctly.",
  "built": [
   "Five ranking models (popularity, item-kNN, implicit ALS, BPR and a genre-content scorer) trained on the same seeded synthetic game corpus.",
   "Per-user time-ordered train/validation/test splits, scored at 10 and 20 slots overall, for short-history users and for low-count games.",
   "The winner is chosen on validation NDCG@10 and every model is reported on test; bootstrap confidence intervals resample users, not interactions.",
   "A FastAPI recommendation endpoint that excludes owned games, caps each genre at four picks, and gives unknown users a popularity fallback by declared genre.",
   "An A/B statistics toolkit (sample-ratio mismatch, power, CUPED, peeking correction) on an offline click-proxy experiment, plus a decision memo."
  ],
  "results": [
   "Validation-selected genre scorer: test NDCG@10 0.4026 and Recall@10 0.5971 across 97 eligible users in a seeded 120-user, 80-game corpus.",
   "One five-second local run at a 200 requests/s target completed 1,000 requests with 7.86 ms p99 latency on that tiny catalog."
  ],
  "limits": [
   "The corpus is seeded synthetic: no real player data and no live experiment.",
   "The A/B result uses a retrospective hit proxy, not real clicks, purchases or a live randomised experiment.",
   "A local request-rate test is not a production capacity guarantee; the server trains the small corpus at first request.",
   "No embeddings, two-tower model or re-ranker yet; real Steam evaluation is not done."
  ],
  "stack": [
   "Python",
   "implicit",
   "NumPy",
   "SciPy",
   "FastAPI",
   "pytest"
  ]
 },
 {
  "id": "p07-playtestrl",
  "name": "PlaytestRL",
  "tagline": "Game-playing AI agents built from scratch, then used to hunt for bugs in small games",
  "domain": "AI & ML",
  "tags": [
   "Reinforcement learning",
   "PyTorch",
   "Game testing",
   "Experiment design"
  ],
  "dataNote": "Synthetic games and injected defects",
  "repo": "https://github.com/anir2212/playtest-rl",
  "repoNote": null,
  "headline": {
   "value": "5/5",
   "label": "seeds where the coverage heuristic found all 4 injected bug types"
  },
  "problem": "Reinforcement learning is usually shown chasing high scores; here the agent's job is to find bugs in a game (automated playtesting). The project also builds the core algorithms from scratch and checks them against a trusted reference library.",
  "built": [
   "Two custom game environments (GridQuest, Slicer) that pass Gymnasium's standard conformance check with deterministic reset",
   "Tabular Q-learning, Double DQN and PPO written from scratch in PyTorch, each compared with a Stable-Baselines3 reference on the same training budget",
   "Playtest harness that injects four observable defects and compares random, scripted, coverage-heuristic and count-bonus exploration at finding them",
   "Diagnosed and fixed a reward-hacking exploit, where the agent farmed a repeatable reward, by switching to a one-time-key reward",
   "One command runs five seeds per setup and regenerates every figure from measured data committed to the repo"
  ],
  "results": [
   "Coverage heuristic found all four injected defect types in 5/5 seeds (small synthetic headless games)",
   "At 5,120 steps per seed, scratch Double DQN averaged 3.513 fruit/episode vs 3.960 for the SB3 reference; wide intervals make this inconclusive",
   "Five seeds per setup with seed-level bootstrap confidence intervals; defects never found were treated as censored, not dropped",
   "Each full run finished in under an hour on a laptop, with no cloud or paid services"
  ],
  "limits": [
   "Games and defects are small synthetic constructions, not a commercial game codebase",
   "Headless only — no graphical renderer or GIFs are claimed",
   "Five seeds is a small sample; the confidence intervals quantify that uncertainty, they don't remove it",
   "The short-budget learned count-bonus policy often underperformed"
  ],
  "stack": [
   "Python",
   "PyTorch",
   "Gymnasium",
   "Stable-Baselines3",
   "NumPy",
   "matplotlib",
   "pytest"
  ]
 },
 {
  "id": "p03-gamestream",
  "name": "GameStream",
  "tagline": "A streaming pipeline that turns evolving game events into deduplicated, queryable tables",
  "domain": "Data engineering",
  "tags": [
   "Streaming",
   "Kafka",
   "Lakehouse"
  ],
  "dataNote": "Synthetic events",
  "repo": "https://github.com/anir2212/gamestream",
  "repoNote": "The JDBC-catalog and persistent-registry stage (local commit a8dd834) is not yet on public main.",
  "headline": {
   "value": "2,142",
   "label": "raw events read back from Iceberg; 1,003 distinct"
  },
  "problem": "Game analytics need a repeatable path from changing client events to clean, deduplicated tables, and stored Kafka events must stay readable after services restart. GameStream builds that path in stages and checks each one.",
  "built": [
   "A Kafka event producer using Avro schemas and a schema registry (BACKWARD compatibility), with acks=all, idempotent delivery and zstd compression.",
   "Spark Structured Streaming jobs writing bronze (raw) and silver (deduplicated) Iceberg tables, plus a verifier that checks silver event IDs are unique.",
   "Diagnosed a Hive 4.0.1 / Iceberg 1.10.0 Thrift incompatibility and moved Spark to an Iceberg JDBC catalog on PostgreSQL, with persistent registry storage.",
   "A three-broker Kafka fault experiment and dbt models with data-quality checks; ClickHouse, Trino, Airflow and Superset are configured but not yet run.",
   "Separate Docker Compose profiles, so readers can run only the verified services apart from the larger unverified analytics stack."
  ],
  "results": [
   "Local smoke test: 1,020 Avro records delivered and read back, including both coexisting schema versions.",
   "Staged JDBC-catalog run: 2,142 bronze rows and 1,003 distinct silver IDs read back after a registry restart and a new synthetic publish.",
   "A single three-broker fault run recovered 200/200 acknowledged keys; stopping two brokers also lost controller quorum.",
   "These are correctness checks, not throughput figures. Docker had 11.67 GiB of memory; the staged run stopped at about 10 GiB free disk."
  ],
  "limits": [
   "The full multi-service lakehouse has never run end to end; Trino, ClickHouse, Airflow, Superset and dbt build are unverified.",
   "New silver events reused old timestamps, so the 45-minute watermark excluded most of them; 1,003 is not a throughput figure.",
   "The Kafka fault experiment is a single run, not a distribution.",
   "All data is synthetic."
  ],
  "stack": [
   "Python",
   "Kafka",
   "Avro",
   "Apicurio Registry",
   "Spark Structured Streaming",
   "Apache Iceberg",
   "PostgreSQL",
   "dbt",
   "Docker Compose",
   "SQL"
  ]
 },
 {
  "id": "p05-fabsense",
  "name": "FabSense",
  "tagline": "Factory and facilities analytics whose insights cite the exact data row behind them",
  "domain": "Data engineering",
  "tags": [
   "Simulation",
   "Analytics",
   "Anomaly detection"
  ],
  "dataNote": "Seeded synthetic data",
  "repo": "https://github.com/anir2212/fabsense",
  "repoNote": null,
  "headline": {
   "value": "20/20",
   "label": "insights rechecked against their source rows"
  },
  "problem": "Factory and facilities decisions need to separate real process variation from measurement error and unusual resource use, while keeping every displayed number traceable to its data.",
  "built": [
   "A SimPy discrete-event simulation of a photolithography bay.",
   "A crossed gauge R&R study, which separates measurement-system error from real variation, and a meter anomaly model over generated meter readings.",
   "A DuckDB warehouse where each insight carries a row_id citation to a specific fact row, so it can be checked against its source.",
   "A deterministic, read-only question router that maps questions to allow-listed SQL queries, shown in a local Streamlit dashboard.",
   "One make command regenerates all five seeded analyses offline, with no cloud calls once dependencies are installed."
  ],
  "results": [
   "The photo-bay simulation grid completed 840 SimPy replications.",
   "On a 20,160-row generated utilities dataset, the anomaly model caught 28 of 30 planted anomaly rows with 0 false positives and 2 misses.",
   "DuckDB rechecked 20/20 cited insights; the allow-listed router answered 23/23 supported authored questions."
  ],
  "limits": [
   "A development demonstration, not a calibrated fab model or a real energy audit.",
   "All data is seeded synthetic; no public data or production fab measurements are used.",
   "The question router is deterministic and allow-listed by design; it is not a natural-language or LLM agent.",
   "Real benchmarks (SECOM, NASA C-MAPSS, BDG2), Power BI publication and cloud execution are still open."
  ],
  "stack": [
   "Python",
   "SimPy",
   "pandas",
   "NumPy",
   "DuckDB",
   "SQL",
   "Streamlit",
   "pytest"
  ]
 },
 {
  "id": "p06-claimflow",
  "name": "ClaimFlow",
  "tagline": "Expense-claim approval system that blocks duplicate claims and survives a server restart",
  "domain": "Backend & systems",
  "tags": [
   "Java",
   "Spring Boot",
   "Concurrency",
   "Workflow"
  ],
  "dataNote": "Synthetic receipts, fictional policies",
  "repo": "https://github.com/anir2212/claimflow",
  "repoNote": null,
  "headline": {
   "value": "56",
   "label": "automated Java tests passing"
  },
  "problem": "An expense-approval system must not create duplicate claims or lose in-progress work when a request is retried, two submissions race each other, or the server restarts. ClaimFlow targets that correctness across employee, manager and finance roles.",
  "built": [
   "Employee → policy review → manager → finance workflow in Spring Boot (Java 21), with JWT roles and every step written to an audit trail",
   "Idempotency keys so a retried submission never creates a second claim, plus duplicate-receipt detection that holds when two submissions arrive at once",
   "Async path saving each claim and its extraction job in one transaction; a scheduled worker validates it, sending bad input or three failures to a manager queue",
   "React/TypeScript console for each role, with Vitest unit tests and Playwright end-to-end tests against a local API",
   "Restart test: stop the app mid-workflow, start a new process on the same MySQL volume, then verify the claim and its job survived"
  ],
  "results": [
   "Latest Java 21 verify gate passed 56 tests; 2/2 role flows passed in Chrome (local runs)",
   "Local MySQL race test: two simultaneous submissions with the same synthetic receipt gave one claim and one duplicate-receipt rejection (400)",
   "After a genuine stop-and-restart on the same MySQL volume, the pending job was recovered and the claim reached IN_REVIEW with its audit actions recorded",
   "MySQL V3/V4 schema migrations applied cleanly and the MySQL smoke and concurrency scripts passed (13 Oct 2026)"
  ],
  "limits": [
   "Receipts are typed or .txt transcriptions — no OCR or LLM extraction yet",
   "The full API Docker image is unverified; passing tests used a MySQL container with the app run on the host",
   "Policy Q&A returns verbatim text from four fictional clauses — keyword retrieval, not a generative assistant",
   "Demo logins are local fixtures, not an identity provider; Redis, RabbitMQ, OCR and Kubernetes are future milestones"
  ],
  "stack": [
   "Java 21",
   "Spring Boot",
   "Spring Security (JWT)",
   "Flyway",
   "MySQL",
   "H2",
   "React",
   "TypeScript",
   "Playwright",
   "Docker Compose"
  ]
 },
 {
  "id": "p11-miniplay",
  "name": "MiniPlay",
  "tagline": "Mini-game platform where the server replays each run to check a score before it is ranked",
  "domain": "Backend & systems",
  "tags": [
   "Go",
   "Anti-cheat",
   "Microservices",
   "Event streaming"
  ],
  "dataNote": "Synthetic test data; demo identity",
  "repo": "https://github.com/anir2212/miniplay",
  "repoNote": null,
  "headline": {
   "value": "12 → 1",
   "label": "concurrent duplicate submissions, one accepted"
  },
  "problem": "A leaderboard is only as trustworthy as its anti-cheat. MiniPlay never trusts the player's device with a score: client and server rebuild the same game from a shared seed, and the server replays the input to check the claim.",
  "built": [
   "Two original Phaser browser games (Pulse Field, Comet Catch) in a Flutter mobile shell, with scores checked by server-side replay from a run seed",
   "Go microservices — gateway, session, score and leaderboard — with HMAC-signed sessions and numbered SQL migrations",
   "Kafka outbox and a deduplicating stats worker, with Redis-backed live WebSocket leaderboards",
   "Fixed a cache bug: a completeness marker, set only after a SQL backfill, stops a partly filled Redis board being served as the full leaderboard",
   "Abuse scanner that flags suspicious runs with evidence, and integration tests that refuse to run against anything but a disposable test database"
  ],
  "results": [
   "Isolated PostgreSQL test: 12 concurrent same-token writes resolved to 1 accepted and 11 duplicate responses; clean-restart persistence also verified",
   "Opt-in Redis 7 recovery test passed against an isolated instance (16 Oct 2026), checking leaderboard backfill and eviction",
   "Full Go test suite and go vet pass, including a real loopback session-to-score HTTP flow with fake storage",
   "On deterministic synthetic bot data, the abuse detector caught 22, raised 1 false alarm and missed 58"
  ],
  "limits": [
   "PostgreSQL, Redis and Kafka have not been verified running together; the full API-to-database flow is unverified",
   "No Android emulator run has been verified",
   "Abuse-detection figures come from synthetic feature vectors, not real players or adaptive bots",
   "The API's user field is a demo identity, not authentication; Redis retry tests used fakes"
  ],
  "stack": [
   "Go",
   "TypeScript",
   "Phaser",
   "Flutter",
   "PostgreSQL",
   "Redis",
   "Kafka",
   "WebSockets",
   "OpenAPI"
  ]
 },
 {
  "id": "nextbite",
  "name": "NextBite",
  "tagline": "Finds the closest Singapore hawker centre from a free-form food request",
  "domain": "Full-stack",
  "tags": [
   "NLP",
   "NER",
   "React",
   "Web app"
  ],
  "dataNote": null,
  "repo": null,
  "live": null,
  "repoNote": "The frontend was deployed on Vercel, but the AWS backend is currently down, so no live link is shown.",
  "headline": {
   "value": "NER",
   "label": "a custom model that reads Singapore food names"
  },
  "problem": "General NLP models do not recognise local, multilingual and inconsistently spelled hawker dish names such as \"char kway teow\". NextBite fine-tunes an entity-recognition model so free-form food requests can be understood.",
  "built": [
   "Named Entity Recognition model fine-tuned on Singapore food names with Hugging Face and PyTorch, served from Hugging Face Spaces.",
   "Natural-language eatery search, a Random Eatery suggester, curated food-spot cards and user accounts.",
   "Profiles that store allergies and religious dietary restrictions alongside food preferences.",
   "Express.js REST API over PostgreSQL hosted on AWS, with Firebase authentication.",
   "Responsive React/TypeScript and TailwindCSS interface themed on Singapore hawker stalls."
  ],
  "results": [
   "Frontend deployed publicly on Vercel; the site may not fully work while the AWS backend is down.",
   "Fine-tuned NER model deployed as a separate hosted inference service on Hugging Face Spaces.",
   "No model accuracy figures were recorded, so none are claimed."
  ],
  "limits": [
   "The AWS backend is currently down, so the live site may not fully work.",
   "No NER accuracy evaluation is recorded.",
   "Random Eatery is being updated after a database upscaling.",
   "Team makeup and individual contribution split are not documented."
  ],
  "stack": [
   "React",
   "TypeScript",
   "TailwindCSS",
   "Node.js",
   "Express.js",
   "PostgreSQL (AWS)",
   "Firebase",
   "PyTorch",
   "Hugging Face",
   "Vercel"
  ]
 },
 {
  "id": "cs3263-llm-z3",
  "name": "CS3263: LLM review vs. LLM-to-Z3",
  "tagline": "Team study: should an LLM judge C code safety directly, or translate it for a formal solver?",
  "domain": "Research",
  "tags": [
   "LLM evaluation",
   "Formal methods",
   "Z3",
   "C safety"
  ],
  "dataNote": "120 synthesised C functions",
  "repo": null,
  "live": null,
  "repoNote": "NUS course project; code is local only.",
  "headline": {
   "value": "120/120",
   "label": "benchmark functions validated for the study"
  },
  "problem": "Can an LLM tell whether a C function can break a safety rule such as array bounds or division by zero? The team compares the model judging the code directly against the model translating the question for the Z3 solver to decide.",
  "built": [
   "A team benchmark of 120 C functions in 60 minimal pairs: an unsafe function and a near-identical safe twin, across four difficulty tiers.",
   "Each label checked four ways: compiler sanitizers, a reference Z3 encoding, the CBMC model checker, and fuzzing.",
   "Every claimed bad input is re-run on the real C code under AddressSanitizer and UndefinedBehaviorSanitizer, so guessing \"unsafe\" earns nothing.",
   "Analysis with McNemar paired significance tests, breakdowns by tier and bug class, a repair curve and per-approach cost.",
   "Reproducible pipeline: script-generated result documents and a run-status file with the exact command to resume each run."
  ],
  "results": [
   "Dataset validation: 120/120 benchmark functions.",
   "Provisional: Gemini 3.5 Flash-Lite scored 98.3% with chain-of-thought prompting and 97.5% with Z3 plus repair, on the 120-function benchmark.",
   "Completed runs: qwen2.5-coder 7B on all 5 approaches, llama3.2 3B on 4 (repair skipped by decision), and non-AI baselines (CBMC, Z3, fuzzing)."
  ],
  "limits": [
   "Results are incomplete: the gemini-3.8-flash run is unfinished (free tier allows 20 requests/day; about 750 needed).",
   "The benchmark is 120 synthesised C functions, not production code; difficulty tiers are authored.",
   "Three-person NUS team project; Anirudh's individual contribution split is unconfirmed, so work is described as the team's.",
   "The course report and presentation are still to do."
  ],
  "stack": [
   "Python",
   "Z3",
   "CBMC",
   "Clang ASan/UBSan",
   "C",
   "pytest",
   "matplotlib"
  ]
 }
];
