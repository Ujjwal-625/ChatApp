import { createSlice} from "@reduxjs/toolkit"

const initialState={
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    isDeleteMessage:false,
    deleteMessageLocation:{
      id:null,
      className:null
    },
    selectedDeleteChat: {
      chatId: "",
      groupChat: false,
    },
}

const miscSlice =createSlice({
    name:"misc",
    initialState,
    reducers:{
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
          },
          setIsAddMember: (state, action) => {
            state.isAddMember = action.payload;
          },
          setIsNotification: (state, action) => {
            state.isNotification = action.payload;
          },
          setIsMobile: (state, action) => {
            state.isMobile = action.payload;
          },
          setIsSearch: (state, action) => {
            state.isSearch = action.payload;
          },
          setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
          },
          setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
          },
          setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;
          },
          setSelectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload;
          },
          setIsDeleteMessage:(state,action)=>{
            state.isDeleteMessage=action.payload;
          },
          setDeleteMessageLocation:(state,action)=>{
            state.deleteMessageLocation=action.payload;
          }
    }
})

export default  miscSlice

export const {
    setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setIsDeleteMessage,
  setDeleteMessageLocation
} =miscSlice.actions