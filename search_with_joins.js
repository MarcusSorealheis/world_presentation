// uses join queries. 

var db = sample_mflix,
  joinQuery = db.comments.aggregate([
    {
      '$search': {
        'text': {
          'query': 'Ned Stark', 
          'path': 'name'
        }
      }
    }, {
      '$lookup': {
        'from': 'comments', 
        'localField': 'name', 
        'foreignField': 'name', 
        'as': 'commentsFromNed', 
        'pipeline': [
          {
            '$search': {
              'range': {
                'path': 'date', 
                'gt': new Date('Sat, 01 Jan 2000 00:00:00 GMT')
              }
            }
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$commentsFromNed'
      }
    }, {
      '$replaceRoot': {
        'newRoot': '$commentsFromNed'
      }
    }
  ]);