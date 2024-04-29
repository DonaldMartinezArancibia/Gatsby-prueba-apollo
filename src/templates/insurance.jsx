import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { InsuranceContent } from "../gql/insurancePageQuery"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

const Insurance = ({ pageContext }) => {
  const {
    data: insurancePageData,
    loading: insurancePageLoading,
    error: insurancePageError,
  } = useQuery(InsuranceContent, {
    variables: { locale: [pageContext.langKey] },
  })

  if (insurancePageLoading) return <p>Loading...</p>
  if (insurancePageError) return <p>Error: {insurancePageError?.message}</p>

  const insurancePage = insurancePageData.insurances[0] || []

  return (
    <main className="p-3 bg-hero-pattern bg-no-repeat bg-[right_60%_top_6%] md:bg-[right_-18rem_top_-2%] lg:bg-[right_-30rem_top_-15rem] bg-[length:150%] md:bg-[length:85%] lg:bg-[length:75%] lg:p-14">
      <h1 className="mb-10 font-CarterOne lg:text-5xl">
        {insurancePage.title}
      </h1>

      {/* {insurancePage && ReactHtmlParser(insurancePage)} */}

      <div className="sm:grid lg:grid-cols-3">
        {insurancePage.toggleContent.map((content, contentIndex) => (
          <ContentToggle
            key={contentIndex}
            content={content}
            index={contentIndex}
            insurancePage={insurancePage}
          />
        ))}
      </div>
    </main>
  )
}

const ContentToggle = ({ content, index, insurancePage }) => {
  const [isExtendedContentVisible, setIsExtendedContentVisible] =
    useState(false)

  const handleToggleContent = () => {
    setIsExtendedContentVisible(prev => !prev)
  }

  return (
    <section id="toggleContent" className="mb-14 col-[1/4]">
      <div className="mb-2">
        <ReactMarkdown>{content.displayContent?.markdown}</ReactMarkdown>
      </div>

      {content.extendedContent && (
        <div
          className={`extended-content-${index} ${
            isExtendedContentVisible ? "" : "hidden"
          }`}
        >
          <ReactMarkdown>{content.extendedContent?.markdown}</ReactMarkdown>
        </div>
      )}
      {content.extendedContent && (
        <button
          className="text-[#0833a2] hover:underline"
          onClick={handleToggleContent}
        >
          {isExtendedContentVisible
            ? insurancePage.hideText
            : insurancePage.showText}
        </button>
      )}
    </section>
  )
}

export default Insurance