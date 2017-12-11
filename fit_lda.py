import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.neighbors import NearestNeighbors

joke_df = pd.read_pickle('tokenized_joke.p')
n_features = 5000
n_components = 300

def print_top_words(model, feature_names, n_top_words):
    for topic_idx, topic in enumerate(model.components_):
        message = "Topic #%d: " % topic_idx
        message += " ".join([feature_names[i]
                             for i in topic.argsort()[:-n_top_words - 1:-1]])
        print(message)
    print()


cv = CountVectorizer(max_df=0.95, min_df=2,
                     max_features=n_features,
                     stop_words='english')

tf_matrix = cv.fit_transform(joke_df.tokenized_joke)

lda = LatentDirichletAllocation(n_components=n_components, max_iter=5,
                                learning_method='online',
                                learning_offset=50.,
                                random_state=0)
lda_matrix = lda.fit_transform(tf_matrix)

tf_feature_names = cv.get_feature_names()
print_top_words(lda, tf_feature_names, 20)

topic_descriptions = [[tf_feature_names[i]
                       for i in topic.argsort()[:-25 - 1:-1]]
                      for topic in lda.components_]

feature_nn = NearestNeighbors(n_neighbors=5).fit(lda_matrix)

with open('fit_models/lda.p', 'wb') as fp:
    pickle.dump((lda_matrix, topic_descriptions, feature_nn), fp)
