/**
 * @file app/post/create/page.tsx
 * @description 예원's 맛집도감의 새 글 작성(추가) 페이지 컴포넌트입니다.
 * 제공된 작성 화면 시안(_1/screen.png)의 디자인 요소를 그대로 재현했습니다.
 * 좌측은 꼬불꼬불한 에디터 폼(Editor Form)과 툴바, 우측은 3중 폴라로이드 사진 조합(Masking Tape & Polaroid) 실시간 미리보기입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

// 식당 대표 이미지 선택용 프리셋 리스트 (Unsplash 고화질 이미지)
const IMAGE_PRESETS = [
  { name: '브런치 & 아보카도 토스트', url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&auto=format&fit=crop&q=80' },
  { name: '감성 바질 파스타', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80' },
  { name: '바삭한 일식 돈카츠', url: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=600&auto=format&fit=crop&q=80' },
  { name: '시원한 카페 라떼', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80' },
  { name: '화덕 치즈 피자', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { name: '신선한 모듬 초밥', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80' }
]

const LOCAL_STORAGE_KEY = 'foodiediary_create_post_draft'

export default function CreatePostPage() {
  const supabase = createClient()
  const router = useRouter()

  // DOM 참조 (DOM Reference)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 상태 관리 (State Management)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // 입력 폼 상태 (Form Input States)
  const [title, setTitle] = useState<string>('어느 멋진 맛집 이야기! 🍱')
  const [location, setLocation] = useState<string>('연남동')
  const [category, setCategory] = useState<string>('일식')
  const [tag, setTag] = useState<string>('분위기 최고!')
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>(IMAGE_PRESETS[0].url)
  const [customImgUrl, setCustomImgUrl] = useState<string>('')
  const [content, setContent] = useState<string>(
    `웨이팅이 정말 길었지만, 한 입 먹는 순간 기다림의 고단함이 사르르 녹아내렸어요!\n\n육즙 가득하고 바삭바삭한 식감이 입안에서 탭댄스를 추는 기분이었답니다. 🌟\n\n이곳에 방문하신다면 꼭 세트 메뉴를 주문해 보시는 것을 강력 추천해 드릴게요.\n\n#인생돈카츠 #푸디다이어리 #소소한기쁨`
  )

  // 마운트 시 인증 체크 및 임시 데이터 복원
  useEffect(() => {
    const checkAuthAndRestore = async () => {
      try {
        setAuthLoading(true)
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser || null)

        // 로컬스토리지에서 드래프트 복원
        const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft)
            if (confirm('이전에 작성 중이던 임시 저장 글이 있습니다. 불러오시겠습니까? 📔')) {
              if (draft.title) setTitle(draft.title)
              if (draft.location) setLocation(draft.location)
              if (draft.category) setCategory(draft.category)
              if (draft.tag) setTag(draft.tag)
              if (draft.selectedImgUrl) setSelectedImgUrl(draft.selectedImgUrl)
              if (draft.customImgUrl) setCustomImgUrl(draft.customImgUrl)
              if (draft.content) setContent(draft.content)
            }
          } catch (e) {
            console.error('드래프트 복원 파싱 실패:', e)
          }
        }
      } catch (err) {
        console.error('인증 체크 중 에러:', err)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuthAndRestore()
  }, [])

  const getActiveImageUrl = () => {
    return customImgUrl.trim() !== '' ? customImgUrl : selectedImgUrl
  }

  // 에디터 툴바 단축 마크다운 삽입
  const handleInsertMarkdown = (type: 'bold' | 'italic' | 'bullet' | 'quote') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)
    let insertText = ''
    let offset = 0

    switch (type) {
      case 'bold':
        insertText = `**${selected || '글자'}**`
        offset = selected ? insertText.length : 2
        break
      case 'italic':
        insertText = `*${selected || '글자'}*`
        offset = selected ? insertText.length : 1
        break
      case 'bullet':
        insertText = `\n- ${selected || '항목 내용'}`
        offset = insertText.length
        break
      case 'quote':
        insertText = `\n> ${selected || '인용구'}`
        offset = insertText.length
        break
    }

    setContent(text.substring(0, start) + insertText + text.substring(end))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + offset, start + offset)
    }, 0)
  }

  // 초안 로컬 저장
  const handleSaveDraft = () => {
    const draft = {
      title, location, category, tag, selectedImgUrl, customImgUrl, content,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft))
    alert('작성 중인 내용이 임시 저장되었습니다! 📔')
  }

  // 발행하기 핸들러
  const handlePublish = async () => {
    if (!title.trim() || !location.trim() || !category.trim()) {
      alert('맛집 이름, 위치, 카테고리는 필수로 적어주셔야 합니다!')
      return
    }

    try {
      setIsSubmitting(true)
      const finalImg = getActiveImageUrl()

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: title.trim(),
            location: location.trim(),
            category: category.trim(),
            tag: tag.trim(),
            image_url: finalImg,
            content: content.trim(),
            likes: 0,
            user_id: user ? user.id : null
          }
        ])
        .select()

      if (error) throw error

      localStorage.removeItem(LOCAL_STORAGE_KEY)
      alert('새로운 맛집 도감이 발행되었습니다! 🎉')
      if (data && data.length > 0) {
        router.push(`/post/${data[0].id}`)
      } else {
        router.push('/')
      }
    } catch (err: any) {
      console.error('발행 실패:', err)
      alert('발행 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 경량 마크다운 파서
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return ''
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#ac2a5d]">$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-on-surface-variant">$1</em>')
    html = html.replace(/^\&gt;\s(.*$)/gim, '<blockquote class="border-l-4 border-secondary/40 pl-3 my-2 text-on-surface-variant/80 bg-[#fff2e6]/50 py-1 px-2 rounded-r">$1</blockquote>')
    html = html.replace(/^\-\s(.*$)/gim, '<li class="list-disc list-inside ml-2">$1</li>')
    html = html.replace(/\n/g, '<br />')
    return html
  }

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff8f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="font-gaegu text-xl mt-4 text-on-surface-variant">다이어리를 꺼내고 있습니다...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 relative flex flex-col w-full bg-[#fff8f4]">
      
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-sm border-b-2 border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-screen-2xl mx-auto">
          <Link 
            href="/"
            className="font-gaegu text-headline-lg text-primary tracking-tight -rotate-1 hover:rotate-0 transition-transform flex items-center gap-1 cursor-pointer select-none"
          >
            {"예원's 맛집도감"}
            <span className="material-symbols-outlined text-[26px] align-middle text-secondary-container">stars</span>
          </Link>
          <div>
            <Link 
              href="/"
              className="font-gaegu text-md px-4 py-1.5 bg-[#fdebdc] rounded-md border-2 border-outline-variant/50 text-on-surface hover:-rotate-1 transition-transform scrapbook-shadow inline-block text-center font-bold"
            >
              📖 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 에디터 레이아웃 */}
      <main className="flex-grow flex flex-col md:grid md:grid-cols-[1fr_1fr] p-6 md:p-8 gap-8 max-w-screen-2xl mx-auto w-full">
        
        {/* 1. 좌측: 에디터 폼 영역 (시안 _1의 꼬불꼬불한 에디터 폼 구현) */}
        <section className="w-full flex flex-col gap-6 bg-white p-6 rounded-xl border border-outline-variant/30 scrapbook-shadow relative">
          
          {/* 장식용 종이 조각 테이프 */}
          <div className="washi-tape-yellow w-24 h-6 -top-3.5 left-12 rotate-[-2deg]"></div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="font-gaegu text-3xl font-bold text-primary flex items-center gap-1">
              맛집 기록하기 📝
            </span>
          </div>

          {/* 제목 입력 필드 (시안 _1 스타일: 제목을 입력해주세요 + 연필 아이콘) */}
          <div className="flex items-center gap-2 border-b-2 border-dashed border-outline-variant/60 pb-1">
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-grow bg-transparent font-gaegu text-2xl md:text-3xl text-on-surface placeholder-on-surface-variant/40 focus:outline-none"
              placeholder="제목을 입력해주세요"
              required
            />
            <span className="material-symbols-outlined text-on-surface-variant/70 text-[24px]">edit</span>
          </div>

          {/* 맛집 메타데이터 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-gaegu text-lg text-on-surface-variant/80 mb-1">📍 위치 (Location)</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 연남동, 성수"
                className="w-full input-squiggly py-1 px-1 font-body-md text-on-surface text-base"
                required
              />
            </div>
            <div>
              <label className="block font-gaegu text-lg text-on-surface-variant/80 mb-1">🍴 분류 (Category)</label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="예: 카페, 이탈리안"
                className="w-full input-squiggly py-1 px-1 font-body-md text-on-surface text-base"
                required
              />
            </div>
          </div>

          {/* 스티커 태그 셀렉트 */}
          <div>
            <label className="block font-gaegu text-lg text-on-surface-variant/80 mb-1">✨ 데코 스티커 태그</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-[#fdebdc]/40 py-2 px-3 rounded-lg border border-outline-variant/60 font-body-md text-sm text-on-surface focus:outline-none"
            >
              <option value="분위기 최고!">분위기 최고! ✨</option>
              <option value="치즈 폭탄!">치즈 폭탄! 🧀</option>
              <option value="인생 돈카츠!">인생 돈카츠! 🥩</option>
              <option value="꼭 가봐야 할 곳!">꼭 가봐야 할 곳! 🔥</option>
              <option value="인생 베이커리!">인생 베이커리! 🥐</option>
              <option value="최고의 라떼!">최고의 라떼! ☕</option>
            </select>
          </div>

          {/* 대표 이미지 선택 */}
          <div className="space-y-2">
            <label className="block font-gaegu text-lg text-on-surface-variant/80">📸 대표 사진 고르기</label>
            <div className="grid grid-cols-6 gap-2">
              {IMAGE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImgUrl(preset.url)
                    setCustomImgUrl('')
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImgUrl === preset.url && customImgUrl === '' 
                      ? 'border-primary scale-102 shadow-md' 
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} className="w-full h-full object-cover" alt={preset.name} />
                </button>
              ))}
            </div>
            <input 
              type="text" 
              value={customImgUrl}
              onChange={(e) => setCustomImgUrl(e.target.value)}
              placeholder="또는 직접 이미지 URL 주소를 입력하세요..."
              className="w-full input-squiggly py-1 px-1 font-body-md text-on-surface text-xs mt-1"
            />
          </div>

          {/* 마크다운 툴바 */}
          <div className="flex items-center gap-2.5 py-1.5 border-b border-outline-variant/30 text-on-surface-variant">
            <button type="button" onClick={() => handleInsertMarkdown('bold')} className="p-1 hover:text-primary transition-colors cursor-pointer" title="굵게">
              <span className="material-symbols-outlined text-[22px] font-bold">format_bold</span>
            </button>
            <button type="button" onClick={() => handleInsertMarkdown('italic')} className="p-1 hover:text-primary transition-colors cursor-pointer" title="기울임">
              <span className="material-symbols-outlined text-[22px]">format_italic</span>
            </button>
            <button type="button" onClick={() => handleInsertMarkdown('bullet')} className="p-1 hover:text-primary transition-colors cursor-pointer" title="리스트">
              <span className="material-symbols-outlined text-[22px]">format_list_bulleted</span>
            </button>
            <button type="button" onClick={() => handleInsertMarkdown('quote')} className="p-1 hover:text-primary transition-colors cursor-pointer" title="인용구">
              <span className="material-symbols-outlined text-[22px]">format_quote</span>
            </button>
          </div>

          {/* 에디터 본문 입력 영역 (손글씨 서체 적용) */}
          <div className="flex-grow flex flex-col min-h-[220px]">
            <textarea 
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-grow bg-[#fff8f4]/40 border-0 rounded-lg p-4 font-nanum text-2xl text-on-surface focus:ring-0 resize-none outline-none leading-relaxed"
              placeholder="여기에 다이어리 이야기를 마음껏 적어보세요..."
            />
          </div>

          {/* 하단 액션 버튼 (시안 _1 스타일 반영) */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dashed border-outline-variant/30">
            <button 
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-2.5 bg-white text-on-surface-variant font-gaegu text-lg rounded-xl border border-outline-variant hover:scale-102 transition-transform cursor-pointer"
            >
              임시 저장
            </button>
            <button 
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#392f25] text-white font-gaegu text-lg rounded-xl border-2 border-outline-variant hover:scale-102 hover:-rotate-1 transition-all cursor-pointer disabled:opacity-50 font-bold"
            >
              {isSubmitting ? '발행하는 중...' : '발행하기'}
            </button>
          </div>

        </section>

        {/* 2. 우측: 스크랩북 미리보기 영역 (시안 _1의 3중 폴라로이드 사진 조합 이식) */}
        <section className="w-full flex flex-col gap-5 bg-white/40 p-6 rounded-xl border-2 border-dashed border-outline-variant/50 relative overflow-hidden">
          
          <h2 className="font-gaegu text-2xl font-bold text-on-surface flex items-center gap-1.5 border-b border-dashed border-outline-variant/30 pb-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            미리보기
          </h2>

          {/* 스크랩북 실시간 렌더링 캔버스 */}
          <div className="flex-grow bg-white rounded-lg p-5 border border-outline-variant/20 scrapbook-shadow overflow-y-auto max-h-[650px] relative">
            
            {/* 3중 폴라로이드 사진 조합 (시안 _1 레이아웃 반영) */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-6">
              {/* 메인 대표 폴라로이드 (크게 배치) */}
              <div className="bg-white p-2 pb-5 border border-outline-variant/40 scrapbook-shadow relative rotate-1">
                {/* 노란색 땡땡이 테이프 */}
                <div className="washi-tape-yellow w-14 h-4.5 -top-2 left-1/2 -translate-x-1/2 rotate-3"></div>
                <img 
                  src={getActiveImageUrl()} 
                  className="w-full aspect-[4/3] object-cover rounded-sm border border-outline-variant/15" 
                  alt="Main Preview" 
                />
                <div className="text-center font-nanum text-md text-[#845400] font-bold mt-2 truncate">
                  대표 사진 📸
                </div>
              </div>

              {/* 보조 폴라로이드 2개 세로 배치 */}
              <div className="flex flex-col gap-3">
                {/* 보조 사진 1 */}
                <div className="bg-white p-1.5 pb-4 border border-outline-variant/40 scrapbook-shadow relative -rotate-3">
                  <div className="washi-tape w-8 h-3.5 -top-1.5 left-2 bg-[#ffddb6]/70 -rotate-6"></div>
                  <img 
                    src={IMAGE_PRESETS[1].url} 
                    className="w-full aspect-[4/3] object-cover rounded-sm" 
                    alt="Sub 1" 
                  />
                </div>
                {/* 보조 사진 2 */}
                <div className="bg-white p-1.5 pb-4 border border-outline-variant/40 scrapbook-shadow relative rotate-2">
                  <div className="washi-tape w-8 h-3.5 -top-1.5 right-2 bg-[#ffd9e1]/70 rotate-6"></div>
                  <img 
                    src={IMAGE_PRESETS[3].url} 
                    className="w-full aspect-[4/3] object-cover rounded-sm" 
                    alt="Sub 2" 
                  />
                </div>
              </div>
            </div>

            {/* 타이틀 및 밑줄 */}
            <div className="relative mb-4 inline-block mt-2">
              <h3 className="font-gaegu text-3xl font-bold text-on-surface leading-tight">
                {title || '제목을 지어주세요'}
              </h3>
              <svg className="absolute bottom-[-6px] left-0 w-full h-2.5 text-secondary-container" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 0" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"></path>
              </svg>
            </div>

            {/* 위치 / 분류 뱃지 */}
            <div className="flex gap-2 mb-4 font-nanum text-lg text-[#845400]">
              <span className="bg-[#ffddb6]/30 px-2 py-0.5 rounded border border-[#ffb95a]/60">
                📍 {location || '연남동'}
              </span>
              <span className="bg-[#ffd9e1]/30 px-2 py-0.5 rounded border border-[#ffb1c5]/60">
                🍽️ {category || '카테고리'}
              </span>
              {tag && (
                <span className="bg-[#eee3ad]/30 px-2 py-0.5 rounded border border-[#d1c794]/60">
                  ✨ {tag}
                </span>
              )}
            </div>

            {/* 본문 렌더링 */}
            <div 
              className="font-nanum text-2xl text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap pt-2 border-t border-dashed border-outline-variant/30"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />

          </div>

        </section>

      </main>

    </div>
  )
}
