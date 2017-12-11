import pandas as pd
import pickle
from sklearn.decomposition import NMF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

joke_df = pd.read_pickle('tokenized_joke.p')

def print_top_words(model, feature_names, n_top_words):
    for topic_idx, topic in enumerate(model.components_):
        message = "Topic #%d: " % topic_idx
        message += " ".join([feature_names[i]
                             for i in topic.argsort()[:-n_top_words - 1:-1]])
        print(message)
    print()

tfidf_vectorizer = TfidfVectorizer(max_df=0.95, min_df=2,
                                   max_features=5000,
                                   stop_words='english')

tfidf = tfidf_vectorizer.fit_transform(joke_df.tokenized_joke)

nmf = NMF(n_components=100, random_state=1,
          alpha=.1, l1_ratio=.5)

nmf_matrix = nmf.fit_transform(tfidf)

tfidf_feature_names = tfidf_vectorizer.get_feature_names()
print_top_words(nmf, tfidf_feature_names, 20)

topic_descriptions = [[tfidf_feature_names[i]
                       for i in topic.argsort()[:-25 - 1:-1]]
                      for topic in nmf.components_]

feature_nn = NearestNeighbors(n_neighbors=5).fit(nmf_matrix)

with open('fit_models/nmf.p', 'wb') as fp:
    pickle.dump((nmf_matrix, topic_descriptions, feature_nn), fp)
