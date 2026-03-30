import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext.tsx'
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

import CapabilitiesEditor from './pages/admin/CapabilitiesEditor.tsx'
import ServicesEditor from './pages/admin/ServicesEditor.tsx'
import PricingEditor from './pages/admin/PricingEditor.tsx'
import JournalEditor from './pages/admin/JournalEditor.tsx'

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
        <Route path="capabilities" element={<CapabilitiesEditor />} />
        <Route path="services" element={<ServicesEditor />} />
        <Route path="pricing" element={<PricingEditor />} />
        <Route path="journal" element={<JournalEditor />} />

      </Routes>
    </AdminLayout>
  )
}

function AppContent() {
  const { loading } = useAdmin()

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="w-8 h-8 border-2 border-[#e8e8e8] border-t-[#0f0f0f] rounded-full animate-spin" />
      </div>
    )
  }

  return (
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
  )
}

function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  )
}

export default App
