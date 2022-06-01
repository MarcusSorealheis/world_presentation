/* index defintion for non-standard index analyzer
{
  "analyzer": "lucene.english",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": [
        {
          "dynamic": true,
          "type": "document"
        },
        {
          "type": "autocomplete"
        }
      ]
    }
  }
}
*/

// use sample db movies
db.movies.aggregate([
  {
    // search and output documents
    $search: {
      "autocomplete": {
        "query": "pri",
        "path": "title"
      }
    }
  },
  // discard everything except top 10 results
  {
    $limit: 10
  },
  // project title and search score
  {
    $project: {
        "_id": 0,
        "title": 1,
        "score": { $meta: "searchScore" }
      }
  }
])

/* index defintion for non-standard index analyzer and boosting for exact matches
{
  "analyzer": "lucene.english",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": [
        {
          "dynamic": true,
          "type": "document"
        },
        {
          "analyzer": "lucene.english",
          "searchAnalyzer": "lucene.english",
          "type": "string"
        },
        {
          "type": "autocomplete"
        }
      ]
    }
  }
}
*/

// use sample db movies
db.movies.aggregate([
    {
      $search: {
          // compound combines the autocomplete operator and the text operator to boost for exact matches
        "compound": {
          "should": [{
            "autocomplete": {
              "path": "title",
              "query": "prince",
              "score": { "boost": { "value": 3}}
            }
          },
          {
            "text": {
              "path": "title",
              "query": "prince",
              "fuzzy": { "maxEdits": 1 }
            }
          }]
        }
      }
    },
  // discard everything except top 10 results
    {
      $limit: 10
    },
  // project the title and search score 
    {
      $project: {
        "_id": 0,
        "title": 1,
        "score": { $meta: "searchScore" }
      }
    }
  ])
  

/* index defintion example for rightEdgeGram
{
  "analyzer": "lucene.arabic",
  "searchAnalyzer": "lucene.arabic",
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": [
        {
          "dynamic": true,
          "type": "document"
        },
        {
          "tokenization": "rightEdgeGram",
          "type": "autocomplete"
        }
      ]
    }
  }
}
*/