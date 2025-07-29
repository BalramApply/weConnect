import { createSlice } from "@reduxjs/toolkit"
import { createPost, getAllComments, getAllPosts } from "../../action/postAction"

const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
    uploadError: null, //new
    uploadSuccess: false, // new
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },

        // new
        clearUploadError: (state) => {
            state.uploadError = null;
            state.uploadSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
            state.message = "Fetching all the posts..."
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            console.log(action.payload.posts)
            state.posts = action.payload.posts.reverse()
            console.log(`HERE`, state.posts)
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })
        .addCase(getAllComments.fulfilled, (state, action) => {
            state.postId = action.payload.post_id
            state.comments = action.payload.comments
            console.log(state.comments)
        })
        // Add createPost cases
        .addCase(createPost.pending, (state) => {
            state.isLoading = true;
            state.uploadError = null;
            state.uploadSuccess = false;
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.uploadSuccess = true;
            state.uploadError = null;
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isLoading = false;
            state.uploadError = action.payload;
            state.uploadSuccess = false;
        })
    }
})

export const { resetPostId } = postSlice.actions;
export default postSlice.reducer;