import { Router, send } from "https://deno.land/x/oak/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import { User } from './models.ts';

const url = "mongodb://localhost:27017";
const db_name = "profiles";

const client = new MongoClient();
const router = new Router();

client.connectWithUri(url);

const db = client.database(db_name);
const users = db.collection("users"); 

router
    .get('/', async (ctx) => {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}/public/`,
            index: 'index.html'
        });
    })
    .get('/user', async (ctx) => {
        await users.find({})
        .then((all_users) => {
            if (all_users != null) {
                ctx.response.status = 200;
                ctx.response.type = "application/json";
                ctx.response.body = all_users;
            }
            else {
                ctx.response.status = 404;
                ctx.response.type = "application/json";
                ctx.response.body = "Resource not found";
            }
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        });
        
    })
    .post('/user', async (ctx) => {

        const body = await ctx.request.body();
        const user:User = body.value;
        console.log(user);

        await users.insertOne(user)
        .then((res) => {
            ctx.response.status = 200;
            ctx.response.type = "application/json";
            ctx.response.body = res;
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        })    
    
    })
    .put('/user', (ctx) => {
        ctx.response.status = 505;
        ctx.response.type = "application/json";
        ctx.response.body = "PUT request on supported on /user";
    })
    .delete('/user', async (ctx) => {
        await users.deleteMany({})
        .then((res) => {
            ctx.response.status = 200;
            ctx.response.type = "application/json";
            ctx.response.body = res;
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        })
    })
    .get('/user/:id', async (ctx) => {
        const id = await ctx.params.id;

        console.log(id);

        await users.findOne({ _id: { "$oid": id}})
        .then((user) => {
            ctx.response.status = 200;
            ctx.response.type = "application/json";
            ctx.response.body = user;
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        });
    })
    .post('/user/:id', (ctx) => {
        ctx.response.status = 505;
        ctx.response.type = "application/json";
        ctx.response.body = "POST request on supported on /user/:id";
    })
    .put('/user/:id', async (ctx) => {
        const id = await ctx.params.id;
        const body = await ctx.request.body();
        const user:User = body.value;

        

        await users.updateOne({ _id: { "$oid": id}}, user)
        .then((user) => {
            ctx.response.status = 200;
            ctx.response.type = "application/json";
            ctx.response.body = user;
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        });
    })
    .delete('/user/:id', async (ctx) => {
        const id = await ctx.params.id;

        await users.deleteOne({ _id:{ "$oid":id }})
        .then((res) => {
            ctx.response.status = 200;
            ctx.response.type = "application/json";
            ctx.response.body = res;
        })
        .catch((err) => {
            ctx.response.status = 500;
            ctx.response.type = "application/json";
            ctx.response.body = err;
        })
        
    });


export default router;