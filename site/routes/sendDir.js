var router = require('express').Router();
var fs = require('fs');

router.get('/', function(req, res)
	{
		fs.readdir('./apis', function(err, files)
			{
				if(err)
				{
					res.json({"error":true});
					console.error(err.stack);
				}
				else
				{
					console.log(files);
					//var aux = JSON.parse(files);
					res.send(files);
				}
			});
	});

module.exports = router;