import React, { useState, useEffect, useMemo, useRef, Fragment } from "react"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import mailcheck from "mailcheck"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import countryList from "react-select-country-list"
import "flatpickr/dist/themes/airbnb.css"
import Flatpickr from "react-flatpickr"
import ReCAPTCHA from "react-google-recaptcha"
import { navigate } from "gatsby"
import { datosVar } from "./variableReactiva"
import { useApolloClient, useQuery } from "@apollo/client"
import { CarQuoteFormContent } from "../gql/carQuotePageQuery"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { data } from "autoprefixer"
import { addMinutes, format, parse } from "date-fns"
import he from "he" // Importar la biblioteca para desescapar HTML

const CarFormHtml = ({ apolloData, pageContext }) => {
  let [open, setOpen] = useState(true)
  // console.log(pageContext.langKey)
  const locale = pageContext.langKey || pageContext.pageContext.langKey
  const cancelButtonRef = useRef(null)
  const client = useApolloClient()
  const {
    data: CarQuoteFormData,
    loading: CarQuoteFormQueryLoading,
    error: CarQuoteFormQueryError,
  } = useQuery(CarQuoteFormContent, {
    variables: {
      locale: [locale],
    },
  })
  client.refetchQueries({
    include: [CarQuoteFormContent],
  })
  const captcha = useRef(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  // console.log(data)
  // console.log(pageContext.pageContext.langKey)
  // const datos = apolloData
  // console.log(datos)
  // console.log(datosVar())
  // const { carName, remoteId } = pageContext
  const carsById = apolloData?.cars[0]
  // console.log(carsById)
  // const { carsById } = apolloData.apolloData.carsById

  const [phone, setPhone] = useState("")

  const [value, setValue] = useState("")
  const [formError, setFormError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)

  const formRef = useRef(null)

  const [startDate, setStartDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [defaultValue, setDefaultValue] = useState("")

  const handleTimeChange = (selectedTime, setState) => {
    if (selectedTime && selectedTime.length > 0) {
      setState(selectedTime[0])
    }
  }

  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedPaidServices, setSelectedPaidServices] = useState([])
  const [selectedFreeServices, setSelectedFreeServices] = useState([])

  const handlePaidServicesChange = e => {
    const serviceName = e.target.value
    if (selectedPaidServices.includes(serviceName)) {
      // Remove the service if it was already selected
      setSelectedPaidServices(prevSelected =>
        prevSelected.filter(service => service !== serviceName)
      )
    } else {
      // Add the service if it was not selected
      setSelectedPaidServices(prevSelected => [...prevSelected, serviceName])
    }
  }

  // Función para manejar los cambios en los servicios gratuitos
  const handleFreeServicesChange = e => {
    const serviceName = e.target.value
    if (e.target.checked) {
      // Agregar el servicio seleccionado al array de servicios seleccionados
      setSelectedFreeServices([...selectedFreeServices, serviceName])
    } else {
      // Remover el servicio deseleccionado del array de servicios seleccionados
      setSelectedFreeServices(
        selectedFreeServices.filter(service => service !== serviceName)
      )
    }
  }

  const handleCountryChange = e => {
    setSelectedCountry(e.target.value)
  }

  const changeHandler = e => {
    setValue(e.target.value)
  }

  const [endDate, setEndDate] = useState(new Date())
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    // Actualizar minDate de endDate cada vez que startDate cambie
    const minDate = startDate
    setEndDate(prevEndDate => {
      if (prevEndDate < minDate) {
        // Si endDate es menor que la nueva minDate, actualiza endDate a minDate
        return minDate
      }
      return prevEndDate
    })
  }, [startDate])

  // Calcular la fecha mínima permitida para endDate
  const calculateMinEndDate = () => {
    const minEndDate = new Date(startDate)
    minEndDate.setDate(startDate.getDate() + 4)
    return minEndDate
  }

  // Actualizar minDate al cambiar startDate
  useEffect(() => {
    setEndDate([calculateMinEndDate()])
  }, [startDate])

  const handleDateChange = (selectedDate, setState) => {
    if (selectedDate && selectedDate.length > 0) {
      setState(selectedDate[0])
    }
  }

  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [suggestion, setSuggestion] = useState(null)
  const [suggestionConfirm, setSuggestionConfirm] = useState(null)

  useEffect(() => {
    mailcheck.run({
      email: email,
      suggested(s) {
        setSuggestion(s.full)
      },
      empty() {
        setSuggestion(null)
      },
    })
  }, [email])

  useEffect(() => {
    mailcheck.run({
      email: emailConfirm,
      suggested(s) {
        setSuggestionConfirm(s.full)
      },
      empty() {
        setSuggestionConfirm(null)
      },
    })
  }, [emailConfirm])

  const handleChange = (e, setEmailFunc, setSuggestionFunc) => {
    const newValue = e.currentTarget.value
    setEmailFunc(newValue)

    // Run mailcheck for suggestions
    mailcheck.run({
      email: newValue,
      suggested(s) {
        setSuggestionFunc(s.full)
      },
      empty() {
        setSuggestionFunc(null)
      },
    })
  }

  const acceptSuggestion = (suggestion, setEmailFunc) => {
    if (suggestion != null) setEmailFunc(suggestion)
  }
  const formatDate = dateString => {
    const date = new Date(dateString)
    const options = { year: "numeric", month: "short", day: "numeric" }
    return date.toLocaleDateString(pageContext.pageContext.langKey, options)
  }

  const [redirecting, setRedirecting] = useState(false)

  const [selectedServices, setSelectedServices] = useState({})
  const [customSelectedFreeServices, setCustomSelectedFreeServices] = useState(
    {}
  )

  const handleServiceSelection = (
    selectorTitle,
    selectedValue,
    isFreeService
  ) => {
    if (isFreeService) {
      setCustomSelectedFreeServices(prevState => ({
        ...prevState,
        [selectorTitle]: selectedValue,
      }))
    } else {
      setSelectedServices(prevState => ({
        ...prevState,
        [selectorTitle]: selectedValue,
      }))
    }
  }
  const onChange = () => {
    if (captcha.current.getValue()) {
      setIsCaptchaVerified(true) // Marcar como verificado cuando se obtenga una respuesta válida
    }
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setFormError(null)
    setSubmissionError(null)

    const form = e.target
    const fullName = form.name.value.trim()

    // Verificar que 'form.email' y 'form.emailConfirm' no sean undefined
    if (!form.email || !form.emailConfirm) {
      // Si aún no se han llenado los campos, simplemente regresa sin hacer nada
      return
    }

    // Verificar que haya al menos un espacio en blanco en el nombre completo
    if (!fullName.includes(" ")) {
      setFormError("Please enter at least a name and a last name.")
      return
    }

    // Validación personalizada solo si ambos campos están llenos
    const email = form.email.value.trim()
    const emailConfirm = form.emailConfirm.value.trim()

    if (email === "" || emailConfirm === "") {
      setFormError("Email or Email Confirm element is empty.")
      return
    }

    if (email !== emailConfirm) {
      const errorMessage = pageData.emailAndEmailConfirmNotEqualErrorMessage
        ? pageData.emailAndEmailConfirmNotEqualErrorMessage
        : "Email and Confirm Email must match."

      setFormError(pageData.emailAndEmailConfirmNotEqualErrorMessage)
      return
    }

    // Obtener las fechas y horas seleccionadas
    const startDateValue = document.getElementById("startDate").value
    const startTimeValue = document.getElementById("startTime").value

    const endDateValue = document.getElementById("endDate").value
    const endTimeValue = document.getElementById("endTime").value

    // Crear objetos Date para las fechas y horas seleccionadas
    const startDateObject = new Date(`${startDateValue} ${startTimeValue}`)
    const endDateObject = new Date(`${endDateValue} ${endTimeValue}`)

    // Calcular la diferencia en milisegundos
    const timeDifference = endDateObject - startDateObject

    // Calcular la diferencia en días, horas y minutos
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    const remainingHours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const remainingMinutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    )

    // Generar el texto con las selecciones de servicios pagados
    const selectedServicesText = Object.entries(selectedServices)
      .map(
        ([selectorTitle, selectedValue]) =>
          `${selectorTitle}:<br><strong>${selectedValue}</strong>`
      )
      .join("<br><br>")

    // Generar el texto con las selecciones de servicios gratuitos
    const customSelectedFreeServicesText = Object.entries(
      customSelectedFreeServices
    )
      .map(
        ([selectorTitle, selectedValue]) =>
          `${selectorTitle}:<br><strong>${selectedValue}</strong>`
      )
      .join("<br><br>")

    const formData = new FormData(form)

    formData.append(
      "timeDifference",
      `${daysDifference} Days, ${remainingHours} hours and ${remainingMinutes} minutes`
    )

    formData.append(
      "selectedPaidServices",
      selectedPaidServices.join("<br><br>")
    )

    formData.append(
      "selectedFreeServices",
      selectedFreeServices.join("<br><br>")
    )

    formData.append("quantityOfSelectedPaidServices", selectedServicesText)

    formData.append(
      "customSelectedFreeServices",
      customSelectedFreeServicesText
    )

    try {
      const response = await fetch(
        "https://hooks.zapier.com/hooks/catch/17251260/3f91vun",
        // "https://hooks.zapier.com/hooks/catch/alnf92837492/q983749q2832q",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(formData).toString(),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // setRedirecting(true)
      setFormSubmitted(true)
      setOpen(true)
      e.target.reset()

      // Resetear input de correo electrónico y mensajes de validación
      setEmail("")
      setEmailConfirm("")
      setSuggestion(null)
      setSuggestionConfirm(null)

      if (captcha.current) {
        captcha.current.reset()
      }

      // setTimeout(() => {
      //   setRedirecting(false)
      //   navigate(
      //     pageContext.pageContext.langKey === "en"
      //       ? "/"
      //       : `/${pageContext.pageContext.langKey}`
      //   )
      // }, 5000) // 5000 milisegundos = 5 segundos

      // Limpiar errores después de enviar el formulario con éxito
      setFormError(null)
    } catch (error) {
      setSubmissionError(`Error submitting form: ${error.message}`)
    }

    // Limpiar errores después de enviar el formulario con éxito
    setFormError(null)
    // Resto del código para manejar la respuesta del envío
  }

  const pageData = CarQuoteFormData?.carQuoteForms[0]

  // function generateTimeOptions(minTime, maxTime) {
  //   const options = []
  //   let currentTime = new Date(`2000-01-01 ${minTime}`)

  //   while (currentTime <= new Date(`2000-01-01 ${maxTime}`)) {
  //     options.push(
  //       <option key={currentTime.toISOString()} value={formatTime(currentTime)}>
  //         {formatTime(currentTime)}
  //       </option>
  //     )

  //     currentTime.setMinutes(currentTime.getMinutes() + 15) // Puedes ajustar el intervalo de tiempo según tus necesidades
  //   }

  //   return options
  // }
  function generateTimeOptions2(minTime, maxTime) {
    const options = []
    let currentTime = parse(minTime, "HH:mm", new Date(2000, 0, 1))
    const endTime = parse(maxTime, "HH:mm", new Date(2000, 0, 1))

    while (currentTime <= endTime) {
      const formattedTime = format(currentTime, "HH:mm")
      options.push(
        <option key={formattedTime} value={formattedTime}>
          {formattedTime}
        </option>
      )

      currentTime = addMinutes(currentTime, 15) // Puedes ajustar el intervalo de tiempo según tus necesidades
    }

    return options
  }

  function formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
  }

  const handleInputChange = (event, customMessage) => {
    if (!event.target.value.trim()) {
      event.target.setCustomValidity(customMessage || "This field is required")
    } else {
      event.target.setCustomValidity("")
    }
  }

  const selectedTransmission = pageContext?.pageContext?.selectedTransmission
  // console.log(pageContext.pageContext)
  // console.log(selectedTransmission)

  // useEffect(() => {
  //   const matchingOption = pageData?.vehicleSelectionOptions.find(option => {
  //     const carName = selectedTransmission?.toLowerCase().trim()
  //     const optionValue = option.toLowerCase()

  //     return carName === optionValue
  //   })

  //   const defaultOption = matchingOption ? matchingOption : ""

  //   setDefaultValue(defaultOption)
  // }, [selectedTransmission, pageData?.vehicleSelectionOptions])

  const languageMapping = {}
  // Itera sobre las opciones en inglés y alemán y crea el mapeo
  pageData?.paidServicesCheckboxOptions.forEach((option, index) => {
    const germanOption =
      pageData.localizations[0]?.paidServicesCheckboxOptions[index]
    languageMapping[option] = germanOption
  })
  const getTransmissionOptions = car =>
    [car.manualTransmission, car.automaticTransmission]
      .filter(
        transmission =>
          transmission && transmission.carTransmissionSelectorValue
      )
      .flatMap(transmission => ({
        value: transmission.carTransmissionSelectorValue,
        label: transmission.carTransmissionSelectorValue,
      }))
  const getDefaultOption = (transmissionOptions, selectedTransmission) =>
    transmissionOptions?.find(
      option =>
        selectedTransmission?.toLowerCase().trim() ===
        option?.value?.toLowerCase()
    ) || ""

  // console.log(getDefaultOption())

  useEffect(() => {
    const transmissionOptions = pageData?.cars.flatMap(getTransmissionOptions)
    // console.log(transmissionOptions)
    const defaultOption = getDefaultOption(
      transmissionOptions,
      selectedTransmission
    )
    // console.log(defaultOption)
    setDefaultValue(defaultOption)
  }, [selectedTransmission, pageData?.cars])

  if (CarQuoteFormQueryLoading) return <p>Loading...</p>
  if (CarQuoteFormQueryError)
    return <p>Error : {CarQuoteFormQueryError.message}</p>

  const ConditionalLabel = ({ text, htmlFor }) => {
    const hasAsterisk = text?.includes("*")
    const labelText = hasAsterisk ? text.replace("*", "") : text

    return (
      <label htmlFor={htmlFor} className="w-full my-2 text-xl font-black">
        <span>{labelText}</span>
        {hasAsterisk && <span className="text-red-500">*</span>}
      </label>
    )
  }

  return (
    <main className="p-3 bg-hero-pattern bg-no-repeat bg-[right_60%_top_6%] md:bg-[right_-18rem_top_-2%] lg:bg-[right_-30rem_top_-15rem] bg-[length:150%] md:bg-[length:85%] lg:bg-[length:75%] lg:p-14">
      <h1 className="mb-4 font-CarterOne lg:text-5xl">{pageData.title}</h1>
      <div className="mb-10 lg:grid lg:grid-cols-2 lg:ml-0">
        <p className="mb-4 lg:col-span-2">
          <ReactMarkdown>{pageData.welcomeText?.markdown}</ReactMarkdown>
        </p>
        <h2 className="row-start-2 font-CarterOne lg:col-span-2">
          {carsById?.carName}
        </h2>
        {carsById?.insuranceAndTaxInfo !== null &&
          carsById?.insuranceAndTaxInfo !== undefined && (
            <span className="inline-flex items-center row-[3/4] px-2 py-1 text-xs font-medium text-blue-700 rounded-md lg:col-[1/3] gap-x-2 bg-blue-50 mt-2 ring-1 ring-inset ring-blue-700/10">
              <svg
                className="w-2 fill-[#3b82f6]"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx="3" cy="3" r="3"></circle>
              </svg>
              {carsById.insuranceAndTaxInfo}
            </span>
          )}
        <img
          src={carsById?.carMainPhoto.url}
          alt={carsById?.carMainPhoto.altText}
          className="w-full m-auto sm:w-4/5 lg:m-0 lg:col-[2/3]"
        />
        <div className="flex flex-col xl:flex-row lg:col-[1/2] lg:row-[4/5]">
          <div className="overflow-x-auto flex sm:m-auto xl:m-[auto_0_auto_8%]">
            <table className="w-full whitespace-nowrap sm:w-auto sm:table-auto">
              <thead>
                <tr className="text-xl">
                  <th className="p-2">{carsById?.carsAndQuote.seasonTitle}</th>
                  <th className="p-2">{carsById?.carsAndQuote.datesTitle}</th>
                  <th className="p-2">
                    {carsById?.carsAndQuote.priceTitleManual}
                  </th>
                  <th className="p-2">
                    {carsById?.carsAndQuote.priceTitleAutomatic}
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {carsById?.manualTransmission.priceOfCar.map(
                    (manualPrice, priceIndex) => (
                      <tr key={priceIndex}>
                        <td className="p-2">
                          {manualPrice.season?.seasonTitle}
                        </td>
                        <td className="p-2">
                          {formatDate(manualPrice.season?.startDate)} |{" "}
                          {formatDate(manualPrice.season?.endDate)}
                        </td>
                        <td className="text-center">
                          {manualPrice.priceOfCar !== 0 ? (
                            <>${manualPrice.priceOfCar}</>
                          ) : (
                            manualPrice.unsetPriceMessage?.html && (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: he.decode(
                                    manualPrice.unsetPriceMessage.html
                                  ),
                                }}
                              />
                            )
                          )}
                        </td>
                        {carsById?.automaticTransmission?.priceOfCar?.[
                          priceIndex
                        ] && (
                          <>
                            {carsById?.automaticTransmission.priceOfCar[
                              priceIndex
                            ].priceOfCar !== 0 ? (
                              <td className="text-center">
                                $
                                {
                                  carsById?.automaticTransmission.priceOfCar[
                                    priceIndex
                                  ].priceOfCar
                                }
                              </td>
                            ) : (
                              <td className="text-center">
                                {carsById?.automaticTransmission.priceOfCar[
                                  priceIndex
                                ].unsetPriceMessage?.html && (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: he.decode(
                                        carsById?.automaticTransmission
                                          .priceOfCar[priceIndex]
                                          .unsetPriceMessage.html
                                      ),
                                    }}
                                  />
                                )}
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    )
                  )}
                </>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <form
        // ref={formRef}
        name="carquote"
        method="post"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="font-Poppins md:grid md:grid-cols-[1fr_1fr] md:grid-rows-[1fr] md:gap-x-4 md:gap-y-2 lg:block lg:my-5"
        onSubmit={handleSubmit}
      >
        {/* You still need to add the hidden input with the form name to your JSX form */}
        <p className="hidden">
          <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
          </label>
        </p>
        <input type="hidden" name="form-name" value="carquote" />
        <fieldset
          className="flex flex-col mb-10 md:row-span-2 lg:row-span-1 lg:w-1/2"
          role="group"
          aria-label="Datos personales"
        >
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.basicInformationTitle}
          </legend>
          <div className="flex flex-col md:justify-between">
            <div className="w-full pr-3">
              <input
                name="carName"
                style={{ height: "0px", width: "0px" }}
                value={carsById?.carName}
              />
              <label
                htmlFor="carName"
                style={{ height: "0px", width: "0px", fontSize: "0px" }}
              >
                Car Name
              </label>
              <ConditionalLabel
                text={pageData.completeNameField}
                htmlFor="name"
              />
              <input
                type="text"
                id="name"
                name="name"
                className="w-full h-10 p-2 my-2"
                required={pageData.completeNameField?.includes("*")}
                onInvalid={e =>
                  handleInputChange(e, pageData.nameFieldErrorMessage)
                }
              />
            </div>

            <div>
              <div className="flex flex-col justify-between pr-3">
                <ConditionalLabel text={pageData.emailField} htmlFor="email" />
                <input
                  className="w-full h-10 p-2"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => handleChange(e, setEmail, setSuggestion)}
                  required={pageData.emailField?.includes("*")}
                  onInvalid={e =>
                    handleInputChange(e, pageData.emailFieldErrorMessage)
                  }
                />

                {suggestion && (
                  <div>
                    Did you mean{" "}
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault()
                        acceptSuggestion(suggestion, setEmail)
                      }}
                    >
                      {suggestion}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between pr-3">
                <ConditionalLabel
                  text={pageData.confirmEmailField}
                  htmlFor="emailConfirm"
                />
                <input
                  className="w-full h-10 p-2"
                  type="email"
                  id="emailConfirm"
                  name="emailConfirm"
                  value={emailConfirm}
                  onChange={e =>
                    handleChange(e, setEmailConfirm, setSuggestionConfirm)
                  }
                  required={pageData.confirmEmailField?.includes("*")}
                  onInvalid={e =>
                    handleInputChange(e, pageData.confirmEmailFieldErrorMessage)
                  }
                />

                {suggestionConfirm && (
                  <div>
                    Did you mean{" "}
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault()
                        acceptSuggestion(suggestionConfirm, setEmailConfirm)
                      }}
                    >
                      {suggestionConfirm}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between pr-3">
              <ConditionalLabel
                text={pageData.phoneNumberField}
                htmlFor="phoneNumber"
              />
              <PhoneInput
                defaultCountry="us"
                value={phone}
                onChange={phone => setPhone(phone)}
                inputStyle={{ width: "100%", borderRadius: "0" }}
                inputProps={{
                  name: "phoneNumber",
                  type: "tel",
                  id: "phoneNumber",
                }}
                className="w-full h-10"
                required={pageData.phoneNumberField?.includes("*")}
              />
            </div>
            <div className="flex flex-col justify-between pr-3">
              <ConditionalLabel
                text={pageData.countryResidenceField}
                htmlFor="countrySelection"
              />
              <select
                id="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full h-10"
                name="countrySelection"
                required={pageData.countryResidenceField?.includes("*")}
              >
                {pageData.countriesOptions.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.numberOfTravelersField}
              htmlFor="numberOfTravelers"
            />

            <select
              id="numberOfTravelers"
              name="numberOfTravelers"
              required={pageData.numberOfTravelersField?.includes("*")}
              className="w-full h-10"
            >
              {pageData.numberOfTravelersOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.vehicleSelectionField}
              htmlFor="vehicleSelection"
            />
            <select
              id="vehicleSelection"
              name="vehicleSelection"
              className="w-full h-10"
              required={pageData.vehicleSelectionField?.includes("*")}
              value={defaultValue.value}
              onInvalid={e =>
                handleInputChange(e, pageData.vehicleSelectionFieldErrorMessage)
              }
              onChange={e =>
                setDefaultValue({
                  value: e.target.value,
                  label: e.target.value,
                })
              }
            >
              <option value="">
                {pageData.vehicleSelectionFieldDefaultOption}
              </option>
              {pageData.cars
                .flatMap(getTransmissionOptions)
                .map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        </fieldset>

        <fieldset
          className="mb-2 lg:grid lg:grid-cols-2 lg:col-span-1 lg:w-1/2"
          role="group"
          aria-label="Detalles del Viaje"
        >
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.pickUpInformationTitle}
          </legend>
          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.takeoverDateField}
              htmlFor="StartDate"
            />
            <Flatpickr
              options={{
                dateFormat: "F d, Y",
                minDate: "today",
              }}
              value={startDate}
              onChange={selectedDate =>
                handleDateChange(selectedDate, setStartDate)
              }
              name="StartDate"
              id="startDate"
              className="w-full h-10 px-4 py-2"
              required={pageData.takeoverDateField?.includes("*")}
            />
            <sub className="mt-2 text-sm text-gray-500">
              {pageData.subtextOfTakeoverDate}
            </sub>
          </div>
          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.takeoverHourField}
              htmlFor="StartTime"
            />
            <select
              name="StartTime"
              id="startTime"
              className="w-full h-10 px-4 py-2"
              required={pageData.takeoverHourField?.includes("*")}
            >
              {generateTimeOptions2("6:00", "20:00")}
              <option value={pageData.otherHour}>{pageData.otherHour}</option>
            </select>
            <sub className="mt-2 text-sm text-gray-500">
              {pageData.subtextOfTakeoverHour}
            </sub>
          </div>
          <div className="col-[1/3] justify-between pr-3">
            <div className="mb-6">
              <ConditionalLabel
                text={pageData.takeoverPlaceField}
                htmlFor="takeoverPlace"
              />
              <select
                id="takeoverPlace"
                name="takeoverPlace"
                className="w-full h-10"
                required={pageData.takeoverPlaceField?.includes("*")}
              >
                {pageData.takeoverPlaceOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset
          className="mb-4 lg:grid lg:grid-cols-2 lg:w-1/2"
          role="group"
          aria-label="Detalles del Viaje"
        >
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.dropOffInformationTitle}
          </legend>
          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.returnDateField}
              htmlFor="EndDate"
            />
            <Flatpickr
              options={{
                dateFormat: "F d, Y",
                minDate: calculateMinEndDate(),
              }}
              value={endDate}
              onChange={selectedDate => setEndDate(selectedDate)}
              name="EndDate"
              id="endDate"
              className="w-full h-10 px-4 py-2"
              required={pageData.returnDateField?.includes("*")}
            />
            <sub className="mt-2 text-sm text-gray-500">
              {pageData.subtextOfReturnDate}
            </sub>
          </div>
          <div className="flex flex-col justify-between pr-3">
            <ConditionalLabel
              text={pageData.returnHourField}
              htmlFor="endTime"
            />
            <select
              id="endTime"
              name="endTime"
              className="w-full h-10 px-4 py-2"
              required={pageData.returnHourField?.includes("*")}
            >
              {generateTimeOptions2("6:00", "20:00")}
              <option value={pageData.otherHour}>{pageData.otherHour}</option>
            </select>
            <sub className="mt-2 text-sm text-gray-500">
              {pageData.subtextOfTakeoverHour}
            </sub>
          </div>
          <div className="col-[1/3] justify-between pr-3">
            <div className="mb-6">
              <ConditionalLabel
                text={pageData.returnPlaceField}
                htmlFor="returnPlace"
              />
              <select
                id="returnPlace"
                name="returnPlace"
                className="w-full h-10"
                required={pageData.returnPlaceField?.includes("*")}
              >
                {pageData.returnPlaceOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset
          className="flex flex-col mb-10 md:col-span-2"
          role="group"
          aria-label="Información de Recogida"
        >
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.freeAdditionalServicesTitle}
          </legend>
          <div className="mb-6">
            <label className="block text-xl font-semibold">
              {pageData.freeServicesSubtitle}
            </label>
            <ul>
              {pageData.freeServicesCheckboxOptions.map((option, index) => (
                <li key={index} className="mb-2">
                  <input
                    type="checkbox"
                    id={option.replace(/\s+/g, "")}
                    name={option.replace(/\s+/g, "")}
                    value={option}
                    checked={selectedFreeServices.includes(option)}
                    onChange={handleFreeServicesChange}
                  />
                  <label className="ml-2" htmlFor={option.replace(/\s+/g, "")}>
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            {/* Selectores de servicios gratuitos */}
            {pageData.freeServicesSelectors.map((selector, index) => (
              <div key={index} className="mb-6 lg:w-1/2">
                <label className="block text-xl font-semibold">
                  {selector.serviceSelectorTitle}
                </label>
                <select
                  id={selector.serviceSelectorTitle?.replace(/\s+/g, "")}
                  name={selector.serviceSelectorTitle?.replace(/\s+/g, "")}
                  className="w-full h-10"
                  onChange={e =>
                    handleServiceSelection(
                      selector.serviceSelectorTitle,
                      e.target.value,
                      true
                    )
                  }
                >
                  {selector.serviceValues.map((value, valueIndex) => (
                    <option key={valueIndex} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="col-span-2 mb-5">
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.paidAdditionalServicesTitle}
          </legend>
          <div className="mb-6">
            <label className="block text-xl font-semibold">
              {pageData.paidServicesSubtitle}
            </label>
            <ul>
              {pageData.paidServicesCheckboxOptions.map((option, index) => (
                <li key={index} className="mb-2">
                  <input
                    type="checkbox"
                    id={option.replace(/\s+/g, "")} // Remove spaces from the option for the ID
                    name={option.replace(/\s+/g, "")} // Remove spaces from the option for the name
                    value={option}
                    checked={selectedPaidServices.includes(option)}
                    onChange={handlePaidServicesChange}
                  />
                  <label className="ml-2" htmlFor={option.replace(/\s+/g, "")}>
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          {pageData.paidServicesSelectors.map((selector, index) => (
            <div key={index} className="mb-6 lg:w-1/2">
              <label className="block text-xl font-semibold">
                {selector.serviceSelectorTitle}
              </label>
              <select
                id={selector.serviceSelectorTitle?.replace(/\s+/g, "")}
                name={selector.serviceSelectorTitle?.replace(/\s+/g, "")}
                className="w-full h-10"
                onChange={e =>
                  handleServiceSelection(
                    selector.serviceSelectorTitle,
                    e.target.value
                  )
                }
              >
                {selector.serviceValues.map((value, valueIndex) => (
                  <option key={valueIndex} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </fieldset>

        <fieldset className="col-span-2 mb-10 lg:w-1/2">
          <legend className="mb-5 text-3xl font-semibold">
            {pageData.communicationFieldTitle}
          </legend>
          <div>
            <ConditionalLabel
              text={pageData.communicationFieldSubtitle}
              htmlFor="questions"
            />
            <textarea
              id="questions"
              name="questions"
              required={pageData.communicationFieldSubtitle?.includes("*")}
              className="w-full h-32 p-2 md:h-40"
            ></textarea>
          </div>
        </fieldset>
        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <div className="relative captcha">
          <ReCAPTCHA
            ref={captcha}
            sitekey="6Lf0V-0nAAAAAEENM44sYr38XhTfqXbPoGJNZ651"
            hl={
              pageContext.pageContext?.headerAndFooterData ||
              pageContext.langKey
            }
            onChange={onChange}
            className="flex my-2 justify-evenly lg:justify-start"
          />
          {!isCaptchaVerified && (
            <input
              type="checkbox"
              className="absolute left-[40%] bottom-7 -z-10 captcha-fake-field lg:left-[10%]"
              tabIndex="-1"
              required
              onInvalid={e =>
                handleInputChange(e, pageData.reCaptchaErrorMessage)
              }
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-[#F6CC4D] text-white h-14 font-bold text-lg w-full md:col-span-2 lg:w-1/2 lg:col-span-1"
        >
          {pageData.buttonText}
        </button>
      </form>

      {formSubmitted ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="px-1 pt-5 pb-4 bg-white">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <div className="mt-2">
                            <ReactMarkdown>
                              {pageData?.formOnSubmitMessage}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        ok
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : (
        <></>
      )}
      {submissionError && <p style={{ color: "red" }}>{submissionError}</p>}
    </main>
  )
}

export default CarFormHtml
