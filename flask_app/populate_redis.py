import redis
import pandas as pd
import numpy
import pickle
r = redis.StrictRedis(host='localhost', port=6379, db=0)

r.flushdb()

with open('../fit_models/lda.p', 'rb') as fp:
    lda_matrix, lda_descriptions, lda_nn = pickle.load(fp)

row_sums = lda_matrix.sum(axis=1)
lda_matrix = lda_matrix / row_sums[:, numpy.newaxis]
lda_matrix = numpy.nan_to_num(lda_matrix)


r.set('lda_features', pickle.dumps(lda_matrix))
r.set('lda_descriptions', pickle.dumps(lda_descriptions))
r.set('lda_nn', pickle.dumps(lda_nn))


with open('../fit_models/nmf.p', 'rb') as fp:
    nmf_matrix, nmf_descriptions, nmf_nn = pickle.load(fp)

row_sums = nmf_matrix.sum(axis=1)
nmf_matrix = nmf_matrix / row_sums[:, numpy.newaxis]
nmf_matrix = numpy.nan_to_num(nmf_matrix)


r.set('nmf_features', pickle.dumps(nmf_matrix))
r.set('nmf_descriptions', pickle.dumps(nmf_descriptions))
r.set('nmf_nn', pickle.dumps(nmf_nn))

story_df = pd.read_pickle('../tokenized_joke.p')

for index, thing in enumerate(story_df.iterrows()):
    _, row = thing
    body, _, title, _ = row
    content_dict = {'id': index, 'title': title, 'body':body}
    r.sadd('item_ids', index)
    r.set('item:{}'.format(index), pickle.dumps(content_dict))
