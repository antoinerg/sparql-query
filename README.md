sparql-query
============

sparql-query is a jQuery library that helps unobstrusively enrich web pages with linked data by querying SPARQL endpoint.

Why?
----

My motivation for writing this library is to enable a web page to enrich its content by querying users' SPARQL endpoint (possibly) sitting behind their firewall.

For example, a blog post about a movie could query my private SPARQL endpoint to check whether I have seen the movie or if it is possible to stream it from my internal network. Pages could intelligently adapt their content to visitors and embed copyrighted content in pages without touching the server. Obviously, SPARQL endpoints have to authorize such requests by allowing [CORS][cors]. Fine-grained authorization scheme are available in different triple store.

Disclaimer
----------

I am not a JS developer and this code probably won't follow best practice. Be advised!

Examples
--------

For a working example of sparql-query, visit this [example page][braindead]

Usage
-----

### Usage

sparql-query will run every `script[type="text/sparql"]` elements against the configured endpoint.

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
} LIMIT 1
</script>
```

### Custom Events

sparql-query triggers the following custom events:

* `sparql:initialized` - Triggered after initialization
* `sparql:#id` - Triggered after successfully running SPARQL query #id
* `sparql:#id:error` - Trigger if SPARQL query #id fails

[braindead]: http://antoineroygobeil.com/blog/2013/12/17/braindead/
[cors]: http://en.wikipedia.org/wiki/Cross-origin_resource_sharing