import React, { useState, useEffect } from "react"
import { useApolloClient, useQuery } from "@apollo/client"
import { FrequentAnswersAndQuestions } from "../gql/allAnswersAndQuestions"
import * as JsSearch from "js-search"
import { FaqContent } from "../gql/faqPageQuery"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import StickyBar from "../components/StickyBar"

export default function useFrequentAnswersAndQuestions({ pageContext }) {
  const client = useApolloClient()
  const {
    data: faqData,
    loading: faqLoading,
    error: faqError,
  } = useQuery(FrequentAnswersAndQuestions, {
    variables: { locale: [pageContext.langKey] },
  })

  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [answerState, setAnswerState] = useState({})

  const handleSearchChange = e => {
    const query = e.target.value
    setSearchTerm(query)
  }

  const toggleAnswerVisibility = index => {
    setAnswerState(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  const {
    data: faqPageData,
    loading: faqPageLoading,
    error: faqPageError,
  } = useQuery(FaqContent, {
    variables: { locale: [pageContext.langKey] },
  })

  useEffect(() => {
    if (!faqLoading && !faqError && faqData) {
      const faqElements = faqData.frequentAnswersAndQuestions || []
      // console.log("FAQ Data:", faqElements)

      // Crear un índice de búsqueda con los datos obtenidos
      const searchIndex = new JsSearch.Search("answer")
      searchIndex.addIndex("question")
      searchIndex.addIndex("answer")
      searchIndex.addDocuments(faqElements)
      // console.log("Search Index created with documents:", faqElements)

      // Realizar la búsqueda solo si hay un término de búsqueda
      if (searchTerm) {
        const results = searchIndex.search(searchTerm)
        // console.log("Search results for term:", results)
        setSearchResults(results)
      } else {
        // Si no hay un término de búsqueda, muestra todos los resultados
        // console.log("No search term, showing all results")
        setSearchResults(faqElements)
      }
    }
  }, [faqData, faqLoading, faqError, searchTerm])

  if (faqLoading) return <p>Loading...</p>
  if (faqError) return <p>Error: {faqError.message}</p>

  return (
    <main className="py-8 bg-hero-pattern bg-no-repeat bg-[right_60%_top_6%] md:bg-[right_-18rem_top_-2%] lg:bg-[right_-30rem_top_-15rem] bg-[length:150%] md:bg-[length:85%] lg:bg-[length:75%]">
      <StickyBar pageContext={pageContext} />
      <h1 className="p-4 font-CarterOne lg:pt-14 lg:text-5xl lg:px-14">
        {faqPageData?.faqs[0]?.title}
      </h1>

      <section className="p-4 my-4 lg:px-14">
        <ReactMarkdown>
          {faqPageData?.faqs[0]?.faqSubtitleText.markdown}
        </ReactMarkdown>
      </section>

      <div className="relative p-4 mb-10 lg:w-1/2 lg:pl-14">
        <label htmlFor="FAQsearch" className="absolute right-7 top-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-black"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path d="M384 208A176 176 0 1 0 32 208a176 176 0 1 0 352 0zM343.3 366C307 397.2 259.7 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 51.7-18.8 99-50 135.3L507.3 484.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L343.3 366z" />
          </svg>
        </label>
        <input
          type="text"
          id="FAQsearch"
          placeholder={faqPageData?.faqs[0]?.searchInputPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full h-10 px-5 bg-white rounded py-7 placeholder:text-black focus:outline-none focus:border-primary focus:ring"
        />
      </div>

      <ul className="lg:px-14">
        {searchResults.map((result, index) => (
          <li key={index} className="mb-10 lg:w-1/2">
            <h3
              onClick={() => toggleAnswerVisibility(index)}
              className="p-4 relative bg-white border-[2.9px] border-[#979797] rounded-2xl cursor-pointer"
            >
              {result.question}
              <span className="absolute top-6 right-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-black transition-transform ${
                    answerState[index] ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 512 512"
                  fill="currentColor"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              </span>
            </h3>
            {answerState[index] && (
              <div className="relative">
                <p className="bg-white p-4 pt-8 pb-20 border-[1px] border-[#979797] drop-shadow-[1px_0px_3px_rgba(80,80,80)] rounded-xl m-[0_0_-12px] relative bottom-3 z-0">
                  {result.answer}
                </p>
                <button
                  onClick={() => toggleAnswerVisibility(index)}
                  className="right-[44%] text-primary hover:underline cursor-pointer absolute bottom-10 md:right[55%] lg:right-1/2 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 mr-2 text-black transition-transform ${
                      answerState[index] ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                  </svg>
                  {faqPageData?.faqs[0]?.showLessText}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
