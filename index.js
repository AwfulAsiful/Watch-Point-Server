const express=require('express');
const app=express();
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const port=process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u4kot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//Middleware
app.use(cors());
app.use(express.json())

async function run(){
    try{
        await client.connect();
        const database=client.db('watchPoint');
        const productsCollection=database.collection('products');
        const ordersCollection=database.collection('orders');
        const reviewsCollection=database.collection('reviews');
        const usersCollection=database.collection('users');
        //GET API for Home Page
        app.get('/products',async(req,res)=>{
            const cursor=productsCollection.find({}).limit(6);
            const products=await cursor.toArray();
            res.json(products);
        })
        //GET API for Explore Page
        app.get('/allProducts',async(req,res)=>{
            const cursor=productsCollection.find({});
            const products=await cursor.toArray();
            res.json(products);
        })

        //GET a single product
        app.get('/allProducts/:id',async(req,res)=>{
            // console.log(req.params.id);
           const result = await productsCollection
           .find({ _id: ObjectId(req.params.id) })
           res.json(result);
           
        })

        //POST API for add product
        app.post('/allProducts',async(req,res)=>{

            const result=await productsCollection.insertOne(req.body);
            res.json(result);
            // console.log(result);
        })
        //DELETE API for allProducts
        app.delete('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.json(result);
            console.log(result);
    
            
        }) 
        
        //POST api for orders
        app.post('/orders',async(req,res)=>{

            const result=await ordersCollection.insertOne(req.body);
            res.json(result);
            console.log(result);
        })
        app.get('/orders',async(req,res)=>{
            const cursor=ordersCollection.find({})
            const orders=await cursor.toArray()
            res.send(orders)

        })

        //UPDATE API for allOrders
        app.put('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const filter={_id:ObjectId(id)}
            const options={upsert:true}
            const updateDoc={
                $set:{
                    status:'Shipped'
                }
            }
            const result=await ordersCollection.updateOne(filter,updateDoc,options)
            res.json(result);
        })
        //GET API for myOrders
        app.get("/orders/:email", async (req, res) => {
            const result = await ordersCollection
              .find({ Email: req.params.email })
              .toArray();
            res.json(result);
          });

        //DELETE API for myOrders
          
       app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) }
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
        console.log(result);

        
    }) 
      //POST api for reviews
      app.post('/reviews',async(req,res)=>{

        const result=await reviewsCollection.insertOne(req.body);
        res.json(result);
        console.log(result);
    })
    //GET API for reviews

    app.get('/reviews',async(req,res)=>{
        const cursor=reviewsCollection.find({})
        const reviews=await cursor.toArray()
        res.send(reviews);
    })
    //POST API for users
      app.post('/users',async(req,res)=>{

        const result=await usersCollection.insertOne(req.body);
        res.json(result);
        console.log(result);
    })
    //Make Admin
    app.put('/users/admin',async(req,res)=>{
        const user=req.body.admin;
        // console.log('user',user);
        const filter={email:user.email};
        // console.log('filter',filter)
        const updateDoc={$set:{role:'admin'}};
        const result=await usersCollection.updateOne(filter,updateDoc);
        res.json(result);
        // console.log(result)
    })

    //Check Admin
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        console.log(email);
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello Madari!!!');
})
app.listen(port,()=>{
    console.log('Listening from port',port);
})