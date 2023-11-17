import { gql } from "@apollo/client"

const headerAndFooterElements = gql`
  query headerAndFooterElements($locale: [Locale!]!) {
    headerAndFooterElements(locales: $locale) {
      englishLangSelectorTitle
      frenchLangSelectorTitle
      germanLangSelectorTitle
      spanishLangSelectorTitle
      otherLangSelectorTitle
    }
  }
`

export { headerAndFooterElements }
