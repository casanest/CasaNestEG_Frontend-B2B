"use client"

import { useActionState } from "react"
import { motion } from "framer-motion"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useLocale } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const locale = useLocale()
  const isRTL = locale === "ar"

  // Localized content
  const content = {
    title: isRTL ? "كن عضوًا في متجر CasaNest" : "Become a CasaNest Store Member",
    subtitle: isRTL ? "أنشئ ملفك الشخصي واحصل على تجربة تسوق مميزة" : "Create your profile for an enhanced shopping experience",
    firstName: isRTL ? "الاسم الأول" : "First name",
    lastName: isRTL ? "الاسم الأخير" : "Last name",
    email: isRTL ? "البريد الإلكتروني" : "Email",
    phone: isRTL ? "الهاتف" : "Phone",
    password: isRTL ? "كلمة المرور" : "Password",
    terms: isRTL ? "بإنشاء حساب، فإنك توافق على" : "By creating an account, you agree to",
    privacyPolicy: isRTL ? "سياسة الخصوصية" : "Privacy Policy",
    termsOfUse: isRTL ? "شروط الاستخدام" : "Terms of Use",
    join: isRTL ? "انضم" : "Join",
    existingMember: isRTL ? "لديك حساب بالفعل؟" : "Already a member?",
    signIn: isRTL ? "تسجيل الدخول" : "Sign in"
  }

  return (
    <motion.div
      className="max-w-md w-full flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-gray-100"
      data-testid="register-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Brand Logo/Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 bg-[#043364] rounded-full flex items-center justify-center mx-auto">
          <span className="text-white text-xl font-bold">{isRTL ? 'ل' : 'L'}</span>
        </div>
      </motion.div>

      <motion.h1
        className="text-2xl font-bold mb-4 text-[#043364] text-center"
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {content.title}
      </motion.h1>

      <motion.p
        className="text-center text-gray-600 mb-8"
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {content.subtitle}
      </motion.p>

      <form className="w-full flex flex-col" action={formAction}>
        <motion.div
          className="flex flex-col w-full gap-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={content.firstName}
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label={content.lastName}
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>

          <Input
            label={content.email}
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />

          <Input
            label={content.phone}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />

          <Input
            label={content.password}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ErrorMessage
            error={message}
            data-testid="register-error"
            // className="mt-4"
          />
        </motion.div>

        <motion.p
          className="text-center text-gray-600 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {content.terms}{" "}
          <LocalizedClientLink
            href="/returns"
            className="underline text-[#043364] hover:text-[#06529c] transition-colors"
          >
            {content.privacyPolicy}
          </LocalizedClientLink>{" "}
          {isRTL ? "و" : "and"}{" "}
          <LocalizedClientLink
            href="/returns"
            className="underline text-[#043364] hover:text-[#06529c] transition-colors"
          >
            {content.termsOfUse}
          </LocalizedClientLink>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <SubmitButton
            className="w-full bg-[#043364] hover:bg-[#06529c] text-white py-3 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg"
            data-testid="register-button"
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
          >
            {content.join}
          </SubmitButton>
        </motion.div>
      </form>

      <motion.div
        className="text-center text-gray-600 text-sm mt-8 pt-6 border-t border-gray-200 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {content.existingMember}{" "}
        <motion.button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline text-[#043364] font-medium hover:text-[#06529c] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content.signIn}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Register