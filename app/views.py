from flask import jsonify, render_template, request
from app import app, cache
from app.models import Entity, Category, Keyperson, Revenue, Expense, Funding, Investment, Relation, Dataconnection, Collaboration, Employment, Relation
from database import db
from api import update
import json


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entities')
@cache.cached(key_prefix='entities', timeout=None)
def get_entities():
    return jsonify(
        nodes=nodes(),
        funding_connections=funding_connections(),
        investment_connections=investment_connections(),
        data_connections=data_connections(),
        collaboration_connections=collaboration_connections(),
        employment_connections=employment_connections(),
        relation_connections=relation_connections()
    )

@app.route('/categories')
@cache.cached(key_prefix='categories', timeout=None)
def categories():
    return jsonify(categories=[category.json() for category in Category.query.all()])

def nodes():
    return [entity.json() for entity in Entity.query.all()]

def funding_connections():
    # Watch out for IDs/indexes: http://stackoverflow.com/a/16824896
    return [{'source': f.giver_id, 'target': f.receiver_id} for f in Funding.query.all()]

def investment_connections():
    return [{'source': i.giver_id, 'target': i.receiver_id} for i in Investment.query.all()]

def data_connections():
    return [{'source': d.giver_id, 'target': d.receiver_id} for d in Dataconnection.query.all()]

def collaboration_connections():
    return [{'source': c.entity_id1, 'target': c.entity_id2} for c in Collaboration.query.all()]

def employment_connections():
    return [{'source': e.entity_id1, 'target': e.entity_id2} for e in Employment.query.all()]

def relation_connections():
    return [{'source': r.entity_id1, 'target': r.entity_id2} for r in Relation.query.all()]

@app.route('/save', methods=['POST'])
def save():
    data = json.loads(request.data)['entity']
    entity = Entity.query.get(data['id'])
    update(entity, data)
    cache.clear()
    return get_entities()
