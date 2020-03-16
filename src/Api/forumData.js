const forumData = [
    {
        id: 1,
        title: "Unit 10 Study Guide",
        text: "https://google.com",
        date: new Date(2020, 3, 14),
        creator: "Josh",
        class: "Chemistry Honors",
        likes: ["Justin"],
        comments: {
            "Justin": "Thanks!"
        }
    },
    {
        id: 2,
        title: "Book PDF",
        text: "Don't buy the book from the bookstore! It's here for free...",
        date: new Date(2020, 3, 10),
        creator: "Anonymous",
        class: "English II",
        likes: ["Josh", "Hope"],
        comments: {
            "Josh": "Thanks for the tip!"
        }
    },
    {
        id: 3,
        title: "Confusing Chem Lab",
        text: "I don't get this Thermodynamics thing at all. Can someone help?",
        date: new Date(2020, 3, 12),
        creator: "Anonymous",
        class:"Chemistry Honors",
        likes: [],
        comments: {}
    },
    {
        id: 4,
        title: "Class Name Suggestion",
        text: "Please comment some class name suggestions for class next week!",
        date: new Date(2020, 3, 9),
        creator: "Hope",
        class:"Precalculus Honors",
        likes: ["Josh", "Justin"],
        comments: {}
    },
    {
        id: 5,
        title: "Video on What We Learned in Class",
        text: "https://youtube.com",
        date: new Date(2020, 3, 14),
        creator: "Anonymous",
        class:"World and Europe II",
        likes: ["Justin"],
        comments: {}
    }
]

export default forumData