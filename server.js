

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

const myData = dataService("mongodb+srv://test-user:test123@cluster0.62esx.mongodb.net/sample_supplies?retryWrites=true&w=majority");

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post ("/api/sales", (req,res) => {
    myData.addNewSale(req.body)
    .then(() => {
        res.status(201).json(`new sales has been added`);
    })
    .catch((err)=> {
        res.status(400).json(err);
    });
})


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req,res) => {
    myData.getAllSales(req.query.page, req.query.perPage)
    .then((sales) => {
        res.status(200).json(sales);
    })
    .catch((err)=> {
        res.status(400).json(err);
    });
})


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req,res) => {
    myData.getSaleById(req.params.id)
    .then((sales) => {
        res.status(200).json(sales);
    })
    .catch((err)=> {
        res.status(400).json(err);
    });
})


// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req,res) => {
    myData.updateSaleById(req.body, req.params.id)
    .then(()=> {
        res.status(200).json(`sale ${req.body._id} sucessfully updated`);
    })
    .catch((err)=> {
        res.status(404).json(err);
    });
})


// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req,res)=> {
    myData.deleteSaleById(req.params.id)
    .then(()=> {
        res.status(200).json(`sale ${req.body._id} sucessfully deleted`);
    })
    .catch((err)=> {
        res.status(404).json(err);
    });
})

// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
