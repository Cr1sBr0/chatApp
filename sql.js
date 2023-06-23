import mysql from "mysql2";
const pool=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'Password@123',
    database:'messages'
}).promise();

export async function check(username)
{
    const [result]=await pool.query("select * from userlist where username= '"+username+"';")
    if(result.length==0)
        {
            return false;
        }
    return true;
}

export async function check_user(username,password)
{
    const [result]=await pool.query("select * from userlist where username= '"+username+"';")
    if(result.length==0)
        {
            await add_user(username,password)
            return false;
        }
    else{
        var [result1]=await pool.query("select password from userlist where username= '"+username+"';")
        if(result1[0].password==password)
            return false;
        else
            return true;
    }
}
export async function add_user(username,password)
{
    await pool.query("insert into userlist values ('"+username+"','"+password+"');") 
}

export async function showChat(name1,name2){
    const [result]= await pool.query("select name1,message from chats where (name1='"+name1+"' AND name2='"+name2+"') OR (name1='"+name2+"' AND name2='"+name1+"') order by id desc;");
    return result;
}
export async function insertChat(name1,name2,msg){
    await pool.query("insert into chats (name1,name2,message) values ( '"+name1+"','"+name2+"','"+msg+"');");
}
export async function getFriends(user){
    const result=[];
    const [result1]=await pool.query("select name2 from chats where (name1= '"+user+"');")
    const [result2]=await pool.query("select name1 from chats where (name2= '"+user+"');")
    for(var j=0;j<result1.length;j++)
    {
        if(!result.includes(result1[j].name2))
        result.push(result1[j].name2)
    }
    for(var j=0;j<result2.length;j++)
    {
        if(!result.includes(result2[j].name1))
        result.push(result2[j].name1)
    }

    return result;
}