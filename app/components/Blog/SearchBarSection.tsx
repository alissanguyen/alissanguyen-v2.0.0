import { DocumentTextIcon } from "@heroicons/react/24/outline";
import * as React from "react";

// import SubscriptionForm from "./SubscriptionForm";

/*
* TODO: Enable Subscribing to newsletter
*/

interface Props {
  search: string;
  setSearch: (input: string) => void;
  email: string;
  setEmail: (input: string) => void;
  count: number;
}

const SearchBarSection: React.FC<Props> = (props) => {
  return (
    <div className="BlogPage__Header__Wrapper">
      <div className="custom2:col-span-3 sm:col-span-2 ">
        <p className="BlogPage__SubHeader mb-5 text-5xl font-medium leading-snug">
          Welcome.
        </p>
        <div className="SearchBar__InputWrapper">
          <input
            type="text"
            name="Search blog posts"
            id="blog-post-search-bar"
            value={props.search}
            onChange={(e) => {
              props.setSearch(e.target.value);
            }}
            className="SearchBar__Input"
            placeholder="Search posts"
          />
          <div className="SearchBar__Icon">
            <span className="mr-2">
              <DocumentTextIcon className="h-5 w-5" />
            </span>
            <p className="text-sm opacity-80">{props.count}</p>
          </div>
        </div>
        {/* <SubscriptionForm subscriberEmail={props.email} setSubscriberEmail={props.setEmail} /> */}
      </div>
    </div>
  );
};

export default SearchBarSection;
