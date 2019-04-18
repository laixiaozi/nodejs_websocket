const express = require("express");
const app = express();
const http = require("http").Server(app);
const io  = require("socket.io")(http);
// cookie操作: https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");
//1.5.0版本以后不再需要cookie-parser来支持cookie的操作。express-session会自己操作cookie
//https://www.npmjs.com/package/express-session
const session = require("express-session");

//mongodb存储session
const MongoStore = require("connect-mongo")(session);


const secret = 'laixiaozi';
var cookieExpires = new Date(new Date().getTime() + 3600 * 8 * 1000 + 60 * 1000);  //有效时间60秒
console.log("cookieExpires :",cookieExpires.toUTCString());

app.use(express.static("public"));
app.set("views","public/views");
app.set("view engine","pug");



//使用cookie
// app.use(cookieParser(secret,{
//     signed:true,
// }));


//设置一个nid 到客户端cookie
// app.use((request, response, next)=>{
//     response.cookie("sid","中文测试一个cookie",{
//         signed:true,
//         expires:cookieExpires.toUTCString()
//     });
//    next();
// });

//自动解析会话
// app.use(function(request, response, next){
//     console.log("signedCookies:" , request.signedCookies);
//     console.log("Cookies" ,request.cookies);
//     next();
// });


//使用会话

app.use(session({
    secret:secret,
    name:"nsid",
    resave:false,//是否重新生成 sid 强制重新保存
    saveUninitialized:true,//持久化
    cookie:{
        domain:"localhost",
        // expires:cookieExpires.toUTCString(),
        maxAge:1000 * 3, //毫秒
        //打开cookie以后就会每次都生成一个sid 因为不是https链接
        // 并且secure设置了true所以cookie不会返回到服务器，所以每次都生成一个
        //  非https链接 secure 应该设置为false;
        secure: false,//是否加密
    },
    store: new MongoStore({
        url:"mongodb://localhost:27017/sessiondb",
    })
}));



app.get("/",function (request , response) {
    response.setHeader("Content-type","text/html;charset=utf-8");
    console.log(request.session.id);
    response.render("index",{"title":"测试"});
});

io.on("connection",function (sockets) {
    sockets.on("test",function (data) {
        sockets.emit("news",{my:data});
    });
});

//启动服务器
http.listen(3000,()=>{
    console.log("启动服务器,监听3000端口,当前时间:");
});
