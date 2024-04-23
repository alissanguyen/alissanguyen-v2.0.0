/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import {
  useLoaderData
} from "@remix-run/react"
import * as React from "react";


import { getPostsAndTags, PostsAndTags } from "~/api/getPostsAndTags";
import blogStyles from "~/components/Blog/Blog.css";
import BlogPostCard from "~/components/Blog/BlogPostCard";
import SearchBarSection from "~/components/Blog/SearchBarSection";
import TagsSection from "~/components/Blog/TagsSection";
// eslint-disable-next-line import/order
import {
  AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_IMAGE_URL,
  BLOG_KEYWORDS,
  BLOG_URL,
  BLOG_WEBSITE_NAME,
  fixedWidthLayoutClasses,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  TWITTER_ACC,
  TWITTER_CARD_TYPE
} from "~/constants";

// import { SubscribeFormField } from "~/types";

export const loader: LoaderFunction = getPostsAndTags;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: blogStyles },
    {
      rel: "canonical",
      href: "https://www.alissanguyen.com/blog"
    }
  ];
};
export const meta: MetaFunction = () => {
  return [
    {
      title: BLOG_WEBSITE_NAME,
      url: BLOG_URL,
      author: AUTHOR,
      keywords: BLOG_KEYWORDS,
      image: BLOG_IMAGE_URL,

    },
    {
      name: "description",
      content: BLOG_DESCRIPTION
    },
    {
      tagName: "link",
      rel: "canonical",
      href: BLOG_URL,
      "theme-color": "#212529"
    },
    {
      property: "og:url",
      content: BLOG_URL
    },
    {
      property: "og:image",
      content: BLOG_IMAGE_URL
    },
    {
      property: "og:title",
      content: BLOG_WEBSITE_NAME
    },
    {
      property: "og:description",
      content: BLOG_DESCRIPTION
    },
    {
      property: "og:image:width",
      content: IMAGE_WIDTH
    },
    {
      property: "image:height",
      content: IMAGE_HEIGHT
    },
    {
      "twitter:title": BLOG_WEBSITE_NAME,
      "twitter:description": BLOG_DESCRIPTION,
      "twitter:alt": BLOG_WEBSITE_NAME,
      "twitter:image": BLOG_IMAGE_URL,
      "twitter:card": TWITTER_CARD_TYPE,
      "twitter:creator": TWITTER_ACC,
      "twitter:site": TWITTER_ACC,
    }
  ]
};


export default function BlogPage() {
  const { blogPosts, contentfulTags } = useLoaderData<PostsAndTags>();
  const [searchInput, setSearchInput] = React.useState("");
  const [subscribeEmail, setSubscribeEmail] = React.useState("")

  const postCount = Object.keys(blogPosts.items).length;

  const [selectedTagIds, setSelectedTagIds] = React.useState<Set<string>>(
    new Set([])
  );


  const updateSelectedTagIds = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const clone = new Set(prev);

      /**
       * If this tag id already exists in the set of selectedTagIds, then remove it
       * If not, add it to the set
       */
      const tagIdAlreadyIncluded = clone.has(tagId);
      if (tagIdAlreadyIncluded) {
        clone.delete(tagId);
        return clone;
      } else {
        clone.add(tagId);
        return clone;
      }
    });
  };

  const selectedTagIdsAsArray = [...selectedTagIds];

  // Return all queried blog posts id no tag selected, otherwise return only if for every selectedTag, each filteredBlogPost has to contain that tag
  const filteredBlogPostsByTags =
    selectedTagIds.size === 0
      ? blogPosts.items
      : blogPosts.items.filter((post: any) => {
        return selectedTagIdsAsArray.every((selectedTag) => {
          return post.metadata.tags.some((tag: any) => tag.sys.id === selectedTag);
        });
      });

  /** Create a set of available tag Ids by iterating over all the filtered blog posts and adding their tags to this set. */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const availableTagIds: Set<string> = filteredBlogPostsByTags.reduce<
    Set<string>
  >((acc: any, cur: any) => {
    const tags = cur.metadata.tags; // Array of objects
    tags.forEach((tag: any) => {
      const alreadyHasThisTagId = acc.has(tag.sys.id);
      if (alreadyHasThisTagId) {
        return;
      }
      acc.add(tag.sys.id);
    });
    return acc;
  }, new Set([]));

  const searchInputRegex = new RegExp(
    escapeSearchTermForRegularExpressionConstruction(searchInput),
    "i"
  );

  const filteredBlogPostsByName =
    searchInput === ""
      ? filteredBlogPostsByTags
      : filteredBlogPostsByTags.filter((post: any) => {
        return searchInputRegex.test(post.fields.blogPostTitle);
      });

  // TODO: Add loading state
  // TODO: Persists tags and search selection in the url



  return (
    <div className={`${fixedWidthLayoutClasses}`}>
      <SearchBarSection
        search={searchInput}
        setSearch={setSearchInput}
        email={subscribeEmail}
        setEmail={setSubscribeEmail}
        count={postCount}
      />
      <TagsSection
        tags={contentfulTags.items}
        selectedTags={selectedTagIds}
        onTagSelect={updateSelectedTagIds}
        availableTags={availableTagIds}
      />

      {filteredBlogPostsByName.length > 0 ? (
        <ul className="BlogPosts__Wrapper grid gap-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3 list-none">
          {filteredBlogPostsByName.map((blogPost: any) => {
            return (
              <li key={blogPost.sys.id}>
                <BlogPostCard blogPost={blogPost} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center m-auto flex-row justify-center">
          <p className="text-3xl text-blog-lgText mr-10">
            Oh no.. there is some problems loading blog posts :(
          </p>
          <img
            src="/images/cry2.png"
            alt="Crying illustration"
            title="Crying illustration"
            className="w-44"
          />
        </div>
      )}
      {/* $$TODO: Add load more button */}
    </div>
  );
}

const escapeSearchTermForRegularExpressionConstruction = (
  str: string
): string => {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};
