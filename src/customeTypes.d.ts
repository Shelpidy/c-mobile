declare type CurrentUser = {
  id?:number,
  email?:string,
  accountNumber?:string
}

declare type CommentProps = {
    id?:number,
    postId?:number,
    posterId?:number,
    userId?:number,
    text?:string,
    createdAt?:Date,
    updatedAt?:Date
}

declare type Like = {
    id?:number,
    postId?:number,
    userId?:number,
    createdAt?:Date,
    updatedAt?:Date
}

declare type PostComponentProps = {
    id?:number,
    text?:string,
    title?:string,
    images?:string[],
    video?:string,
    userId?:number,
    createdAt?:Date,
    updatedAt?:Date
}