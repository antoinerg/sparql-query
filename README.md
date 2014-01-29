sparql-query
============

sparql-query is a simple library that aims to unobstrusively enrich web page with linked data by querying SPARQL endpoint aynschronously.

Disclaimer
----------

I am not a JS developer and this code probably won't follow best practice. Be advised!

Examples
--------

For a working example of sparql-query, visit this [example page][braindead]

Usage
-----

### Usage

jQuery

```html
<script id="braindead_video" type="text/sparql">
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX schema: <http://schema.org/>

SELECT ?url WHERE {
 ?movie owl:sameAs <http://www.dbpedialite.org/things/142588#id> .
 ?file schema:encodesCreativeWork ?movie .
 ?file schema:embedUrl ?url .
} LIMIT 1</script>
```

### Custom Events

sparql-query triggers the following custom events:

* `sparql:initialized` - Triggered after initialization
* `sparql:#id` - Triggered after successfully running SPARQL query #id
* `sparql:#id:error` - Trigger if SPARQL query #id fails

[braindead]: http://antoineroygobeil.com/blog/2013/12/17/braindead/