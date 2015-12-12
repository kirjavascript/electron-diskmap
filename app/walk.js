var walk = function(dir, dirCB, fileCB, done) {

    var results = [];
    dirCB(dir);

    fs.readdir(dir, function(err, list) {

        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        //console.log(list);
        list.forEach(function(file) {

            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat) {

                if(stat) {
                    fileCB(file, stat['size']);
                }

                if (stat && stat.isDirectory()) {
                    walk(file, dirCB, fileCB, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

window.addEventListener("load", function() {
    walk("/home/thom",
    	function(dir) {
            writeDir(dir);
    	},
    	function(file, size) {
            writeFile(file, size);
    	},
    	function(err,results) {
    		alert("done")
    	})
})

var data = {"children": []};
var lookup = {};

function writeDir(d) {
    d=d.split("/")
    d.shift();

    var obj = data.children;
    var lku = lookup;

    for(var i=0;i<d.length;i++) {
        if(lku[d[i]]==null) {
            lku[d[i]] = {"__index":obj.length};
            obj.push({"name":d[i],"children":[],"index":d})
        }
        lku = lku[d[i]];
        obj = obj[lku.__index].children
    }
    tree();
    return obj;
}

function writeFile(d,s) {
    d=d.split("/")
    f=d.pop()

    dir = writeDir(d.join("/"));
    dir.push({"name":f,"size":s})
    //tree()
}
