var {Users} = require('./middlewares/schemas/schema');
var {login} = require('./utils/usersmodule');


let user = new Users({
    name: "asdad"
});

var b=async function(){
let data =await Users.create({name:"sadasd"});
console.log(data);
}

b();