$().ready(function(){
	var blog = new Blog();
	blog.Initialise();
});

function Blog(){};
Blog.prototype.Initialise = function(){
	$("button[data-ref='Blog']").click(Blog.prototype.ButtonBlog_Clicked);
	$("button[data-ref='Ideas']").click(Blog.prototype.ButtonIdeas_Clicked);
	$("button[data-ref='Pi']").click(Blog.prototype.ButtonPi_Clicked);
	$("button[data-ref='Contact']").click(Blog.prototype.ButtonContact_Clicked);
};

Blog.prototype.ButtonBlog_Clicked = function(){
	$.ajax({
		url: "latest.blogpost",
		success: function(response){
			$(".main").html(response);
		}
	});
};

Blog.prototype.ButtonBlog_LatestClicked = function(){
	$.ajax({
		url: "latest.blogpost",
		success: function(response){
			$(".main").html(response);
		}
	});
};
Blog.prototype.ButtonBlog_NextClicked = function(){
	$.ajax({
		url: "next.blogpost",
		success: function(response){
			$(".main").html(response);
		}
	});
};
Blog.prototype.ButtonBlog_PrevClicked = function(){
	$.ajax({
		url: "prev.blogpost",
		success: function(response){
			$(".main").html(response);
		}
	});
};

Blog.prototype.ButtonIdeas_Clicked = function(){
	$(".main").html("Ideas");
};

Blog.prototype.ButtonPi_Clicked = function(){
	$.ajax({
		url: "osinfo",
		success: function(response){
			$(".main").html(response);
		}
	});
};

Blog.prototype.ButtonContact_Clicked = function(){
	$.ajax({
		url: "contact.jade",
		success: function(response){
			$(".main").html(response);
		}
	});
};