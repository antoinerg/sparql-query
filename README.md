sparql-query
============

sparql-query is a jQuery library that helps unobstrusively enrich web pages with linked data by querying SPARQL endpoint.

Why?
----

My motivation for writing this library is to enable a web page to enrich its content by querying users' SPARQL endpoint (possibly) sitting behind their firewall.

For example, a blog post about a movie could query my private SPARQL endpoint to check whether I have seen the movie or if it is possible to stream it from my internal network. Pages could intelligently adapt their content to visitors and embed copyrighted content in pages without touching the server. Obviously, SPARQL endpoints have to authorize such requests by allowing [CORS][cors]. Fine-grained authorization schemes are available in different triple store.

Disclaimer
----------

I am not a JS developer and this code probably won't follow best practice. Be advised!

Features
--------

* User can specify location of their SPARQL endpoint
* SPARQL queries can be inspected by the user to see the vocabulary used
* Status of the queries are displayed
* Integration with sparql-query is done through jQuery events

Examples
--------

For a working example of sparql-query, visit this [example page][braindead]

Usage
-----

Upon initialization, sparql-query will run every `script[type="text/sparql"]` elements against the configured endpoint.

### Example

Below is an example SPARQL query embedded in the HTML page.

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

Integration with sparql-query is done through jQuery events. The following script subscribes to events related to `#braindead_video` and handles the response:

```javascript
<script type="text/javascript">
$(document).on("SPARQL:braindead_video", function(evt) {
		var data = evt.doc;
		try { // Throws error if url is undefined or empty
			var url = data['results']['bindings'][0]['url']['value'];
			if (url == "") {
				throw exception;
			}
			// We have a URL! Let's embed the movie
			$('#movie-placeholder').html(Handlebars.templates['video']({url:url}));
		}
		catch(err) { // Error
			$.event.trigger({
            	type: "SPARQL:braindead_video:error",
                doc: {status:"braindead_video",statusText:"No embeddable video file for Braindead found in your library"}
            });
		}
});
</script>
```

### Custom Events

sparql-query triggers the following custom events:

* `sparql:initialized` - Triggered after initialization
* `sparql:#id` - Triggered after successfully running SPARQL query #id
* `sparql:#id:error` - Trigger if SPARQL query #id fails

[braindead]: http://antoineroygobeil.com/blog/2013/12/17/braindead/
[cors]: http://en.wikipedia.org/wiki/Cross-origin_resource_sharing

### Look and Feel

By default, the widget created by sparql-query is going to look ugly and you'll want to style it to ensure it fits into the theme of your web page. Below is a Handlebars template describing the DOM structure of the sparql-query widget.

```html
<div id="linkeddata">
  <a id="linkeddata_logo" href="#">Linked data</a>
  <div id="linkeddata_information">
    <form id="linkeddata_form" onsubmit="return false;">
    	<label for="linkeddata_endpoint">SPARQL endpoint:</label>
      <input name="linkeddata_endpoint" id="linkeddata_endpoint" type="text" value="{{endpoint}}"/>    
    </form>

    <div id="linkeddata_queries">
      <ul>
      {{#each queries}}
      <li id="linkeddata_query_{{this.id}}">
        <a href="#" class="linkeddata_alert"></a>
        <div class="linkeddata_debug">
          <div class="linkeddata_result">
            <pre class="linkeddata_result"></pre>
          </div>
          <div class="linkeddata_query">
          	<textarea rows="15">{{this.q}}</textarea>
          </div>
        </div>
      </li>
    {{/each}}
      </ul>
    </div>
  </div>
</div>
```