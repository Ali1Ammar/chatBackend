var UserModel = require('./model');

let createUser = async data => {
  console.log("id create USer");
  let user = new UserModel(data);
  let x = await user.save();
  return x.id;
};
let findUserById = async id => {
  try {
    let x = await UserModel.findById(id);
    return x;
  } catch (err) {
    console.log(err);
    return err;
  }
};
let findUserAll = async () => {
  console.log("FIND ALL USER");
  try {
    let x = await UserModel.find();
    let users = [];
    // console.log(x)
    x.forEach(user => {
      //   console.log(user)
      users.push({
        name: user.name,
        _id: user.id
      });
    });
    return users;
  } catch (err) {
    // console.log(err)
    return err;
  }
};

let findUserByName = async name => {
  let x = await UserModel.findOne({
    name
  }).select({ "follows": 0, "__v": 0 });
  return x.toObject();
};
let findOneOrCreate = async name => {

  let doc = await UserModel.findOneAndUpdate({
    name
  }, // find a document with that filter
  {
    name
  }, // document to insert when nothing was found
  {
    upsert: true,
    new: true,
    runValidators: true // options
  }).select({ "follows": 0, "__v": 0 });
  return doc;
};

let addFollow = async (userId, followId) => {
  //console.log("Follow Controelller")
  // UserModel.findByIdAndUpdate(userId,{ $push: { follows: followId } })
  await UserModel.update({
    _id: userId
  }, {
    $addToSet: {
      follows: followId
    }
  }, {
    safe: true,
    upsert: true
  });
};
let getFollowById = async (id, name) => {
  if (name == undefined) name = 1;
  console.log("getFollowById");
  let follows = (await UserModel.findById(id).select("follows")).follows;
  console.log("-----------------------------------");
  let userFollow;
  try {
    let selete = { "follows": 0, "__v": 0 };
    if (!name) selete["name"] = 0;
    userFollow = await UserModel.find({ _id: follows.toObject() }).select(selete);
  } catch (err) {
    console.log(err);
  }

  //console.log(userFollow)
  return userFollow;
};
module.exports = {
  createUser,
  findUserById,
  findUserByName,
  findOneOrCreate,
  findUserAll,
  addFollow,
  getFollowById
};