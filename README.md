# [Dev Blog](https://wenchonglee.dev)

This was built with NextJS and each page is statically generated, deployed with Vercel.

- Posts are written in the `/data` directory
- For each markdown file in the directory,
  - Each post will have the metadata parsed by `gray-matter`
  - Post content will be serialized and rendered with `next-mdx-remote`
- Main mdx plugins used are: `rehypePrettyCode` and `remarkGfm`
