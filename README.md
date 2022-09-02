# Atlas Search MongoDB World 2022

In this repository, you will find code examples from the demos presented by Atlas Search Product Managers Marcus Eagan and Elle Shwer. You can find code examples corresponding to the following use cases:

## Cross-Collection Search - `$unionWith`

In many cases, users would like to search across more than one collection in a database. In 6.0-0, we introduced the ability to do cross collection searches with `$unionWith` and `$search` sub-pipelines. For an example, check out [cross_collection_search.js](./cross_collection_search.js).

## Search with Joins - `$lookup`

In many cases, users would like to filter results from `$search` queries targeting one collection, say purchases, with data from another collection, like users. To prefer a join between two search indexes, you need to use `$lookup` as documented in [search_with_joins.js](./search_with_joins.js).

## Search with Stored Source `returnedStoredSource`

When you need to perform aggregations after `$search` on large result sets, `$sort`, `$match`, `$limit` and `$skip` stages could perform faster with stored source. 40,000 documents is an imprecise rule of thumb for large result sets. Check out [stored_source_search.js](./cross_collection_search.js).

## Autocomplete Improvements

There were 3 major improvements introduced to the `autocomplete` operator over the past year. The first allows users to run `autocomplete` against any of our Atlas Search Analyzers. Now you can have type-as-you-go and partial search against multi-lingual data.

The second allows users to boost exact matches in the `autocomplete` operator. 

The third adds `rightEdgeGram tokenization` strategy to create edgeGram-like tokens starting at the right side of words (instead of the left side). 

An example of each is documented in [mdbw-autocomplete-improvements.js](./mdbw-autocomplete-improvements.js)
