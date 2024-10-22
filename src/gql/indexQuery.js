import { gql } from "@apollo/client"

const Index = gql`
  query Index($internalId: ID!, $locale: [Locale!]!) {
    index(where: { id: $internalId }, locales: $locale) {
      localizations {
        slug
        locale
      }
    }
  }
`

const IndexContent = gql`
  query IndexContent($locale: [Locale!]!) {
    indices(locales: $locale) {
      id
      mainTextBelow {
        html
        markdown
        text
      }
      viewCarsButtonText
      viewCarsbuttonurl {
        slug
      }
      videosSectionTitle
      coverOfVideo(locales: en) {
        url
      }
      presentationVideos(locales: en) {
        url
        mimeType
      }
      contentBelowVideo {
        html
        markdown
        text
      }
      offersSectionTitle
      offersSectionText {
        html
        markdown
        text
      }
      freeBenefitsElements(last: 100) {
        benefitImage(locales: en) {
          url
        }
        benefitTitle
      }
      testimonialsSectionTitle
      testimonialSectionText {
        html
        markdown
        text
      }
      textOfCookies {
        html
        markdown
        text
      }
      searchEngineOptimization {
        title
        description
        keywords
        localizations {
          title
        }
      }
    }
  }
`

export { Index, IndexContent }
