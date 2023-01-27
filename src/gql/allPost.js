import { gql } from "@apollo/client"

const GET_POSTS = gql`
  query Posts($slug: String!) {
    posts(where: { slug: $slug }) {
      id
      slug
      title
      category
      content
      cover {
        url(
          transformation: {
            image: { resize: { width: 1200, height: 630, fit: crop } }
          }
        )
      }
      seo {
        ... on Seo {
          title
          description
          image {
            url(
              transformation: {
                image: { resize: { width: 1200, height: 630 } }
              }
            )
          }
        }
      }
      address {
        adressLineOne
        adressLineTwo
        cIty
        postalCode
      }
    }
  }
`

export default GET_POSTS
