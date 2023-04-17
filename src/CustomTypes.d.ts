declare type CurrentUser = {
   id?: number;
   email?: string;
   accountNumber?: string;
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
   initialPrice: string | null;
   affiliatePrice: string | null;
   sizes: string[] | null;
   numberAvailable: string | null;
   rating: number | null;
   availability: string | null;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
   navigation: any;
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
   initialPrice: string;
   sizes: string[];
   numberAvailable: string;
   rating: number;
   availability: boolean | string;
   userId: number;
   createdAt: Date;
   updatedAt: Date;
};
