declare type CurrentUser = {
   id: number;
   email: string;
   accountNumber: string;
   deviceId: string;
   followingIds: number[];
};

declare type CommentProps = {
   id?: number;
   postId?: number;
   posterId?: number;
   userId?: number;
   text?: string;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type ProductCommentProps = {
   id?: number;
   productId?: number;
   posterId?: number;
   userId?: number;
   text?: string;
   createdAt?: Date;
   updatedAt?: Date;
   navigation?: any;
   route?: any;
};

declare type ProductComment = {
   id?: number;
   productId?: number;
   userId?: number;
   text?: string;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type Action = {
   type: string;
   payload?: any;
};

declare type Like = {
   id?: number;
   postId?: number;
   userId?: number;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type ProductLike = {
   id?: number;
   productId?: number;
   userId?: number;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type PostComponentProps = {
   id: number;
   text: string;
   title: string | null;
   images: string[] | null;
   video: string | null;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
};

declare type ProductComponentProps = {
   id: number;
   productName: string;
   category: string;
   description: string;
   images: string[];
   price: string;
   affiliateId?: number[] | null;
   initialPrice: string | null;
   affiliatePrice: string | null;
   sizes: string[] | null;
   numberAvailable: string | null;
   rating: number | null;
   availability: string | null;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
   navigation?: any;
   route?: any;
};

declare type User = {
   id: number;
   firstName: string;
   middleName: string;
   lastName: string;
   fullName: string;
   profileImage: string;
   password: string;
   pinCode: string;
   gender: string;
   accountNumber: string;
   email: string;
   dob: string;
   createdAt: Date;
   updatedAt: Date;
};

declare interface PostMarket {
   id: number;
}

declare type Product = {
   id: number;
   productName: string;
   category: string;
   description: string;
   images: string[];
   price: string;
   affiliateId: number | number[] | null;
   initialPrice: string;
   affiliatePrice: string | null;
   sizes: string[];
   numberAvailable: string;
   rating: number;
   availability: boolean | string;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
};

declare type ChatUser = {
   _id: number;
   name: string;
   avatar: string;
};

declare type IMessage = {
   _id: string | number;
   text: string;
   createdAt: Date | number;
   user: ChatUser;
   image?: string;
   video?: string;
   audio?: string;
   system?: boolean;
   sent?: boolean;
   received?: boolean;
   pending?: boolean;
};

declare type MakePurchaseParams = {
   productId: any;
   affiliateId: any;
   userId: any;
   buyerId: any;
};

declare type CustomNotification = {
   id: number;
   userId: number;
   title: string;
   message: string;
   readStatus: boolean;
   notificationFrom: number;
   createdAt: Date;
   notificationType: string;
   updatedAt: Date | null;
};

declare type Conversation = {
  id: number;
  senderId: number;
  receipientId: number;
  lastText:string | null;
  receipientReadStatus: boolean | null;
  roomId: number;
  numberOfUnreadText:number | null;
  createdAt: Date;
  updatedAt:  | null;
};

