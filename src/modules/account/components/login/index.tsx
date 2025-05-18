import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const locale = useLocale()
  const isRTL = locale === "ar"

  // Localized content
  const content = {
    title: isRTL ? "أهلاً بك" : "Welcome back",
    subtitle: isRTL ? "سجل الدخول للوصول إلى حسابك" : "Sign in to access your account",
    emailLabel: isRTL ? "البريد الإلكتروني" : "Email",
    passwordLabel: isRTL ? "كلمة المرور" : "Password",
    signIn: isRTL ? "تسجيل الدخول" : "Sign In",
    noAccount: isRTL ? "ليس لديك حساب؟" : "Don't have an account?",
    register: isRTL ? "إنشاء حساب" : "Create account"
  }

  return (
    <motion.div
      className={`max-w-md w-full flex flex-col items-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 mx-auto md:mx-0 ${isRTL ? 'text-right' : 'text-left'}`}
      data-testid="login-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Logo/Header Placeholder */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-16 h-16 bg-[#043364] rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">{isRTL ? 'ش' : 'L'}</span>
        </div>
      </motion.div>

      <motion.h1
        className="text-3xl font-bold mb-4 text-[#043364]"
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {content.title}
      </motion.h1>

      <motion.p
        className="text-center text-gray-600 mb-8 text-base"
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {content.subtitle}
      </motion.p>

      <form className="w-full" action={formAction}>
        <motion.div
          className="flex flex-col w-full gap-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Input
            label={content.emailLabel}
            name="email"
            type="email"
            placeholder={isRTL ? "example@example.com" : "example@example.com"}
            autoComplete="email"
            required
            data-testid="email-input"
            containerClassName={`border border-gray-300 rounded-lg focus-within:border-[#043364] focus-within:ring-2 focus-within:ring-[#043364]/20 transition-all ${isRTL ? 'text-right' : 'text-left'}`}
            inputClassName={isRTL ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}
          />
          <Input
            label={content.passwordLabel}
            name="password"
            type="password"
            placeholder={isRTL ? "••••••••" : "••••••••"}
            autoComplete="current-password"
            required
            data-testid="password-input"
            containerClassName={`border border-gray-300 rounded-lg focus-within:border-[#043364] focus-within:ring-2 focus-within:ring-[#043364]/20 transition-all ${isRTL ? 'text-right' : 'text-left'}`}
            inputClassName={isRTL ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ErrorMessage
            error={message}
            data-testid="login-error-message"
            className="mt-4 text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <SubmitButton
            data-testid="sign-in-button"
            className={`w-full bg-[#043364] hover:bg-[#06529c] text-white py-3 rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg ${isRTL ? 'font-arabic' : 'font-sans'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {content.signIn}
          </SubmitButton>
        </motion.div>

        {/* Forgot Password Link */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href="#"
            className="text-sm text-[#043364] hover:text-[#06529c] transition-colors"
          >
            {isRTL ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </a>
        </motion.div>
      </form>

      <motion.div
        className="text-center text-gray-600 text-sm mt-8 pt-6 border-t border-gray-200 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {content.noAccount}{" "}
        <motion.button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline text-[#043364] font-medium hover:text-[#06529c] transition-colors"
          data-testid="register-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content.register}
        </motion.button>
      </motion.div>

      {/* Social Login Options */}
      {/* <motion.div
        className="mt-8 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">
              {isRTL ? "أو سجل الدخول باستخدام" : "Or continue with"}
            </span>
          </div>
        </div>

        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.667-4.166-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.496 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
            </svg>
            {isRTL ? "جوجل" : "Google"}
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
            {isRTL ? "فيسبوك" : "Facebook"}
          </button>
        </div>
      </motion.div> */}
    </motion.div>
  )
}

export default Login