import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext.tsx'
import type { JournalContent, JournalPost } from '../../data/siteContent.ts'
import InlineImageUpload from './InlineImageUpload.tsx'

export default function JournalEditor() {
  const { siteContent, updateSiteContent } = useAdmin()
  const [form, setForm] = useState<JournalContent>({
    posts: siteContent.journal.posts.map(p => ({ ...p })),
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateSiteContent('journal', form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePost = (idx: number, field: keyof JournalPost, value: string) => {
    const posts = [...form.posts]
    posts[idx] = { ...posts[idx], [field]: value }
    setForm({ ...form, posts })
  }

  const addPost = () => {
    setForm({ ...form, posts: [...form.posts, { title: '', tag: '', date: '' }] })
  }

  const removePost = (idx: number) => {
    setForm({ ...form, posts: form.posts.filter((_, i) => i !== idx) })
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#e8e8e8]">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Journal / Blog</h1>
          <p className="text-[0.9375rem] text-[#666]">{form.posts.length} posts</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addPost} className="px-5 py-2.5 bg-white border border-[#e8e8e8] text-[#0f0f0f] rounded-xl text-sm font-semibold hover:bg-[#f5f5f5] transition-colors">+ Add post</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#0f0f0f] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="max-w-[800px] flex flex-col gap-5">
        {form.posts.length === 0 ? (
          <div className="bg-white border border-[#e8e8e8] rounded-[24px] p-16 flex flex-col items-center justify-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-[300px]">
            <p className="text-[1.0625rem] text-[#666] mb-6">No posts yet.</p>
            <button onClick={addPost} className="inline-flex items-center gap-2 bg-[#0f0f0f] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition-colors">
              Add your first post
            </button>
          </div>
        ) : (
          form.posts.map((post, i) => (
            <div key={i} className="bg-white border border-[#e8e8e8] rounded-[20px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between bg-[#f9f9f9] px-6 py-3 border-b border-[#e8e8e8]">
                <span className="text-xs font-bold text-[#888]">POST {i + 1}</span>
                {form.posts.length > 1 && (
                  <button onClick={() => removePost(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors">✕</button>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Title</label>
                  <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={post.title} onChange={(e) => updatePost(i, 'title', e.target.value)} placeholder="Post title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Tag</label>
                    <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={post.tag} onChange={(e) => updatePost(i, 'tag', e.target.value)} placeholder="e.g. Design" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Date</label>
                    <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={post.date} onChange={(e) => updatePost(i, 'date', e.target.value)} placeholder="Mar 10, 2026" />
                  </div>
                </div>
                <InlineImageUpload assetKey={`work_${i + 1}`} label="Post Cover Image" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
