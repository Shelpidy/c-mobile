export const users = [{
  id: 1,
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  fullName:"John Doe",
  profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  password: "password123",
  pinCode: "1234",
  gender: "Male",
  accountNumber: "123456789",
  dob: "1990-01-01",
  email: "johndoe@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 2,
  firstName: "Jane",
  middleName: "",
  lastName: "Doe",
  fullName:"Jane Doe",
  profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
  password: "password456",
  pinCode: "5678",
  gender: "Female",
  accountNumber: "987654321",
  dob: "1995-02-02",
  email: "janedoe@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 3,
  firstName: "Bob",
  middleName: "",
  lastName: "Smith",
  fullName:"Bob Smith",
  profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
  password: "password789",
  pinCode: "9012",
  gender: "Male",
  accountNumber: "111111111",
  dob: "1985-03-03",
  email: "bobsmith@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 4,
  firstName: "Alice",
  middleName: "",
  lastName: "Johnson",
  fullName:"Alice Johnson",
  profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
  password: "password101112",
  pinCode: "1314",
  gender: "Female",
  accountNumber: "222222222",
  dob: "1992-04-04",
  email: "alicejohnson@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  id: 5,
  firstName: "Mark",
  middleName: "",
  lastName: "Davis",
  fullName:"Mark Davis",
  profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
  password: "password131415",
  pinCode: "1617",
  gender: "Male",
  accountNumber: "333333333",
  dob: "1988-05-05",
  email: "markdavis@gmail.com",
  createdAt: new Date(),
  updatedAt: new Date()
}]


export const posts = [
  {
    id:1,
    title: "First Post",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    images: ["https://randomuser.me/api/portraits/med/men/75.jpg", "https://randomuser.me/api/portraits/thumb/men/75.jpg"],
    video: null,
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:2,
    title: "Second Post",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    images: ["https://randomuser.me/api/portraits/med/women/75.jpg", "https://randomuser.me/api/portraits/thumb/women/75.jpg"],
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    userId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:3,
    title: "Third Post",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    images: ["https://randomuser.me/api/portraits/med/men/76.jpg", "https://randomuser.me/api/portraits/thumb/men/76.jpg"],
    video: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
   {
    id:4,
    title:"Fourth Post",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    images: ["https://randomuser.me/api/portraits/med/men/40.jpg", "https://randomuser.me/api/portraits/thumb/men/40.jpg"],
    video: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]


export const postComments = // Comments for post id 1
[
  {
    id:1,
    postId: 1,
    userId: 2,
    text: "Great post, thanks for sharing!",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:2,
    postId: 1,
    userId: 3,
    text: "I found this really interesting, especially the part about...",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:3,
    postId: 1,
    userId: 4,
    text: "I disagree with some of your points, but it's always good to hear different perspectives.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
,

// Comments for post id 2

  {
    id:4,
    postId: 2,
    userId: 1,
    text: "This is an important issue that needs more attention.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:5,
    postId: 2,
    userId: 3,
    text: "I completely agree, and I think we need to start taking action now.",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  {
    id:6,
    postId: 3,
    userId: 4,
    text: "I'm not sure I understand the point of this post.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:7,
    postId: 3,
    userId: 2,
    text: "I think the author is trying to say that...",
    createdAt: new Date(),
    updatedAt: new Date()
  },


// Comments for post id 4

  {
    id:8,
    postId: 4,
    userId: 1,
    text: "I love the photos in this post, they really capture the essence of the place.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:9,
    postId: 4,
    userId: 3,
    text: "Yes, the photos are beautiful. I've always wanted to visit that location.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id:10,
    postId: 4,
    userId: 2,
    text: "I agree, the scenery is breathtaking. Thanks for sharing!",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const postLikes = [
  {
    id: 1,
    userId: 2,
    postId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    userId: 3,
    postId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    userId: 1,
    postId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    userId: 4,
    postId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    userId: 2,
    postId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    userId: 1,
    postId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    userId: 3,
    postId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    userId: 4,
    postId: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 9,
    userId: 1,
    postId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 10,
    userId: 2,
    postId: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
