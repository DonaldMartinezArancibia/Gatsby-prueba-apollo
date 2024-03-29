import { gql } from "@apollo/client"

const menuElements = gql`
  query menuElements($locale: [Locale!]!) {
    menus(locales: $locale) {
      menuElements {
        ... on Index {
          id
          slug
          title
        }
        ... on AboutUsAndOurTeam {
          id
          slug
          title
        }
        ... on CarsAndQuote {
          id
          slug
          title
        }
        ... on RentalInfo {
          id
          slug
          title
        }
        ... on Testimonial {
          id
          slug
          title
        }
        ... on Faq {
          id
          slug
          title
        }
        ... on ContactAndLocation {
          id
          slug
          title
        }
        ... on TravelPlanner {
          id
          slug
          title
        }
      }
    }
  }
`

export { menuElements }
