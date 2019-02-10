var request = require("request");

exports.handler = async (event) => {
    // TODO implement
  try{
    let result = await new Promise(function(fulfill, reject){
      request.post("http://ec2-13-58-50-236.us-east-2.compute.amazonaws.com:8080/alexa/test", {form: {isTest: true}}, (err,res,body)=>{
        if (err) reject(err);
        else fulfill();
      });
    });

    return {statusCode: 200, body: "ok"};
  }catch(err){
    return {statusCode: 500, body: "something went wrong"};
  }
}
