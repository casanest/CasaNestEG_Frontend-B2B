import Image from 'next/image'

import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'
// import { HeroBanner } from 'types/strapi'

//       url: "https://images.pexels.com/photos/31346262/pexels-photo-31346262/free-photo-of-idyllic-view-of-amalfi-coastline-italy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",


const Hero = ({ data }: { data: any }) => {
  const { Headline, Text: text, CTA, Image: bannerImage } = data

  return (
    <>
      <Box className="h-[168px] max-h-[368px] w-full small:h-[368px] 2xl:h-[468px] 2xl:max-h-[468px]">
        <Image
          src={bannerImage.url}
          alt={bannerImage.alternativeText ?? 'Banner image'}
          className="h-full w-full object-cover"
          width={1000}
          height={600}
          priority
        />
      </Box>
      <Container className="flex flex-col gap-2 !py-6 small:gap-8 small:!py-10">
        <Heading className="max-w-full text-4xl text-basic-primary small:max-w-[510px] medium:text-5xl">
          {Headline}
        </Heading>
        <Box className="flex flex-col-reverse justify-between gap-8 medium:flex-row medium:items-center">
          <Button
            asChild
            className="w-max bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-full px-6 py-3"
          >
            <LocalizedClientLink href={CTA.BtnLink} className='text-lg text-black'>
              {CTA.BtnText}
            </LocalizedClientLink>
          </Button>

          <Text
            size="lg"
            className="max-w-full text-basic-primary medium:max-w-[410px] medium:text-end"
          >
            {text}
          </Text>
        </Box>

      </Container>
    </>
  )
}

export default Hero
