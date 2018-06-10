const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const authorizeUser = require('./controllers/authorizeUser').authorizeUser;

const port = process.env.PORT || 1111;
global.__base = __dirname;


let app = express();

app.db = mongoose.createConnection('mongodb://sejal:sejal@ds119772.mlab.com:19772/xltomon');
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log('mongodb://sejal:sejal@ds119772.mlab.com:19772/xltomon');
});


if (!fs.existsSync(__base + '/fileStorage/')) {
	fs.mkdirSync(__base + '/fileStorage/')
}
app.use(express.static(__dirname + '/fileStorage'));

require('./models').models(app,mongoose);

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __base + '/fileStorage/');
	}
});
let upload = multer({ //multer settings
	storage: storage
}).single('file');

app.get("/" , (req,res)=>{
res.json({status:true,message:"success"})
})

app.post('/', authorizeUser, upload, (req, res) => {
	if (!fs.existsSync(__base + '/fileStorage/' + req.userName)) {
		fs.mkdirSync(__base + '/fileStorage/' + req.userName)
	}
	if (fs.existsSync(__base + '/fileStorage/' + req.userName + "/" + req.file.originalname)) {
		const fileName = req.file.originalname.split(".")[0] + "-" + Date.now() + "." + req.file.originalname.split(".")[1];
		fs.copyFileSync(req.file.path, __base + '/fileStorage/' + req.userName + "/" + fileName);
		fs.unlinkSync(req.file.path);
		res.json({ status: true, message: "success", url: `http://${req.headers.host}/${req.userName}/${fileName}` });
	}
	else {
		fs.copyFileSync(req.file.path, __base + '/fileStorage/' + req.userName + "/" + req.file.originalname);
		fs.unlinkSync(req.file.path);
		res.json({ status: true, message: "success", url: `http://${req.headers.host}/${req.userName}/${req.file.originalname}` });
	}
});

app.post('/file', authorizeUser, (req, res) => {
	const fileArray = fs.readdirSync(`${__dirname}/fileStorage/${req.userName}`);
	let urlArray = fileArray.map(element => {
		return {
			name: element,
			url: `http://${req.headers.host}/${req.userName}/${element}`
		}
	});
	res.json({ status: true, data: urlArray });
});

app.listen(port, () => {
	console.log("Server running on port ->", port);
});
