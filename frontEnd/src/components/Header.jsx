import React from 'react'
import Container from './container'

const Header = () => {
  return (
    <header className='mt-8'>
      <Container>
        <div>
            <h1 className='text-4xl font-bold text-sky-900'>GUTS <span className='text-red-600 text-2xl'>Investigation </span></h1>
        </div>
      </Container>
    </header>
  )
}

export default Header
