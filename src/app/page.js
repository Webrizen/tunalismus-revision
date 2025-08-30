import HomePage from '@/components/sections/home'
import React from 'react'

export default function Home() {
  return (
    <>
    <HomePage />
      <section className='flex flex-col items-center justify-center min-h-[200vh] py-2 px-5 text-center'>
        <h1 className='text-4xl'>Welcome to Tunalismus is a modern, human-centered space for learning German, Turkish, and English. Founded by Sema, a connector and language guide, to help you find your voice.</h1>
      </section>
    </>
  )
}
