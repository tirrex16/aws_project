import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext.tsx'
import Nav from './components/Header.tsx'
import Hero from './components/Hero.tsx'
import About from './components/About.tsx'
import SelectedWork from './components/SelectedWork.tsx'
import WhyUs from './components/Capabilities.tsx'
import Services from './components/Services.tsx'
import Pricing from './components/Pricing.tsx'
import Journal from './components/Journal.tsx'
import Footer from './components/Footer.tsx'
import ProjectDetail from './pages/ProjectDetail.tsx'
import AdminLogin, { isAuthenticated } from './pages/admin/AdminLogin.tsx'
import AdminLayout from './pages/admin/AdminLayout.tsx'
import ProjectsList from './pages/admin/ProjectsList.tsx'
import ProjectForm from './pages/admin/ProjectForm.tsx'
import AssetsManager from './pages/admin/AssetsManager.tsx'

function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <SelectedWork />
        <WhyUs />
        <Services />
        <Pricing />
        <Journal />
      </main>
      <Footer />
    </>
  )
}

function AdminArea() {
  const [authed, setAuthed] = useState(isAuthenticated())

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />
  }

  return (
    <AdminLayout onLogout={() => setAuthed(false)}>
      <Routes>
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/:id" element={<ProjectForm />} />
        <Route path="assets" element={<AssetsManager />} />
      </Routes>
    </AdminLayout>
  )
}

function App() {
  return (
    <AdminProvider>
      <Routes>
        {/* Public site */}
        <Route
          path="/*"
          element={
            <>
              <Nav />
              <Routes>
                <Route index element={<Home />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
              </Routes>
            </>
          }
        />
        {/* Admin dashboard */}
        <Route path="/admin/*" element={<AdminArea />} />
      </Routes>
    </AdminProvider>
  )
}

export default App
