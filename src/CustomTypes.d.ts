declare type CurrentUser = {
   id: number;
   email: string;
   accountNumber: string;
   deviceId: string;
   followingIds: number[];
};

declare type PostComment = {
   id?: number;
   postId?: number;
   userId?: number;
   text?: string;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type CommentReply = {
   id: number;
   commentId: number;
   userId: number;
   text: string;
   createdAt: Date;
   updatedAt: Date;
};


declare type ProductComment = {
   id: number;
   productId: number;
   userId: number;
   text: string;
   createdAt: Date;
   updatedAt: Date;
};

declare type Action = {
   type: string;
   payload?: any;
};

declare type PostLike = {
   id?: number;
   postId?: number;
   userId?: number;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type PostShare = {
   id?: number;
   postId?: number;
   userId?: number;
   createdAt?: Date;
   updatedAt?: Date;
};

declare type ProductReview = {
   id?: number;
   productId?: number;
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

declare type Post = {
   id: number;
   text: string;
   title: string | null;
   images: string[] | null;
   video: string | null;
   userId: number;
   fromId?: number | null;
   fromPostId?: number | null;
   shared?: number | null;
   createdAt: Date;
   updatedAt: Date;
};

declare type Product = {
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
   affiliateId: number[] | null;
   initialPrice: string;
   affiliatePrice: string | null;
   sizes: string[] | null;
   numberAvailable: string;
   rating: number;
   availability: string;
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
   recipientId: number;
   lastText: string | null;
   recipientReadStatus: boolean | null;
   numberOfUnreadText: number | null;
   createdAt: Date;
   updatedAt: null;
};

declare type Chat = {
   id: number;
   senderId: number;
   recipientId: number;
   lastText: string | null;
   recipientReadStatus: boolean | null;
   numberOfUnreadText: number | null;
   createdAt: Date;
   updatedAt: null;
};
