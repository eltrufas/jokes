'''
Aplicación web simple para sistemas de recomendación
'''
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_redis import FlaskRedis


app = Flask(__name__)
app.config.from_object('default_settings')
redis_store = FlaskRedis(app)

topic_method = 'lda'

def load_feature_matrix():
    """
    Carga la matriz de caracteristicas almacenada en redis
    """
    return pickle.loads(redis_store.get('{}_features'.format(topic_method)))

def load_knn():
    """
    Carga el modelo de N vecinos cercanos para articulos
    """
    return pickle.loads(redis_store.get('{}_nn'.format(topic_method)))

def load_topic_descriptions():
    return pickle.loads(redis_store.get('{}_descriptions'.format(topic_method)))

def build_user_pref_vector(user_id, feature_matrix=None):
    if feature_matrix is None:
        feature_matrix = load_feature_matrix()
    ratings = redis_store.hgetall('ratings:{}'.format(user_id))
    ratings = {int(key): int(val) for key, val in ratings.items()}

    if not len(ratings):
        return np.zeros(feature_matrix.shape[1]), np.asarray([])

    item_array = np.asarray([key for key in ratings])
    rating_array = np.asarray([ratings[key] for key in item_array])
    pref_vector = (rating_array.reshape(-1, 1) * feature_matrix[item_array]).sum(axis=0)

    return pref_vector, item_array


def get_item(item_id):
    return pickle.loads(redis_store.get('item:{}'.format(item_id)))


def recommend(user_id, n=1, feature_matrix=None):
    if feature_matrix is None:
        feature_matrix = load_feature_matrix()
    num_ratings = redis_store.hlen('ratings:{}'.format(user_id))
    if not num_ratings:
        ids = redis_store.srandmember('item_ids', n)

        return [get_item(int(item_id)) for item_id in ids]
    else:


        user_pref, item_array = build_user_pref_vector(user_id, feature_matrix)

        pred_ratings = (feature_matrix @ user_pref.reshape(-1, 1)).flatten()
        pred_ratings[item_array] = -np.inf
        recommendations = np.argsort(pred_ratings)[-n:]
        return [get_item(item_id) for item_id in recommendations]


def generate_user_profile(user_id, n=5):
    feature_matrix = load_feature_matrix()

    recommendations = recommend(user_id, 5, feature_matrix)

    preferences, _ = build_user_pref_vector(user_id, feature_matrix)
    print(preferences)
    topic_descriptions = load_topic_descriptions()
    sorted_topic_indices = np.argsort(preferences)[-n:]
    topics = [{'id': int(i), 'description': topic_descriptions[i]} for i in sorted_topic_indices]
    topics = topics[::-1]

    return jsonify({'id': user_id, 'recommendations': recommendations,
                    'topics': topics})


def similar_items(item_id):
    nn = load_knn()
    feature_matrix = load_feature_matrix()
    features = feature_matrix[item_id]
    _, neighbors = nn.kneighbors(features.reshape(1, -1))
    neighbors = neighbors.flatten()[1:]
    neighbors = [get_item(int(n)) for n in neighbors]
    return neighbors


@app.route('/api/user', methods=['POST'])
def create_user():
    """
    Crea un usuario vacio nuevo y regresa recomendaciones iniciales
    """
    new_id = redis_store.incr('next_id')
    return generate_user_profile(new_id)


@app.route('/api/user/<int:user_id>')
def get_user_profile(user_id):
    return generate_user_profile(user_id)


@app.route('/api/user/<int:user_id>/ratings')
def get_user_ratings(user_id):
    ratings = redis_store.hgetall('ratings:{}'.format(user_id))
    ratings = {int(key): int(val) for key, val in ratings.items()}

    build_user_pref_vector(user_id)

    return jsonify(ratings)


@app.route('/api/item/<int:item_id>/similar')
def get_similar_items(item_id):
    neighbors = similar_items(item_id)
    return jsonify(list(neighbors))


@app.route('/api/user/<int:user_id>/rating/<int:item_id>', methods=['POST'])
def rate_item(user_id, item_id):
    """
    Permite a un usuario crear una calificacion sobre un articulo.
    """
    rating = request.get_json(force=False, silent=False, cache=True)
    redis_store.hset('ratings:{}'.format(user_id),
                     item_id, int(rating))

    similar = similar_items(item_id)
    new_recs = recommend(user_id, 4)

    return jsonify({'similar': similar, 'recommended': new_recs})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'You want path: %s' % path

if __name__ == '__main__':
    app.run(port=5000)
