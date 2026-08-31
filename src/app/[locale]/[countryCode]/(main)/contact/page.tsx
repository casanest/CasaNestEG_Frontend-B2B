import { Container } from "@modules/common/components/container";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import SocialMediaLinks from "@modules/common/components/social-media-links";
import { listSocialMedia } from "@lib/data/social-media";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with CASANEST for tailored solutions and support.",
};

type PageProps = {
  params: {
    locale: string;
    countryCode: string;
  };
};
  
export default async function ContactPage({ params }: PageProps) {
  const t = await getTranslations("not-found");

  const locale = await getLocale(); // "ar", "en", ...

  const isRTL = locale === "ar";

  const socialMediaLinks = await listSocialMedia();

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="bg-white">
      <section className="bg-gradient-to-br from-[#043364] to-[#022a55] text-white">
        <Container className="!py-14 small:!py-16">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-white/70">
              {isRTL ? "اتصل بنا" : "Contact"}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">
              {isRTL
                ? "دعنا نتحدث عن مشروعك"
                : "Let us talk about your project"}
            </h1>
            <p className="mt-4 text-white/80 text-base sm:text-lg">
              {isRTL
                ? "سواء كنت بحاجة لتجهيز مساحة كاملة أو استشارة سريعة، فريقنا جاهز للمساعدة."
                : "Whether you need a full space setup or a quick consultation, our team is ready to help."}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="!py-12 small:!py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#043364]">
                  {isRTL ? "أرسل رسالة" : "Send a Message"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isRTL
                    ? "املأ النموذج وسنعاود التواصل معك في أقرب وقت."
                    : "Fill the form and we will get back to you as soon as possible."}
                </p>

                <form
                  className="mt-6 grid gap-4"
                  action="mailto:info@casanest.sa"
                  method="post"
                  encType="text/plain"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-gray-600">
                      {isRTL ? "الاسم" : "Name"}
                      <input
                        name="name"
                        required
                        className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:border-[#043364] focus:outline-none"
                        placeholder={isRTL ? "اكتب اسمك" : "Enter your name"}
                      />
                    </label>
                    <label className="grid gap-2 text-sm text-gray-600">
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                      <input
                        name="email"
                        type="email"
                        required
                        className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:border-[#043364] focus:outline-none"
                        placeholder={isRTL ? "example@email.com" : "you@email.com"}
                      />
                    </label>
                  </div>
                  <label className="grid gap-2 text-sm text-gray-600">
                    {isRTL ? "رقم الهاتف" : "Phone"}
                    <input
                      name="phone"
                      className="h-11 rounded-lg border border-gray-300 px-3 text-sm focus:border-[#043364] focus:outline-none"
                      placeholder={isRTL ? "010xxxxxxx" : "+20..."}
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-gray-600">
                    {isRTL ? "تفاصيل المشروع" : "Project Details"}
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#043364] focus:outline-none"
                      placeholder={isRTL ? "اكتب تفاصيل مشروعك" : "Tell us about your project"}
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#043364] px-6 text-white font-semibold hover:bg-[#022a55] transition"
                  >
                    {isRTL ? "إرسال" : "Submit"}
                  </button>
                </form>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#043364]">
                  {isRTL ? "بيانات التواصل" : "Contact Info"}
                </h3>
                <ul className="mt-4 grid gap-3 text-sm text-gray-600">
                  <li>info@casanest.sa</li>
                  <li>+201012345678</li>
                  <li>{isRTL ? "الفيوم، مصر" : "Fayoum, Egypt"}</li>
                </ul>
                {socialMediaLinks.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-[#043364] mb-2">
                      {isRTL ? "تابعنا" : "Follow Us"}
                    </h4>
                    <SocialMediaLinks links={socialMediaLinks} variant="contact" />
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-gray-50">
                <h3 className="text-lg font-semibold text-[#043364]">
                  {isRTL ? "هل تريد خدمة عاجلة؟" : "Need quick help?"}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {isRTL
                    ? "تواصل معنا مباشرة وسنرتب معك أفضل حل." 
                    : "Reach out directly and we will arrange the best solution for you."}
                </p>
                <LocalizedClientLink
                  href="/our-services"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#043364] px-5 text-sm font-semibold text-[#043364] hover:bg-[#043364] hover:text-white transition"
                >
                  {isRTL ? "تعرّف على خدماتنا" : "Explore Services"}
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
