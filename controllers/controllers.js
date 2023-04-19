exports.serverError= function(err, req, res, next) {
    console.error(err);
    res.status(500);
    res.type('text/plain'); 
    res.send('Internal Server Error.'); 
}

exports.landing_page = function(req, res) {
    // res.status(200);
    // console.log("----------------------")
    // console.log(req)
    // console.log("----------------------")
    // console.log(res)
    // console.log("----------------------")
    res.render('home', {
        'title': 'MyWellbeingApp - Home'
    });
    //todo error handling
}

// exports.entries_list = function(req, res) { 
//    res.send('<h1>Guestbook Messages</h1><p>Not yet implemented:will show a list of guest book entries.</p>'); 
// } 

// exports.new_entry = function(req, res) {     
//     res.send('<h1>Not yet implemented: show a new entry page.</h1>'); 
// }

// exports.about_page= function(req, res) { 
//     res.status(200);  
//     res.redirect('/about.html');
// }

exports.notFound= function(req, res) { 
    res.status(404); 
    res.type('text/plain');
    res.send('404 Not found.');
}
