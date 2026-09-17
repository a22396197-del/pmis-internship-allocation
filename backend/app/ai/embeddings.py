import numpy as np
from typing import List

_model = None
_model_loaded = False

def get_transformer_model():
    global _model, _model_loaded
    if _model_loaded:
        return _model
    try:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        _model_loaded = True
    except Exception as e:
        # Fallback to TF-IDF cosine similarity if sentence_transformers isn't installed
        _model = None
        _model_loaded = True
    return _model

def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(vec1, vec2) / (norm1 * norm2))

def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Computes semantic similarity between two text snippets (0.0 to 1.0).
    Uses SentenceTransformers if available, otherwise scikit-learn TfidfVectorizer.
    """
    if not text1 or not text2:
        return 0.0

    model = get_transformer_model()
    if model is not None:
        try:
            embeddings = model.encode([text1, text2])
            sim = compute_cosine_similarity(embeddings[0], embeddings[1])
            return max(0.0, min(1.0, (sim + 1.0) / 2.0 if sim < 0 else sim))
        except Exception:
            pass

    # Fallback to TfidfVectorizer cosine similarity
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        tfidf = vectorizer.fit_transform([text1, text2])
        sim_matrix = cosine_similarity(tfidf[0:1], tfidf[1:2])
        return float(max(0.0, min(1.0, sim_matrix[0][0])))
    except Exception:
        # Simple word token Jaccard fallback
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        if not words1 or not words2:
            return 0.0
        return len(words1 & words2) / len(words1 | words2)
