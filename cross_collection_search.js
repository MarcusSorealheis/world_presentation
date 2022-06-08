/*

Cross-collection search with $unionWith (https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/)

*/ 


// unsorted

var queryUnsorted = db.companies.aggregate([
  {
    '$search': {
      'text': {
        'query': 'LICENSE NUMBER', 
        'path': 'overview'
      }
    }
  }, {
    '$unionWith': {
      'coll': 'inspections', 
      'pipeline': [
        {
          '$search': {
            'text': {
              'query': 'LICENSE NUMBER', 
              'path': 'business_name'
            }
          }
        }
      ]
    }
  }
])

// debugging my query

var testWithLimit= db.companies.aggregate([
  {
    '$search': {
      'text': {
        'query': 'LICENSE NUMBER', 
        'path': 'overview'
      }
    }
  }, {
    '$addFields': {
      'source': 'overview'
    }
  }, {
    '$limit': 2
  }, {
    '$unionWith': {
      'coll': 'inspections', 
      'pipeline': [
        {
          '$search': {
            'text': {
              'query': 'LICENSE NUMBER', 
              'path': 'business_name'
            }
          }
        }, {
          '$set': {
            'source': 'inspections'
          }
        }
      ]
    }
  }, {
    '$project': {
      'score': {
        '$meta': 'searchScore'
      }, 
      'source': 1, 
      'business_name': 1, 
      'name': 1
    }
  }, {
    '$sort': {
      'score': -1
    }
  }
]);

// results sorted on score

var crossCollectionQuerySorted ([
  {
    '$search': {
      'text': {
        'query': 'LICENSE NUMBER', 
        'path': 'overview', 
        'score': {
          'boost': {
            'value': 1.6
          }
        }
      }
    }
  }, {
    '$addFields': {
      'source': 'companies'
    }
  }, {
    '$unionWith': {
      'coll': 'inspections', 
      'pipeline': [
        {
          '$search': {
            'text': {
              'query': 'LICENSE NUMBER', 
              'path': 'business_name'
            }
          }
        }, {
          '$set': {
            'source': 'inspections'
          }
        }
      ]
    }
  }, {
    '$project': {
      'score': {
        '$meta': 'searchScore'
      }, 
      'source': 1, 
      'business_name': 1, 
      'name': 1
    }
  }, {
    '$sort': {
      'score': -1
    }
  },
  {
    'limit': 10
  }
])

// total count and docs

var totalCountAndDocsQuery = db.companies.aggregate([
  {
    '$search': {
      'text': {
        'query': 'LICENSE NUMBER', 
        'path': 'overview', 
        'score': {
          'boost': {
            'value': 1.6
          }
        }
      }
    }
  }, {
    '$addFields': {
      'source': 'companies', 
      'source_count': '$$SEARCH_META.count.lowerBound'
    }
  }, {
    '$unionWith': {
      'coll': 'inspections', 
      'pipeline': [
        {
          '$search': {
            'text': {
              'query': 'LICENSE NUMBER', 
              'path': 'business_name'
            }
          }
        }, {
          '$set': {
            'source': 'inspections', 
            'source_count': '$$SEARCH_META.countBound'
          }
        }
      ]
    }
  }, {
    '$project': {
      'score': {
        '$meta': 'searchScore'
      }, 
      'source': 1, 
      'business_name': 1, 
      'name': 1, 
      'source_count': 1
    }
  }, {
    '$sort': {
      'score': -1
    }
  }, {
    '$facet': {
      'allDocs': [], 
      'totalCount': [
        {
          '$group': {
            '_id': '$source', 
            'firstCount': {
              '$first': '$source_count.lowerBound'
            }
          }
        }, {
          '$group': {
            '_id': null, 
            'totalCount': {
              '$sum': '$firstCount'
            }
          }
        }
      ]
    }
  }
]);

// total count only

var totalCountQuery = db.companies.aggregate([
  {
    '$searchMeta': {
      'text': {
        'query': 'LICENSE NUMBER', 
        'path': 'overview', 
        'score': {
          'boost': {
            'value': 1.6
          }
        }
      }
    }
  }, {
    '$unionWith': {
      'coll': 'inspections', 
      'pipeline': [
        {
          '$searchMeta': {
            'text': {
              'query': 'LICENSE NUMBER', 
              'path': 'business_name'
            }
          }
        }
      ]
    }
  }, {
    '$group': {
      '_id': 'Total', 
      'total': {
        '$sum': '$count.lowerBound'
      }
    }
  }
]);