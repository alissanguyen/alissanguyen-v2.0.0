import { ContentfulCollection, EntryCollection, Tag } from "contentful";

import { getContentfulBlogPosts, getContentfulTags, getContenfulMicroblogs } from "~/contentful/contentfulClient";
import { ContentfulBlogPost, ContentfulMicroblog } from "~/contentful/types";

export interface PostsAndTags {
  blogPosts: EntryCollection<ContentfulBlogPost>;
  contentfulTags: ContentfulCollection<Tag>;
}

export const getPostsAndTags = async (): Promise<PostsAndTags> => {
  const [blogPosts, contentfulTags] = await Promise.all([
    getContentfulBlogPosts(),
    getContentfulTags()
  ]);

  return { blogPosts, contentfulTags };
};

export interface Microblog {
  microblogs: EntryCollection<ContentfulMicroblog>;
}
export const getMicroblogs = async (): Promise<Microblog> => {
  const [ microblogs ] = await Promise.all([getContenfulMicroblogs()]);
  console.log('microblogs', microblogs)
  return { microblogs };
};
