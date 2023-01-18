import post from "../models/Post.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

//create

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    console.log(userId, "bvgggfd");
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();

    res.status(201).json(post.sort((a,b)=>{
      return b.createdAt - a.createdAt;
    }));
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//read

export const getFeedPosts = async (req, res) => {
  // const skip=req.query.skip ? Number(req.query.skip):0;
  // const DEFAULT_LIMIT=3;
  // const { start, limit } = req.query;
  
  try {
    const post = await Post.find()
    res.status(200).json(post.sort((a,b)=>{
      return b.createdAt - a.createdAt;
    }));
    console.log(post)
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post.sort((a,b)=>{
      return b.createdAt - a.createdAt;
    }));;;
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
//update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = -post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
// export const  commentPost= async(req,res)=>{
//   try {
//     console.log(req.body,'postsposts');
//     const postId=req.body.postId
//     console.log(postId,'postId');
//     const comments={
//        username:req.body.firstName,
//        comment: req.body.comment

//     }
//     await Post.updateOne({_id:postId},{
//       $push:{
//         comments
//       }
//     })
//     console.log(comments);
//   } catch (error) {

//   }
// }
export const commentPost = async (req, res) => {
  try {
console.log(req.body.time);
      const postId = req.body.postId
      const comments = {
          username: req.body.userName,
          comment: req.body.comment,
          time:req.body.time
      }

      await Post.updateOne({ _id: postId }, {
          $push: {
              comments
          }
      })
      const newCommentPost = await Post.findById(postId);

      res.status(200).json({ message: 'Posts', success: true, newCommentPost });

  } catch (err) {
      res.status(409).json({ message: err.message });
  }

}

export const deletePost = async (req, res) => {
  try {
    console.log(req.params, "req.paramsreq.params");
    const { postId } = req.params;
    await Post.deleteOne({ postId }).then((response) => {
      console.log(response, "response");
      res.status(200).json({ success: true, postId, message: "Post removed" });
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Can't delete post" });
  }
};
export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const body = req.body;
    const obj = {
      reason: body.reason,
      reporterId: body.reporterId,
      date: new Date(),
    };
    console.log(obj, "kkkkjkjk");
    const postDetails = await post.findOne({ postId });
    console.log(postDetails,'3dadasdas........')
    const userExists = postDetails.reports.find(
      (report) => {
        console.log(report.reporterId._id,'....................',obj.reporterId._id)
        return report.reporterId._id === obj.reporterId._id
      }
    );
    console.log(userExists,'231231414124');
    if (userExists) {
      res.status(200).json({
        success: false,
        message: "post is already reported",
      });
    } else {
    await postDetails.updateOne(
        {
          $push: {
            reports: obj,
          },
          $inc: {
            reportCount: 1,
          },
        }
      );

      await postDetails.save();
      // .then((response) => {
      res.status(201).json({ status: true, message: "Report submitted" });
      // })
    }
  } catch (error) {}
};

 export const removeComment = async (req, res, next) => {
  try {
console.log(req.params,'req.params');
      const { comId, postId } = req.params
      await post.updateOne({ postId }, {
          $pull: {
              comments: {
                  comId: comId
              }
          },

          $inc: {
              commentCount: -1
          }

      }).then((response) => {
console.log(response);
          res.status(201).json({ success: true, comId, message: 'remove success' })
      }).catch((error) => {

      })

  } catch (error) {

  }
}

export const editPostDescription = async (req, res) => {

try {
  const {description,postId}=req.body

let  updatePostDescription = await post.findByIdAndUpdate(postId,{description:description},{new:true})
if (updatePostDescription)
{
res.status(200).json({updatePostDescription,message: 'updated post description',success: true})
}else{
  console.log('error updating');
}
} catch (error) {
 res.status(500).json("hello"+error.message)
}

}