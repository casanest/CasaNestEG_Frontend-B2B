import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getLocale } from "next-intl/server"

const SignInPrompt = async () => {
  const locale = await getLocale()
  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge text-[#043364]">
          {locale === "ar" ? "لديك حساب بالفعل" : "Already have an account?"}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {locale === "ar" ? "تسجيل الدخول للحصول على تجربة أفضل." : "Sign in for a better experience."}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10 bg-[#043364] hover:bg-blue-900 text-white" data-testid="sign-in-button">
            {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
