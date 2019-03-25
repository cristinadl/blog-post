
const express = require('express');
const uuid = require('uuid');
const app = express();
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();


let postsArray = 	[
						{
							id: uuid.v4(),
							title : 'Title',
							content: 'just for example',
							author: "Cristina",
							publishDate: new Date()
						},

						{
							id: uuid.v4(),
							title : 'Title2',
							content: 'just for example2',
							author: "Cristina",
							publishDate: new Date("March 24 2019 21:00")
						},

						{
							id: uuid.v4(),
							title : 'Title2',
							content: 'just for example2',
							author: "Ricardo",
							publishDate: new Date("March 25 2019 10:00")
						},

						{
							id: uuid.v4(),
							title : 'Title3',
							content: 'just for example3',
							author: "Cristina",
							publishDate: new Date("March 26 2019 10:00")
						}
					];


app.get('/blog-posts', (req, res) => {
	res.status(200).json({
		message : "Successfully sent the list of posts",
		status : 200,
		posts : postsArray
	});
});

app.get('/blog-posts/:author*?', (req, res) =>{
	
	let authorName = req.params.author;

	//wont work unless the path is different to the one that sends the list of posts.
	if(!(authorName)){
		res.status(406).json({
			message: "No author found in path",
			status: 406
		}).send("Finish");
	}

	/*
	if(!("author" in req.body)){
		res.status(406).json({
			message: "No author name given in body",
			status: 406
		}).send("Finish");
	} */

	const authorPosts = [] ;

	postsArray.forEach(item => {
		if(item.author == authorName)
			authorPosts.push(item);
	})

	if(authorPosts.length == 0 || authorPosts == undefined){
		res.status(404).json({
			message: `No ${authorName} ' s post found`,
			status: 404
		}).send("Finish");
	}

	res.status(200).json({
			message: `Successfully found ${authorName} 's posts`,
			status: 200,
			Authorposts : authorPosts
		}).send("Finish");
});

app.post('/blog-posts', jsonParser, (req, res) =>{

	let requireFields = ["title", "content", "author", "publishDate"];

	for( let i = 0; i < requireFields.length; i++){
		let currentField = requireFields[i];
		if( !(currentField in req.body)){
			res.status(406).json({
				message: `Missing field ${currentField} in body`,
				status: 406
			}).send("Finish");
		}
	}

	let title2add = req.body.title;
	let content2add = req.body.content;
	let author2add = req.body.author;
	let date2add = req.body.publishDate;

	let objectToAdd = {
		id: uuid.v4(),
		title : title2add,
		content : content2add,
		author : author2add,
		publishDate : new Date(date2add)
	}

	postsArray.push(objectToAdd);
	res.status(201).json({
		message: `Succesfully added post`,
		status: 201,
		postAdded : objectToAdd
	}).send("Finish");


});

app.delete('/blog-posts/:id*?', jsonParser, (req,res) => {

	if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field id in params.`,
            status: 406
        })
    }
    

    if (!("id" in req.body)) {
        res.status(406).json({
            message: `Missing field id in body.`,
            status: 406
        })
    }    

    let id = req.params.id;


    if( id != req.body.id){
    	res.status(406).json({
	        message: `Id's on body and params don't match`,
	        status: 406
	    }).send("Finish");
    }

    postsArray.forEach(function(item) {
     
        if (id == item.id) {
        	let index = postsArray.indexOf(item);
            postsArray.splice(index,1)
            return res.status(204).json({
                message: `Successfully deleted post`,
                status: 204
            }).send("Finish");
        }
    });

    res.status(404).json({
        message: `Post with id: ${id} doesn't exist`,
        status: 404
    });
});

app.put('/blog-posts/:id*?', jsonParser, (req, res) =>{

	if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field id in params.`,
            status: 406
        })
    }

    let requireFields = ["title", "content", "author", "publishDate"];
    let fields = 3;
	for( let i = 0; i < requireFields.length; i++){
		let currentField = requireFields[i];
		if(!(currentField in req.body))
			fields--;
	}

	if(fields < 0){
		res.status(404).json({
			message: `Missing least one field in body`,
			status: 404
		}).send("Finish");
	}

	let id = req.params.id;

	postsArray.forEach(item =>{
		if(id == item.id){
			if("title" in req.body)
				item.title = req.body.title;
			if("content" in req.body)
				item.content = req.body.content;
			if("author" in req.body)
				item.author = req.body.author;
			if("publishDate" in req.body)
				item.publishDate = new Date(req.body.publishDate);
			res.status(200).json({
				message: `Post updated`,
				status: 200,
				post : item
			}).send("Finish");
		}
	});

	res.status(404).json({
        message: `Post with id: ${id} doesn't exist`,
        status: 404
    });


})


app.listen(8080, () => {
	console.log("Your app is running in port 8080");
});