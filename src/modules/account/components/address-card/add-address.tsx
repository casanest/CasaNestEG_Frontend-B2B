"use client"

import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState, useActionState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress } from "@lib/data/customer"
import { useLocale } from "next-intl"

const AddAddress = ({
  region,
  addresses,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const locale = useLocale()
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between text-[#043364]"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-base-semi">{locale === "ar" ? "إضافة عنوان جديد" : "Add address"}</span>
        <Plus />
      </button>

      <Modal  isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading dir={locale === "ar" ? "rtl" : "ltr"} className="mb-2">{locale === "ar" ? "إضافة عنوان جديد" : "Add address"}</Heading>
        </Modal.Title>
        <form dir={locale === "ar" ? "rtl" : "ltr"} action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label={locale === "ar" ? "الاسم الأول" : "First name"}
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label={locale === "ar" ? "الاسم الأخير" : "Last name"}
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label={locale === "ar" ? "الشركة" : "Company"}
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label={locale === "ar" ? "العنوان 1" : "Address 1"}
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label={locale === "ar" ? "العنوان 2" : "Address 2"}
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label={locale === "ar" ? "الرمز البريدي" : "Postal code"}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label={locale === "ar" ? "المدينة" : "City"}
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <Input
                label={locale === "ar" ? "المقاطعة" : "Province/State"}
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label={locale === "ar" ? "رقم الهاتف" : "Phone"}
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-3">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
                data-testid="cancel-button"
              >
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <SubmitButton className="bg-[#043364] hover:bg-[#043964] text-white" data-testid="save-button">{locale === "ar" ? "حفظ" : "Save"}</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
