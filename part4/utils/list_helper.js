var _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const likesArray = blogs.map((blog) => blog.likes);

    const likes = likesArray.reduce((acc, cur) => {
        return acc + cur;
    }, 0);

    return likes;
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return "This list have no blogs";

    const favorite = blogs.reduce((prev, curr) => {
        return curr.likes > prev.likes ? curr : prev;
    }
    );

    const { _id, url, __v, ...cleanedFavorite } = favorite;

    return cleanedFavorite;
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return "This list have no blogs";

    const grouped = _.countBy(blogs, 'author');
    const topAuthor = _.maxBy(Object.keys(grouped), (author) => grouped[author]);

    return {
        author: topAuthor,
        blogs: grouped[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return "This list have no blogs";

    const likesByAuthor = _(blogs)
        .groupBy('author') 
        .map((blogs, author) => ({
            author,
            likes: _.sumBy(blogs, 'likes') 
        }))
        .maxBy('likes'); 

    return likesByAuthor;
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}