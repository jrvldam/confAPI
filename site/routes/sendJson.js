var router = require('express').Router();
var fs = require('fs');

router.get('/', function(req, res)
{
	var path = './apis/' + req.query.name + '.json';
	// LEER Y ENVIAR JSON
	fs.readFile(path, 'utf8', function(err, data)
		{
			if(err)
			{
				res.json({"error":true});
				console.error(err.stack);
			}
			else
			{
				res.json(JSON.parse(data));
				console.log(req.query.name + '.json enviado!\n');
			}
		});
});

module.exports = router;