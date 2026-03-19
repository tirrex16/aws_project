import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext.tsx'

export default function ProjectsList() {
  const { projects, deleteProject } = useAdmin()
  const navigate = useNavigate()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    deleteProject(id)
    setConfirmId(null)
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Projects</h1>
          <p className="text-[0.9375rem] text-[#666]">{projects.length} total projects</p>
        </div>
        <Link to="/admin/projects/new" className="inline-flex items-center gap-2 bg-[#0f0f0f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold tracking-[-0.01em] hover:bg-[#333] transition-colors no-underline">
          + Add new project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-[#e8e8e8] rounded-[24px] p-16 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-[400px]">
          <p className="text-[1.0625rem] text-[#666] mb-6">No projects yet.</p>
          <Link to="/admin/projects/new" className="inline-flex items-center gap-2 bg-[#0f0f0f] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-[-0.01em] hover:bg-[#333] transition-colors no-underline">
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e8e8] rounded-[24px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <table className="w-full text-left border-collapse text-[0.875rem]">
            <thead>
              <tr className="border-b border-[#e8e8e8] bg-[#f9f9f9]/50">
                <th className="py-4 px-6 font-semibold text-[#666] w-[140px]">Image</th>
                <th className="py-4 px-6 font-semibold text-[#666]">Name</th>
                <th className="py-4 px-6 font-semibold text-[#666] w-[15%]">Type</th>
                <th className="py-4 px-6 font-semibold text-[#666] w-[15%]">Client</th>
                <th className="py-4 px-6 font-semibold text-[#666] w-[10%]">Year</th>
                <th className="py-4 px-6 font-semibold text-[#666] text-right w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-[#e8e8e8] last:border-0 hover:bg-[#fafafa] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-[#f0f0f0] border border-[#e8e8e8]">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[1.0625rem] font-bold text-[#0f0f0f] tracking-[-0.01em] mb-1">{p.name}</div>
                    <div className="text-[0.8125rem] text-[#666] leading-snug max-w-[300px] truncate">{p.tagline}</div>
                  </td>
                  <td className="py-4 px-6 text-[#444]">{p.type}</td>
                  <td className="py-4 px-6 text-[#444]">{p.client}</td>
                  <td className="py-4 px-6 text-[#666]">{p.year}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="px-3 py-1.5 bg-white border border-[#e8e8e8] text-[#0f0f0f] rounded-lg text-xs font-semibold hover:bg-[#f0f0f0] transition-colors flex items-center gap-1.5 cursor-pointer"
                        onClick={() => navigate(`/admin/projects/${p.id}`)}
                      >
                        <span className="text-[0.875rem]">✏️</span> Edit
                      </button>
                      <button
                        className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                        onClick={() => setConfirmId(p.id)}
                      >
                        <span className="text-[0.875rem]">🗑️</span> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-in fade-in" onClick={() => setConfirmId(null)}>
          <div className="w-full max-w-[420px] bg-white rounded-[24px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[1.5rem] font-bold tracking-[-0.02em] text-[#0f0f0f] mb-3">Delete project?</h2>
            <p className="text-[0.9375rem] text-[#666] leading-[1.5] mb-8">
              This action cannot be undone. The project will be removed from the public site immediately.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button className="px-5 py-2.5 bg-white border border-[#e8e8e8] text-[#0f0f0f] rounded-xl text-sm font-semibold hover:bg-[#f5f5f5] transition-colors cursor-pointer" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-red-600 text-white border border-red-600 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
                onClick={() => handleDelete(confirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
