import React, { useState } from 'react'
import { Container } from 'react-bootstrap'

import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import HomeScreen from './screens/homeScreen/homeScreen'
import Sidebar from './components/sidebar/Sidebar'
import NoticiasScreen from './screens/noticiasScreen/NoticiasScreen'
import VerNoticiaScreen from './screens/verNoticiaScreen/VerNoticiaScreen'
import SearchScreen from './screens/searchScreen/SearchScreen'
import PrivacidadScreen from './screens/privacidadScreen/PrivacidadScreen'
import CreateScreen from './screens/createScreen/CreateScreen'
import LoginScreen from './screens/loginScreen/LoginScreen'

import { Navigate, Route, Routes } from 'react-router-dom'

import './_app.scss'
import WatchScreen from './screens/watchScreen/WatchScreen'


const Layout = ({ children }) => {
   const [sidebar, toggleSidebar] = useState(false)
   const handleToggleSidebar = () => toggleSidebar(value => !value)

   return (
      <>
         <Header handleToggleSidebar={handleToggleSidebar} />
         <div className='app__container'>
            <Sidebar
               sidebar={sidebar}
               handleToggleSidebar={handleToggleSidebar}
            />
            <Container fluid className='app__main '>
               {children}
            </Container>
         </div>
         <Footer/>
      </>
   )
}

const App = () => {
   return (
      <Routes>
         <Route path='/' exact element={<Layout>
               <HomeScreen />
            </Layout>}>
            
         </Route>

         <Route path='/watch/:id' element={<Layout>
               <WatchScreen />
            </Layout>}>
            
         </Route>

         <Route path='/noticias/:id/nota/:idnota' element={<Layout>
               <VerNoticiaScreen />
            </Layout>}>
            
         </Route>

         <Route path='/noticias/:id' element={<Layout>
               <NoticiasScreen />
            </Layout>}>
            
         </Route>

         <Route path='/buscar/' element={<Layout>
               <SearchScreen />
            </Layout>}>
            
         </Route>

         <Route path='/privacidad/' element={<Layout>
               <PrivacidadScreen />
            </Layout>}>
            
         </Route>

         <Route path='/crear' element={<Layout>
               <CreateScreen />
            </Layout>}>
            
         </Route>

         <Route path='/login' element={<Layout>
               <LoginScreen />
            </Layout>}>
            
         </Route>

         <Route
        path="*"
        element={<Navigate to="/" />}
         />
      </Routes>
   )
}

export default App
