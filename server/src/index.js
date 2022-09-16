const express=require('express');
const cors=require('cors');
const user=require('./routes/user-routes');
const expenses=require('./routes/expense-routes')
const dashboard=require('./routes/dashboard-routes');
const reports=require('./routes/reports-routes');


const app=express();
app.use(cors());
app.use(express.json());
app.use("/user",user);
app.use("/expenses",expenses);
app.use("/dashboard",dashboard);
app.use("/reports",reports);

app.listen(process.env.PORT || 3001,()=>{
    console.log("Server started!");
});
