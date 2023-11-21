import { Box, Button, Container, Grid, Image, Text } from '@mantine/core';
import { m } from 'framer-motion';
import { appStore, googlePlayStore } from '../utils_constants/app_links';

const textGradient = 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500';

export default function HomeSection1() {
  return (
    <Container className='' size='xl'>
      <Grid className='mt-20 overflow-hidden align-middle'>
        <Grid.Col md={6} className='h-[600px] flex flex-col justify-center'>
          <Text className='mb-14 text-5xl font-extrabold leading-[1.25] text-left'>
            Manage all of <span className={textGradient}>your stock</span> <br /> <span className={textGradient}>signals in</span> one place
          </Text>

          <Text className='mb-14 text-lg font-semibold text-left'>
            Artificial intelligence makes it fast & easy to create content for your blog, <br /> social media, website, and more! Rated 5/5 stars
            in 3,000+ reviews.
          </Text>

          <Box className='flex'>
            <a className='dark:border-2 rounded-lg' href={googlePlayStore} target={'_blank'}>
              <img className='cursor-pointer w-[140px]' src='/images/apple.png' />
            </a>
            <div className='mx-3' />
            <a className='dark:border-2 rounded-lg' href={appStore} target={'_blank'}>
              <img className='cursor-pointer w-[140px]' src='/images/google.png' />
            </a>
          </Box>
        </Grid.Col>

        <Grid.Col md={6} className='h-[580px]'>
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
            <div className='h-36 flex justify-center'>
              <img src='/images/landing_iphone.png' className='h-[580px]' />
            </div>
          </m.div>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
