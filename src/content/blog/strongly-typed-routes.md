---
title: "Strongly Typed Routes"
description: "How to organize and safely manage routes in a React SPA, with the help of react-location"
pubDate: "11 Jul 2022"
heroImage: "/strongly-typed-routes/hero.jpg"
heroAttribution: "Photo by Tormius on Unsplash"
---

> **Note: This article will be made redundant when @tanstack/router is released**

If you just want to dive into the code, here's the [codesandbox](https://codesandbox.io/s/strongly-typed-routes-qrer0y).

Some context: the project I'm currently working on involves multiple teams coming together to build a unified frontend.
We use [NX](https://nx.dev/) to build a monorepo where components and utilities are shared between teams.

Due to the scope of the project, the number of routes (i.e. pages) will only grow over time.
As the number of teams involved also start to grow, there may also be discoverability problems on existing routes.

To tackle this issue, I wrote a few utilities on top of [`react-location`](https://react-location.tanstack.com/) for type-safety.

## Desired Outcome

Before we get into the implementation, let's think about the desired outcome.  
Treating routes as state, we need to strongly type both "get" and "set".

### Glossary

Note the 2 terms in `react-location`:  
 `params` are variables within the path  
 `search` is the object in the search string (also known as query string)

Given a path `/user/:userId/bucket/:bucketId?sortBy=date&sortDesc=true`  
 `params` = `userId, bucketId`  
 `search` = `sortBy, sortDesc`

### Getting the State

To get state, we can use these utilities out of the box.

- [`useMatch`](https://react-location.tanstack.com/docs/api#usematch) exposes generics for params
- [`useSearch`](https://react-location.tanstack.com/docs/api#usesearch) exposes generics for search string

### Setting the State (navigating)

Similar to the utilities above, [`useNavigate`](https://react-location.tanstack.com/docs/api#usenavigate)
and [`Link`](https://react-location.tanstack.com/docs/api#link) expose generics for params & search.

However, this is not good enough for navigation because they are not tied to a particular path.
When devs want to create links or navigate somewhere, we want them to be able to:

- Pick a path from an `enum`, like an "address book"
- Enter params and search string according to the chosen path

In the gif example, intellisense tells me to enter a `userId` parameter for the `User` path:  
![test](/strongly-typed-routes/route1.gif)

The rest of this article will go through implementing this specifically, but the codesandbox also has examples to getting state.

## Setup

To make the utilities we need type-safe, we first need to define some things.

1. **Paths**  
   Declare all the paths in your app in an `enum`
   ```typescript title="Enum of all paths"
   enum Paths {
     Home = "/",
     Users = "/user/:userId",
   }
   ```
2. **Route Definitions**  
   A big reason why I chose to use `react-location` over `react-router` is the typescript support.
   To define the params and search of each path, we use the `MakeGenerics` utility.

   ```typescript title="Route definition of all paths"
   // e.g. /?someId=123
   type HomePageRoute = MakeGenerics<{
     Search: {
       someId: number;
     };
   }>;

   // e.g. /user/:userId
   type UserRoute = MakeGenerics<{
     Params: {
       userId: string;
     };
   }>;
   ```

3. **Path-Route Mapping**
   ```typescript title="Route mapping of all paths"
   type Routes = {
     [Paths.Home]: HomePageRoute;
     [Paths.Users]: UserRoute;
   };
   ```

## Custom Utilities

Now that we have everything defined, we'll build utilities to make use of it.  
There are 3 utilities, but I'll focus on the base utility since the other 2 builds on top of it.

### Base Utility: `buildUrl`

`buildUrl` is a function that accepts `to`, `type`, `search`, and `params` to build a url.

```typescript
const url = buildUrl({ to: Paths.Users, params: { userId: "abc" } });
// url = /user/abc
```

Recall what we want out of this: params and search types should be based on the path chosen.  
Given the setup we have, we can use the Path-Route mapping we created.

```typescript {4}
type BuildUrlParams<TPath extends Paths> = {
  type?: "absolute" | "relative";
  to: TPath;
} & { search: Routes[TPath]["Search"] } & { params: Routes[TPath]["Params"] };
```

Unfortunately, **this doesn't work**.  
Typescript will throw an error `Type '"Search"' cannot be used to index type 'Routes[TPath]'`.

The error is a little cryptic, but it doesn't work because there exist routes that don't have search or params.
In the example so far, `HomePageRoute` doesn't have params and `UserRoute` doesn't have search.

#### Conditionally Optional

To work around this, we need to tell Typescript that its okay if either of them don't exist.

```typescript {12-15} title="Conditionally optional helpers"
import { PartialGenerics } from "@tanstack/react-location";

type HasParams<TRoute extends PartialGenerics> = undefined extends TRoute["Params"]
  ? { params?: TRoute["Params"] }
  : { params: TRoute["Params"] };
```

`PartialGenerics` is a type provided by `react-location` and it has optional params and search fields (hence the Partial prefix).
By using `<TRoute extends PartialGenerics>`, we will fix the typescript error above because params and search will always exist.

In addition, we use a condition to check if the field is defined `undefined extends TRoute["Params"]`.
This helps us make sure params is a required field if params is defined, or optional if it isn't.

#### Fully Typed

Here is the function in full.

```typescript title="BuildUrl"
import { defaultStringifySearch, PartialGenerics } from "@tanstack/react-location";

type HasParams<TRoute extends PartialGenerics> = undefined extends TRoute["Params"]
  ? { params?: TRoute["Params"] }
  : { params: TRoute["Params"] };

type HasSearch<TRoute extends PartialGenerics> = undefined extends TRoute["Search"]
  ? { search?: TRoute["Search"] }
  : { search: TRoute["Search"] };

type BuildUrlParams<TPath extends Paths> = {
  type?: "absolute" | "relative";
  to: TPath;
} & HasParams<Routes[TPath]> &
  HasSearch<Routes[TPath]>;

const buildUrl = <TPath extends Paths>(args: BuildUrlParams<TPath>) => {
  const { params, to, search, type = "relative" } = args;
  let url: string = to;

  // replace parameters to the given value
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, value);
    }
  }

  // use the default stringify function of react-location to build the search string
  if (search) {
    const queryString = defaultStringifySearch(search as any);
    url = url + queryString;
  }

  // assuming this is an SPA, we can use window to build an absolute path
  if (type === "absolute") {
    url = window.location.origin + url;
  }

  return url;
};
```

That's it! `buildUrl` is now strongly typed, based on the paths and routes we have set up.
The internal logic of the function should be fairly self explanatory and isn't the focus of this article.

### Other Utilities

The other 2 utilities `useNavigateApp` and `AppLink` use `buildUrl` internally.  
They are purely written to be strongly typed versions of `useNavigate` and `Link` from `react-location`.

## Codesandbox

Try it out in the [codesandbox](https://codesandbox.io/s/strongly-typed-routes-qrer0y).

## Known Gaps

After looking in the codesandbox, you may have realized that my solution isn't _entirely_ strongly typed.
I am not using the Path enum when declaring the routes object to pass to the Router.

```typescript {3,7,11}
const routes: Route[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/user",
    element: <UserPageHeader />,
    children: [
      {
        path: ":userId",
        element: <UserPage />,
      },
    ],
  },
];
```

This was a deliberate decision, as trying to reuse our enums and types here made everything way more complex.
I felt that in exchange for readability and maintainability, this is something I am willing to concede.
After all, making a mistake in this routes object would have been immediately obvious during development.

## Summary

In complex applications, I find that an "address book" of all routes is necessary.
Spending extra effort to make it strongly typed not only helps devs in finding routes in the app, but also eliminates erroneous navigations.

It is also important to note that the router library you choose goes a long way in how complex this can be.
At the time of writing this, I found it far easier to do this with `react-location`, as compared to `react-router`.

In closing, I felt that this was a simple solution to a problem I've faced in past projects.
However, I am aware that there may be gaps that I've yet to account for as the project I'm working on is still in its infancy.

If you have any opinions or alternate solutions, feel free to reach out to me. 😊
