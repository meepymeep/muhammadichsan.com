import BlogCard from '@/components/mollecules/BlogCard'
import HeroWithPhoto from '@/components/mollecules/HeroWithPhoto'
import ProjectCard from '@/components/mollecules/ProjectCard'
import Section from '@/components/organism/Section'
import Layout, { LayoutProps } from '@/components/templates/Layout'

import { Blogs } from '@/data/blog/blog.type'
import { PortfolioHeadProps } from '@/data/portfolio/portfolio.type'
import { getBlog } from '@/helpers/getBlog'
import getPortfolio from '@/helpers/getPortfolio'
import { getMetaData } from '@/libs/metaData'
import { getNewestBlog } from '@/libs/sortBlog'
import { getNewestPortfolio } from '@/libs/sortPortfolio'

import { GetStaticProps, NextPage } from 'next'
import readingTime from 'reading-time'

interface HomePageProps {
  blogs: Array<Blogs>
  portfolios: Array<PortfolioHeadProps>
}

const HomePage: NextPage<HomePageProps> = ({ blogs, portfolios }) => {
  const meta = getMetaData({
    title: 'My Web',
    template: 'Cloud & Backend Enthusiast',
    description: `Personal Website, Online Portfolio And Blog, Built On Top Of NEXT.js, An Online Space For Muhammad Ichsan To Share His Knowledge And Experience.`,
    keywords: ['Muhammad Ichsanul Fadhil', 'Muhammad Ichsanul F', 'ichsanputr', 'Muhammadichsan', 'muhammadichsan.com'],
    og_image: `https://ik.imagekit.io/mlnzyx/tr:w-${712},h-${712},tr:bl-10,f-auto/attachment/profile.webp`,
    og_image_alt: 'Muhammad Ichsanul Fadhil',
    slug: '/',
    type: 'website'
  })
  return (
    <Layout {...(meta as LayoutProps)}>
      <HeroWithPhoto
        title={meta.title as string}
        subtitle='Student &amp; Frontend Developer'
        description="Hello👋, I'm Muhammad Ichsanul Fadhil, a student at SMKN 2 Depok and now self-taught about Cloud Computing and Backend, welcome to my website where you can find my portfolio, blog and more."
        img={{
          alt_title: meta.title as string,
          src: meta?.openGraph?.images ? meta.openGraph.images[0].url : ''
        }}
      />

      <Section
        title='Featured Post'
        gridCols='grid-cols-1 md:grid-cols-2'
        data={blogs}
        Component={BlogCard}
        link={{
          to: '/blog',
          children: 'See all post'
        }}
      />

      <Section
        title='Featured Portfolio'
        gridCols='grid-cols-1 md:grid-cols-2'
        data={portfolios}
        Component={ProjectCard}
        link={{
          to: '/portfolio',
          children: 'See all portfolio'
        }}
      />
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const res = await getBlog()
  const response = await getPortfolio()

  const blogs = res
    .filter((r) => r.header.featured)
    .map((r) => ({ est_read: readingTime(r.content).text, ...r.header }))
    .sort(getNewestBlog)

  const portfolios = response.filter((r) => r.featured).sort(getNewestPortfolio)

  return {
    props: {
      blogs,
      portfolios
    }
  }
}

export default HomePage