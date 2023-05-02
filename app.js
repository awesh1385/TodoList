

const express = require("express");
const bodyParser = require("body-parser");

//we are use local module using node which we have created
const date = require(__dirname + "/date.js");

//data base module/dependencies
const mongoose = require("mongoose");


const app = express();
const _=require("lodash");

app.use(bodyParser.urlencoded({ extended: true }));

//here we are sharing folder where css folder is present
app.use(express.static("public"));

app.set("view engine", 'ejs');


// //list data store in array
// const items=["Eat","Sleep","Repeat"];
// const workItem=[];

//connecting to database
mongoose.connect("mongodb+srv://awesh:Awesh123@atlascluster.yxgyrbn.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};
const Item = mongoose.model("Item", itemSchema);

const listSchmea = {
    name: String,
    items: [itemSchema]
}
const List = mongoose.model("List", listSchmea);




//Presaved Data
const defaultmsg = [{ name: "Welcome to Todolist App" }, { name: "Click on + to add" }, { name: "<-- Click on this to delete" }];



app.get("/", function (req, res) {
    //let day=date.getDay();

    //this will give all the data from Item collection
    Item.find({}).then((data) => {
        if (data.length === 0) {
            Item.insertMany(defaultmsg)
                .then(function () { console.log("done"); }).catch(function (err) {
                    console.log(err);

                });
            res.redirect("/");

        } else {
            //we are passing day and replacing listTitle word in list.ejs
            res.render("list", { listTitle: "Today", newListItems: data });
        }
    });



});

app.get("/:customListName", function (req, res) {
    const customListName =  _.capitalize( req.params.customListName);
    //we are finding the page of name enter by user is exists in database or not id yes then lode the same else create new one
    List.findOne({ name: customListName }).then((data) => {
        if (data != null) {
            res.render("list", { listTitle: data.name, newListItems: data.items })

        }
        else {
            const list = new List({
                name: customListName,
                items: defaultmsg
            })
            list.save();
            res.redirect("/" + customListName);
        }
    })
})




app.post("/", function (req, res) {
    console.log(req.body);

    const itemName = req.body.newItem;
    const listName = req.body.list;

    //saving data into database 
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then((data) => {
            data.items.push(item);
            data.save();
            res.redirect("/" + listName);
        });
    }


});

app.post("/delete", function (req, res) {
    const checkedItemid = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: checkedItemid }).then(function () {
            console.log("deleted");
        }).catch(function (err) {
            console.log(err);
        });
        res.redirect("/");
    } else {
            List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemid}}}).then((data)=>{
                res.redirect("/"+listName);
            });
    }

});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});

