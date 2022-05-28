/* index defintion 

{
  "mappings": {
    "dynamic": true,
    "fields": {
      "certificate_number": {
        "type": "number"
      }
    }
  },
  "storedSource": {
    "include": [
      "certificate_number"
    ]
  }
}

*/
// use db sample_training

db.inspections.aggregate([
  {
    // search and output documents
    $search: {
      "text": {
        "query": "LLC",
        "path": "business_name"
      },
      "returnStoredSource": true // return stored fields only
    }
  },
  // fetch all matched dataset from $search stage and sort it
  {
    $sort: {"certificated_number": -1}
  },
  // discard everything except top 10 results
  {
    $limit: 10
  }
])