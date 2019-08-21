var MsgModel = require('./model');

let addMsg = async (data) => {
    console.log("id create USer");
    let model = new MsgModel(data)
    let x = await model.save()
    return true
}
let getFromRoom = async (roomId, {
    skip,
    date,
    limit
}) => {
    skip = skip ? skip : 0;
    limit = limit > 15 ? 15 : limit
    let query = {
        "room": roomId,
    }
    if (date)
        query["created_on"] = {
            "$gte": date
        }
    return await MsgModel.find(query).skip(skip).limit(15 + skip)
}
module.exports = {
    addMsg,
    getFromRoom,
}