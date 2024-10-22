import React from "react"
import { Link } from "gatsby"
import Showdata from "../components/showdata"
import Storedata from "../components/storedata"
import ImageSlider from "../components/imageSlider"
import Example from "../components/popup"
// import MapContainer from "../components/reviewsData"
import { MapContainerLayoutB } from "../components/reviewsHygraph"
import { StaticImage } from "gatsby-plugin-image"
import { useApolloClient, useQuery } from "@apollo/client"
import { IndexContent } from "../gql/indexQuery"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import VideoPlayer from "../components/videoPlayer"
import { CookieNotice } from "gatsby-cookie-notice"
import { useRef, useState, useEffect } from "react"
// import { IubendaCookiePolicy } from "../components/iubendaComponent"
// import { IubendaCookieConsent } from "../components/iubendaComponent"
import StickyBar from "../components/StickyBar"
import { Helmet } from "react-helmet"

export default function IndexPage({ pageContext }) {
  let [open, setOpen] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 3000)
  }, [])

  const cancelButtonRef = useRef(null)
  const client = useApolloClient()
  const {
    data: IndexContentData,
    loading: IndexContentDataQueryLoading,
    error: IndexContentDataQueryError,
  } = useQuery(IndexContent, {
    variables: {
      // internalId: pageContext.remoteId,
      locale: [pageContext.langKey],
    },
  })
  client.refetchQueries({
    include: [IndexContent],
  })
  if (IndexContentDataQueryLoading) return <p>Loading...</p>
  // console.log(IndexContentData.indices[0])
  // const client = new ApolloClient({
  //   uri: 'https://rickandmortyapi.com/graphql',
  //   cache: new InMemoryCache(),
  // });
  const images = [
    "https://picsum.photos/id/1/800/800",
    "https://picsum.photos/id/2/800/800",
    "https://picsum.photos/id/3/800/800",
  ]
  // const { slug, locale } = pageContext
  // const generateDynamicPagePath = (slug, language) => {
  //   return `/${language}/`
  //

  function obtenerIdYouTube(url) {
    const expresionesRegulares = [
      /youtube\.com\/watch\?v=(\w{11})(&t=\w+)?/,
      /[?&]v=([^&]+)/,
      /youtu\.be\/(\w{11})\?(&t=\w+)?/,
      /youtube\.com\/live\/(\w{11})/,
    ]

    for (const regex of expresionesRegulares) {
      const match = url.match(regex)

      if (match) {
        return match[1]
      }
    }

    return null // Si no se encontró ninguna coincidencia
  }

  const videos =
    IndexContentData.indices[0]?.presentationVideos?.map(video => ({
      sources: [
        {
          src: video.url,
          type: video.mimeType,
        },
      ],
    })) || []

  const coverOfVideo = IndexContentData.indices[0]?.coverOfVideo || []

  const videosWithCovers = videos.map((video, index) => ({
    ...video,
    cover: coverOfVideo[index], // Añadir el elemento correspondiente de coverOfVideo al objeto video
  }))

  // console.log(videosWithCovers)

  return (
    <main className="bg-hero-pattern bg-no-repeat bg-[right_60%_top_6%] pt-8 md:bg-[right_-18rem_top_-2%] lg:bg-[right_-30rem_top_-15rem] bg-[length:150%] md:bg-[length:85%] lg:bg-[length:75%]">
      <StickyBar pageContext={pageContext} />
      {/* <CookieNotice
        // backgroundWrapperClasses="fixed bg-[#e0e0e0] bg-[#F6CC4D] min-[480px]:w-2/3 min-[640px]:w-1/2 lg:w-1/3 p-4 right-4 left-4 bottom-5 flex items-center justify-center z-50 border-opacity-100 border-gray-300 rounded-xl shadow-md"
        // buttonWrapperClasses="max-w-md mx-auto bg-white rounded p-4 shadow-md"
        // acceptButtonText={IndexContentData.indices[0]?.acceptCookieButton}
        // acceptButtonClasses="w-full bg-[#0833a2] text-white p-2 rounded mt-4 hover:bg-blue-600"
        // declineButtonClasses="w-full bg-gray-300 text-gray-700 p-2 rounded mt-2 hover:bg-gray-400"
        // declineButtonText={IndexContentData.indices[0]?.declineCookieButton}
        // personalizeButtonClasses="hidden w-full bg-gray-300 text-gray-700 p-2 rounded mt-2 hover:bg-gray-400"
        // personalizeButtonText="I want to choose my cookies !"
        // cookies={[
        //   {
        //     name: "necessary",
        //     editable: false,
        //     default: true,
        //     title: "Essential",
        //     text: "Essential cookies are necessary for the proper functioning of the site. The site cannot function properly without them.",
        //   },
        //   {
        //     name: "gatsby-gdpr-google-analytics",
        //     editable: true,
        //     default: true,
        //     title: "Google Analytics",
        //     text: "Google Analytics is a statistical tool of Google allowing to measure the audience of the website.",
        //   },
        // ]}
      > */}
      {/* <div className="mb-3 text-gray-700" id="cookie"> */}
      {/* <h4 className="text-lg font-medium leading-6 text-gray-900">
            This websites uses cookies.
            </h4>
          <p className="mb-4 text-sm">
            Everybody wants to show his best side - and so do we. That’s why we
            use cookies to guarantee you a better experience.
          </p>
          <p className="mb-4 text-[13px]">
            Please review our{" "}
            <a href="/privacy-policy" className="text-blue-500 underline">
            Privacy Policy{" "}
            </a>
            for more information.
          </p> */}
      {/* <ReactMarkdown>
            {IndexContentData.indices[0]?.textOfCookies.markdown}
          </ReactMarkdown> */}
      {/* </div>  */}
      {/* </CookieNotice> */}
      {/* <IubendaCookiePolicy /> */}
      {/* <IubendaCookieConsent /> */}

      <Helmet>
        <title>
          {IndexContentData.indices[0].searchEngineOptimization.title}
        </title>
        <meta
          name="description"
          content={
            IndexContentData.indices[0].searchEngineOptimization.description
          }
        />
        <meta
          name="keywords"
          content={
            IndexContentData.indices[0].searchEngineOptimization.keywords
          }
        />
        <meta
          property="og:title"
          content={IndexContentData.indices[0].searchEngineOptimization.title}
        />
        <meta
          property="og:description"
          content="Explora Costa Rica con nuestros vehículos 4x4. ¡Reserva hoy y empieza tu aventura!"
        />
        <meta
          property="og:image"
          content="https://media.graphassets.com/OwrVgNoEQRK7vun9ALNj"
        />
        <meta
          property="og:image:alt"
          content="Alquiler de autos 4x4 todo terreno en Costa Rica, ideales para explorar montañas y selvas"
        />
        <meta property="og:url" content="https://wild-rider.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section id="sectionBellowHeader">
        <ReactMarkdown>
          {IndexContentData.indices[0].mainTextBelow.markdown}
        </ReactMarkdown>
      </section>
      <Link to={IndexContentData.indices[0].viewCarsbuttonurl?.slug}>
        <button className="bg-[#0833a2] text-white block m-auto py-5 px-16 hover:bg-blue-800 rounded-lg font-semibold text-lg md:ml-16">
          {IndexContentData.indices[0].viewCarsButtonText}
        </button>
      </Link>
      <h4 className="text-[#0833a2] font-black font-Inter tracking-widest uppercase pl-4 xl:pl-16 mb-8 mt-8">
        — {IndexContentData.indices[0].videosSectionTitle}
      </h4>
      <div className="items-center justify-center px-4 m-auto mb-8 md:w-5/6 video-container">
        <VideoPlayer videos={videosWithCovers} />
      </div>

      <section
        id="contentBelowVideo"
        className="!max-w-full !text-base px-2 md:px-4 md:mx-4 md:mb-8 md:mt-16 prose lg:prose-lg xl:prose-xl xl:px-16"
      >
        {IndexContentData.indices[0].contentBelowVideo.map((item, index) => (
          <ReactMarkdown key={index}>{item.markdown}</ReactMarkdown>
        ))}
      </section>

      <h4 className="text-[#0833a2] font-black font-Inter tracking-widest uppercase px-4 xl:pl-16 mb-8 mt-16">
        — {IndexContentData.indices[0].offersSectionTitle}
      </h4>
      <section id="sectionBellowTestimonialsTitle">
        <ReactMarkdown>
          {IndexContentData.indices[0].offersSectionText?.markdown}
        </ReactMarkdown>
      </section>
      <section className="grid px-5 font-bold sm:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-7 lg:gap-y-10 md:mx-4 md:my-12 justify-items-start md:text-center xl:px-16">
        {IndexContentData.indices[0].freeBenefitsElements.map(
          (benefit, index) => (
            <div
              key={index}
              // className="flex flex-row-reverse items-center justify-end"
              className="flex items-center"
            >
              <img
                src={benefit.benefitImage.url}
                alt={`Benefit ${index}`}
                className="h-12"
              />
              <p className="col-span-1 ml-5">{benefit.benefitTitle}</p>
            </div>
          )
        )}
      </section>
      <h4 className="text-[#0833a2] font-black font-Inter tracking-widest uppercase px-4 xl:pl-16 mb-8 mt-16">
        — {IndexContentData.indices[0].testimonialsSectionTitle}
      </h4>
      <section id="sectionBellowTestimonialsTitle">
        <ReactMarkdown>
          {IndexContentData.indices[0].testimonialSectionText.markdown}
        </ReactMarkdown>
      </section>
      <MapContainerLayoutB pageContext={pageContext} />
      {/* <div className="mx-auto">{<ImageSlider images={images} />}</div> */}
      {/* <button onClick={() => changeLanguage("es", slug)}>Español</button> */}
      {/* <Example /> */}
      {/* <Showdata pageContext={pageContext} /> */}
      {/* <Storedata /> */}
    </main>
  )
}
