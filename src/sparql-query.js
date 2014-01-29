$(document).ready(function() {
    SPARQL.initialize();
    SPARQL.run();
})

window.SPARQL = {
    initialize: function() {
        if (Modernizr.localstorage) {
          // window.localStorage is available!
          var queries = $('script[type="text/sparql"]');
          this.queries = [];
          if (queries.length) {
            $.each(queries,function(i,query) {
                //console.log(this.queries);
                q = {
                  id: $(query).attr('id'),
                  q: $(query).html(),
                  alert: function(h) {
                    $('#linkeddata_query_' + this.id + ' a.linkeddata_alert').html(h).show();
                  },
                  result: function(data) {
                    $('#linkeddata_query_' + this.id + ' pre.linkeddata_result').html(data).show();
                  }
                }
                SPARQL.queries.push(q);
                $(document).on("SPARQL:" + q.id + ":error", function(evt) {
                  var jqXHR = evt.jqXHR;
                  if (jqXHR.status == 0) {
                    jqXHR.status = "Error";
                    jqXHR.statusText = "Can't access requested resource."
                  };
                  q.alert(Handlebars.templates['linkeddata_alert']({
                    jqXHR: jqXHR,
                    class: "error"
                  }));
                  $('#linkeddata_logo').removeClass('active');
                });

            });

            // Add widget to page
            $('div.entry-content').prepend(Handlebars.templates['linkeddata']({
                endpoint:SPARQL.getEndpoint(),
                queries: this.queries
            }));
            this.addCallback();
          }
        } else {
          // no native support for HTML5 storage :(
          // maybe try dojox.storage or a third-party solution
          console.log('SPARLQ - No localstorage')
          return false;
        }    
    },
    addCallback: function() {
      $('#linkeddata_logo').toggle(function() {
          $('#linkeddata_information').addClass('active');
      },function() {
          $('#linkeddata_information').removeClass('active');
      });

      $('.linkeddata_alert').toggle(function() {
          $(this).next('div.linkeddata_debug').show();
      },function() {
          $(this).next('div.linkeddata_debug').hide();
      });

      $('#linkeddata_form').submit(function(evt) {
          SPARQL.setEndpoint($('#linkeddata_endpoint').val());
      });
    },
    run: function() {
        var error = false;
        $.each(this.queries,function(i,query) {
            var id = query.id;
            var encoded_q = encodeURIComponent(query.q);
            //$(alert).html("").hide();
            //$(result).html("").hide();
            SPARQL.execute(encoded_q,function(data) {
                $.event.trigger({
                    type: "SPARQL:" + id,
                    doc: data
                });
                query.result(JSON.stringify(data));
                query.alert(Handlebars.templates['linkeddata_alert']({
                  class:"success",
                  jqXHR:{status:"OK",statusText:"Success!"}
                }));
            },function(jqXHR){
              console.log(jqXHR)
                $.event.trigger({
                    type: "SPARQL:" + id + ":error",
                    jqXHR: jqXHR
                });
                error = error || true;
                query.result(jqXHR.responseText);
            });
        })
        if (error) {
          $('#linkeddata_logo').removeClass('active');
        } else {
          $('#linkeddata_logo').addClass('active');
        }
        },
    execute: function(query,cb,error_cb) {
      var uri = this.getEndpoint() + "?query=" + query;
        console.log('SPARQL: Requesting ' + uri);
        $.ajax({
            dataType: "json",
            url: uri,
            success: function(data){
             cb(data);
            },
            error: function(jqXHR) {
              error_cb(jqXHR);
            }
        })
    },
    getEndpoint: function() {
      if (localStorage.getItem("SPARQL.endpoint") === null) {
            return false;
    } else {
        return localStorage.getItem('SPARQL.endpoint');
      }
    },
    setEndpoint: function(endpoint) {
      if (endpoint === "") {
        return this.clearEndpoint();
      } else {
        localStorage.setItem('SPARQL.endpoint',endpoint) ;
        $('#linkeddata_logo').addClass('active');
        //$('#linkeddata_information').removeClass('active');
        this.run();
        return true;
      }
    },
    clearEndpoint: function() {
      localStorage.removeItem('SPARQL.endpoint');
      $('#linkeddata_logo').removeClass('active');
    }
}