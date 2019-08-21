var MsgModel = require('./model');

function generateLinkedId(id,otherid){
    return [id,otherid].sort().join("")
}

let addMsg = async (data) => {
    data["linkedTwoUserID"]  = generateLinkedId(data.sentid, data.reciveid)
    console.log("ADD NEW MSG")
  //  console.log(data)
 //   console.log(generateLinkedId(data.myid, data.otherid));
  //  console.log("id create USer");
    let model = new MsgModel(data)
    let x = await model.save()
    return true
}
let getMsg = async (linkedID) => {
    let skip = 0 // skip ? skip : 0;
    let limit = 15 // limit > 15 ? 15 : limit
    let date = null 
    let query = {
        "linkedTwoUserID": linkedID,
    }
    if (date)
        query["created_on"] = {
            "$gte": date
        }
    return await MsgModel.find(query).skip(skip).limit(limit + skip)
}
module.exports = {
    addMsg,
    getMsg,
    generateLinkedId
}