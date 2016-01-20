var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var google = require('google');
var app     = express();

app.get('/scrape', function(req, res){
	
	url = 'http://www.lachacragrowshop.cl/';

	request(url, function(error, response, html){
		if(!error){
			console.log(html);

			var $ = cheerio.load(html);

			var product_name, product_price, product_image;
			var json = { product_name : "", product_price : "", product_image : ""};

			$('.tab-content').filter(function(){
		        var data = $(this);
		        title = data.children().first().text();
		        release = data.children().last().children().text();

		        json.title = title;
		        json.release = release;
	        })

	        $('.star-box-giga-star').filter(function(){
	        	var data = $(this);
	        	rating = data.text();

	        	json.rating = rating;
	        })
		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        	console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your fucking console!')
	})
})

app.get('/google', function(req, res){

	google.resultsPerPage = 25
	var nextCounter = 0

	google('growshop', function (err, next, links)
	{
	  if (err) console.error(err)

	  console.log(links);

	  for (var i = 0; i < links.length; ++i) 
	  {
	    console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
	    console.log(links[i].description + "\n")
	  }

	  if (nextCounter < 4) {
	    nextCounter += 1
	    if (next) next()
	  }
	})

	res.send('Check your google console!')
})

app.get('/cbl', function(req, res){
	
	url = 'http://cobranza.poderjudicial.cl/SITCOPORWEB/ConsultaDetalleAtPublicoAccion.do?TIP_Consulta=1&ROL_Causa=3789&TIP_Causa=P&ERA_Causa=2008&CRR_IdCausa=182125&COD_Tribunal=1329&';

	request(url, function(error, response, html){
		if(!error){

			var $ = cheerio.load(html);	

			var documento, etapa, tramite, desc_tramite, of, est_firma, fecha_tramitacion;
			
			var json = {
				documento : "",
				etapa : "",
				desc_tramite : "",
				of : "",
				est_firma : "",
				fecha_tramitacion: ""
			};

			var i = 0;

			console.log(html);

			$('.textoPortal').eq(1).children().each(function(td){
        		$(this).find('td').each(function() {

        			switch(i)
        			{
        				case 0:
        					json.documento = $(this).html().replace("\t", "", "gi");
        					break;
        				case 1:
        					json.etapa = $(this).html();
        					break;
        				case 2:
        					json.desc_tramite = $(this).html();
        					break;
        				case 3:
        					json.of = $(this).html;
        					break;
        				case 4:
        					json.est_firma = $(this).html();
        					break;
        				case 5:
        					json.fecha_tramitacion = $(this).html();
        					break;
        			}

        			if (i == 5)
        			{
        				console.log(json);
        				fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        					console.log('File successfully written! - Check your project directory for the output.json file');
        				})

        				i = 0;
        			}
        			else
        			{
        				i = i + 1;
        			}

    			});
			});
		}

        res.send('Check your fucking console!')
	})
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app; 	