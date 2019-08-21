var RoomModel = require('./model');

let findOneOrCreate = async members => {
    if (members.length < 2) return false;

    let query = { members };
    if (profielId.length == 2) query.linkedUserId = members.sort().join("");
    /* query WOULD BE LIKE 
    {
        members : [SOME ID]ARRAY,
        linkedUserId : SOME IDSOME IDSOME ID // THIS ONLU WITH 2 MEMBER
    }
    */
    let doc = await RoomModel.findOneAndUpdate(query, // find a document with that filter
    query, // document to insert when nothing was found
    { upsert: true, new: true, runValidators: true // options
    });
    return doc.id;
};

module.exports = {
    findOneOrCreate
};