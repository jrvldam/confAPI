var router = require('express').Router();
var fs = require('fs');

router.post('/', function(req, res)
{
	// ESCRIBIR EL JSON
	var objString = JSON.parse(req.body.datos);
	var path = './apis/';
	if(!fs.existsSync(path)) 
	{ 
		require('mkdirp').sync(path) 
	}
	var fileName = path + objString.generales.txtID + '.json';
	fs.writeFile(fileName, JSON.stringify(objString), 'utf8', function(err)
		{
			if(err)
			{
				console.log(err);
				res.send('ERROR EN LA ESCRITURA!');
				throw err;
			}
			else
			{
				res.send('0k');
			}
		});
});

module.exports = router;