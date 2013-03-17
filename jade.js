var http = require('http');
var jade = require('jade');
var fs = require('fs');
var url = require('url');
var options = {pretty:true};
var sys = require('sys')
var exec = require('child_process').exec;
	
//updates endswith method for checking extensions better
String.prototype.endswith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

http.createServer(function (req, res) {
	var urlValue = url.parse(req.url, true);
	var query = urlValue.query;
	var href = urlValue.href;//'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
	var pathname = urlValue.pathname;
	
	var requestType = "";
	if(pathname.endswith(".js")) requestType = "script";
	if(pathname.endswith(".css")) requestType = "stylesheet";
	if(pathname.endswith(".jade")) requestType = "jade";
	if(pathname.endswith(".html")) requestType = "html";
	if(pathname.endswith("osinfo")) requestType = "osinfo";
	if(pathname.endswith(".blogpost")) requestType = "blogpost";
	console.log("requestType" +requestType + " pathname:" + pathname);

	//invalid request / default returns index.jade
	if(requestType == "" || pathname == "/"){
		requestType = "jade";
		pathname = "index.jade";
		console.log("invalid request: returning index.jade");
	}

	console.log("requestType:" + requestType + " pathname:" + pathname + " query:" + JSON.stringify(query));
	if(requestType == "stylesheet" || requestType == "html" || requestType == "script")
	{
		var path = __dirname + "/" + pathname;
		console.log("served:" + path)
		fs.readFile(path, function read(err, data) {
			if (err) console.log(err);
			res.writeHead(200);
			res.end(data);
		});
	}

	if(requestType == "osinfo"){		
		exec('cat "uptime:" /proc/uptime "<br/>" /proc/version "<br/>" /proc/cpuinfo "<br/>" /proc/meminfo', function (error, stdout, stderr) {	
			res.writeHead(200);
			res.end(stdout.replace("\n", "<br/>"));
		});
	}

	if(requestType == "jade"){
		var template = __dirname + "/" + pathname;


		console.log("served:" + template)
		fs.readFile(template, function read(err, data) {
			if (err) console.log(err);

			var markup = jade.compile(data, options)({});
			res.writeHead(200, {'content-type': 'text/html'});
			res.end(markup);
		});
	}

	if(requestType == "blogpost"){

		walk("/home/pi/node/blog/blogposts", function(err, results) {
			var files = [];
			for(var i=0; i < results.length; i++){
				var filePoint = results[i].lastIndexOf("/");
				var directory = results[i].substring(0, filePoint+1);
				var filename = results[i].substring(filePoint+1);
				files.push({
					directory:directory,
					filename:filename,
					id: parseInt(filename.substring(0, 6))
				});
			}

			//basic sort of if (date)
			function sort(a, b){
				return a.id - b.id;
			}
			var files = files.sort(sort);

			var index = query["index"];
			if(!index)
				index = 0;
			else 
				index = parseInt(index);

			if(pathname == "latest.blogpost") index = 0;
			if(pathname == "next.blogpost") index = index + 1;
			if(pathname == "prev.blogpost") index = index - 1;
			if(!files[index])
				index = 0;

			fs.readFile(files[index].directory + files[index].filename, function read(err, data) {
				if (err) console.log(err);
				res.end(data);
			});
		});
	}
}).listen(80);


//File walker gets all files recursively in a directory
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};