import { readPosts, readComments } from './cockpit/cockpit';

/**
 * Returns plain basename as route
 * @returns {array} of strings 
 */
export async function plainRoutes() {

  const posts = await readPosts({ fields: { 'basename': 1 } });
  return posts.map(post => `/${post.basename}/`);

}

/**
 * Returns route including payload (for nuxt generate run)
 * @returns {array} of objects { route: string, payload: { post: object, comments: array of objects }}
 */
export async function routesWithPayload() {

  const posts = await readPosts(); /*
  const comments = await readComments({
    sort: { postid: 1, parentid: 1, postdate: 1 }
  }); */

  return posts.map(post => {
    return {
      route: `/${post.basename}/`,
      payload: {
        post,
        comments: []
        //comments: comments.filter(comment => comment.postid === post._id)
      }
    }
  });

}