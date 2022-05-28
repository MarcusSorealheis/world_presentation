var crossCollectionQuery = db.companies.aggregate([{
  $search: { text: { query: "State", path: [ "description", "overview"]}}},
    { $unionWith: { coll: "inpections", pipeline: [ { $search: { text: { query: 'State', path: "comments" } } } ] } },
    { $unionWith: { coll: "posts", pipeline: [ { $search: { text: { query: 'State', path: "comments" } } } ] } }
]);

