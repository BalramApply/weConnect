import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/posts')

            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// export const createPost = createAsyncThunk(
//   "post/createPost",
//   async (userData, thunkAPI) => {
//     try {
//       const { body, file } = userData;

//       const formData = new FormData();
//       formData.append('token', localStorage.getItem('token'));
//       formData.append('body', body);
//       formData.append('media', file);

//       const response = await clientServer.post("/post", formData);

//       if (response.status === 200) {
//         return thunkAPI.fulfillWithValue("Post Uploaded");
//       } else {
//         return thunkAPI.rejectWithValue("Post not uploaded");
//       }

//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
//     }
//   }
// );

// 2. Updated createPost action with better error handling
export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    try {
      const { body, file } = userData;

      // Client-side file size validation
      if (file && file.size > 50 * 1024) {
        return thunkAPI.rejectWithValue("Image size must be less than 50KB");
      }

      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('body', body);
      if (file) {
        formData.append('media', file);
      }

      const response = await clientServer.post("/post", formData);

      if (response.status === 200) {
        return thunkAPI.fulfillWithValue("Post Uploaded Successfully");
      } else {
        return thunkAPI.rejectWithValue("Post not uploaded");
      }

    } catch (error) {
      // Handle specific error messages from backend
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    
    try {
      const response = await clientServer.delete("/delete_post", {
        data:{
          token: localStorage.getItem("token"),
          post_id: post_id.post_id
        }
      })

      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong")
    }
  }
)

export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {

    try {
      
      const response = await clientServer.post('/increament_post_like', {
        post_id: post.post_id
      })

      return thunkAPI.fulfillWithValue(response.data);

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
)

export const getAllComments = createAsyncThunk(
  "post/getAllComment",
  async (postData, thunkAPI) => {

    try {
      
      const response = await clientServer.get("/get_comments", {
        params:{
          post_id: postData.post_id
        }
      });

      return thunkAPI.fulfillWithValue({
        comments: response.data,
        post_id: postData.post_id
      })
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong")
    }
  }
)

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      console.log({
        post_id: commentData.post_id,
        body: commentData.body
      })

      const response = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body
      });

      return thunkAPI.fulfillWithValue(response.data)
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong")
    }
  }
)