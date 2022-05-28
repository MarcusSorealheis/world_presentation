// uses join queries. 

var joinQuery = db.comments.aggregate([{
  $lookup: {
    from: "users",
    let: { "u": "email" },
    as: "person",
    pipeline: [
      {
        $search: {
          text: {
            query: "ipsum",
            path: "text"
          }
        }
      },
      { $match: { $expr: { $eq: [$$u, "$email"] } } }
    ]
  }
}]);