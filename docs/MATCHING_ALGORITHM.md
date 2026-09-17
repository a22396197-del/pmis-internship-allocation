# Multi-Factor Transparent Matching & Fairness Allocation Formulation

## 1. The 6-Pillar Matching Formula (0 to 100)

The matching score $S$ between student $i$ and internship $j$ is strictly bounded within $[0, 100]$:

$$S(i, j) = S_{\text{skills}} + S_{\text{edu}} + S_{\text{pref}} + S_{\text{loc}} + S_{\text{exp}} + S_{\text{ind}}$$

### Component Weights:

| Pillar | Max Weight | Evaluation Criteria |
| :--- | :--- | :--- |
| **Skills Alignment** | **40%** | Exact match & semantic similarity against required skills |
| **Education & Academic Benchmark** | **20%** | Degree qualification match (12 pts) + CGPA benchmark compliance (8 pts) |
| **Candidate Career Preference** | **15%** | Semantic cosine similarity of aspirational interests vs. job description |
| **Location Compatibility** | **10%** | Remote (10 pts), Preferred city (10 pts), Home city (9 pts), State (6 pts) |
| **Experience & Projects** | **10%** | Relevant practical projects and duration of prior technical internships |
| **Industry Synergy** | **5%** | Domain compatibility between candidate preference and company sector |

---

## 2. Constrained Gale-Shapley Fairness Allocation

To prevent unconstrained algorithms from allocating all opportunities solely to tier-1 metropolitan hubs, the allocation engine implements a **Constrained Deferred Acceptance (Gale-Shapley)** variant:

1. **Vacancy Capacity Constraint**:
   $$\sum_{i \in \text{Allocated}} x_{ij} \le C_j \quad \forall j \in \text{Internships}$$

2. **Single Assignment Invariant**:
   $$\sum_{j \in \text{Internships}} x_{ij} \le 1 \quad \forall i \in \text{Students}$$

3. **Regional Affirmative Diversity Quota**:
   $$\sum_{i \in \text{State } k} x_{ij} \le \max\left(1, \lfloor 0.5 \times C_j \rfloor\right) \quad \forall j \text{ with } C_j \ge 3$$
   Guarantees that no single state occupies more than 50% of openings in multi-vacancy opportunities, reserving slots for candidates from aspirational and rural districts.
