import { Asset, Entry } from "contentful";
import * as React from "react";

import BlogPostTags from "~/components/Blog/BlogPostTags";
import { ContentfulBlogPost } from "~/contentful/types";

interface Props {
  post: Entry<ContentfulBlogPost>;
}


const RelatedPostCard: React.FC<Props> = (props) => {
  const rawDateData = new Date(props.post.sys.updatedAt).toDateString();
  const date = rawDateData.substring(rawDateData.indexOf(" ") + 1);
  const tags = props.post.metadata.tags;
  const blogPostSplash = props.post.fields.blogPostSplash;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isBlogPostSplash = (splash: any): splash is Asset => {
    return splash && splash.fields && splash.fields.title;
  };

  
  return (
    <div className="RelatedBlogPost__Card__Container">
      <a
        href={`/blog/${props.post.fields.blogPostSlug}`}
        className="RelatedBlogPost__Link__Container h-full rounded-lg"
      >
        {isBlogPostSplash(blogPostSplash) ? (
          <img
            src={blogPostSplash.fields.title as string}
            alt={blogPostSplash.fields.title as string}
            title={blogPostSplash.fields.title as string}
            className="RelatedBlogPost__Image rounded-lg w-full h-80"
            loading="lazy"
          />
        ) : null}
        
      </a>
      <div className="flex flex-col">
        <span className="inline-flex text-xl md:text-2xl text-gray-400 font-bold mt-2 mb-3">
          {date} — 5 min read
        </span>
        <span className="RelatedBlogPost__Title text-blog-lgText font-bold text-2xl md:text-3xl">
          {props.post.fields.blogPostTitle as string}
        </span>
        <div>
          <BlogPostTags tags={tags.map((tag) => tag.sys)} />
        </div>
      </div>
    </div>
  );
};

export default RelatedPostCard;
