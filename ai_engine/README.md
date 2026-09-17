# AI Matching & Allocation Engine Subsystem

This module contains the standalone NLP, scoring, and algorithmic allocation engine for the **AI-Powered Internship Allocation Engine**.

---

## Components

1. **`skill_extractor.py`**:
   - Organized taxonomy of over 1,500 skills across Web, Mobile, Cloud, AI/Data Science, Core Engineering (IoT, Mechanical, Electrical), and Management.
   - Word boundary regex tokenization with case normalization.

2. **`resume_parser.py`**:
   - PDF/TXT resume parser leveraging `pypdf`.
   - Heuristic extraction for education level, field of study, CGPA, and technical skills.

3. **`embeddings.py`**:
   - Semantic text similarity using `all-MiniLM-L6-v2` (SentenceTransformers) with smooth fallback to scikit-learn TF-IDF + Cosine Similarity.

4. **`scoring_engine.py`**:
   - Multi-factor transparent scoring strictly bounded in $[0, 100]$:
     - **Skills Match**: 40% (max 40 pts)
     - **Education Match**: 20% (max 20 pts)
     - **Candidate Preference**: 15% (max 15 pts)
     - **Location Compatibility**: 10% (max 10 pts)
     - **Experience / Projects**: 10% (max 10 pts)
     - **Industry Interest**: 5% (max 5 pts)
   - Outputs full explainable details for each candidate-internship pair.

5. **`fairness_allocator.py`**:
   - Multi-constrained Deferred Acceptance (Gale-Shapley variant).
   - Enforces company vacancy caps, single assignment guarantee, and affirmative regional quotas to avoid metro concentration.
