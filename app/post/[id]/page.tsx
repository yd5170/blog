/**
 * @file app/post/[id]/page.tsx
 * @description 예원's 맛집도감의 글 상세 보기 페이지 컴포넌트입니다.
 * 제공된 상세 페이지 시안(s_2/screen.png)의 Atelier Epicure 테마를 완벽히 이식했습니다.
 * 상단 메인 배너와 타이틀 해시태그 오버레이, 좌측의 수직 좋아요/공유 액션 바, 
 * 우측의 폴라로이드 서브 사진 조합 및 댓글 영역, 그리고 하단의 감성 푸터 박스들을 구현했습니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface Post {
  id: string
  title: string
  location: string
  category: string
  image_url: string
  likes: number
  tag: string
  created_at: string
  user_id?: string | null
  content?: string
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  created_at: string
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const postId = params?.id as string

  // 상태 관리 (State Management)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const [liked, setLiked] = useState<boolean>(false)
  const [likesCount, setLikesCount] = useState<number>(0)
  
  // 시안 s_2에 어울리는 감성 댓글 데이터 초기화 (Comments Initialization)
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'comment-1',
      author: '유니',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      content: '진짜 여기 미쳤죠... 👍 너무 먹고 싶네요.',
      created_at: '04.28'
    },
    {
      id: 'comment-2',
      author: '막데비',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      content: '저도 다녀왔는데 인정해요! 소스가 진짜 예술.',
      created_at: '04.28'
    },
    {
      id: 'comment-3',
      author: '맛집알',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      content: '다음엔 저도 꼭 가봐야겠어요. 스크랩 완료!',
      created_at: '04.29'
    }
  ])
  const [newComment, setNewComment] = useState<string>('')
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false)

  // 컴포넌트 마운트 시 세션 로드 및 데이터 패치
  useEffect(() => {
    if (!postId) return

    const checkSession = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }

    checkSession()
    fetchPostDetail()
  }, [postId])

  // Supabase 글 상세 데이터 로드
  const fetchPostDetail = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        console.error('글 상세 로드 에러:', error.message)
      } else if (data) {
        setPost(data as Post)
        setLikesCount(data.likes || 0)
      }
    } catch (err) {
      console.error('글 상세 로드 에러:', err)
    } finally {
      setLoading(false)
    }
  }

  // 좋아요 처리 (Like Action)
  const handleLike = async () => {
    if (!post || liked) return

    setLiked(true)
    setLikesCount(prev => prev + 1)

    const { error } = await supabase
      .from('posts')
      .update({ likes: likesCount + 1 })
      .eq('id', post.id)

    if (error) {
      console.error('좋아요 업데이트 실패:', error.message)
      setLiked(false)
      setLikesCount(post.likes)
    }
  }

  // 공유하기 (Share Action)
  const handleShare = async () => {
    if (!post) return
    const shareUrl = window.location.href
    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('상세 페이지 주소가 복사되었습니다! 🔗')
    } catch (err) {
      console.error('클립보드 복사 실패:', err)
    }
  }

  // 댓글 등록 처리 (Add Comment)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)
    const authorName = user ? user.email?.split('@')[0] || '탐험가' : '익명푸디'
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      author: authorName,
      avatar: user?.email ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      content: newComment.trim(),
      created_at: '방금'
    }

    setTimeout(() => {
      setComments(prev => [...prev, newCommentObj])
      setNewComment('')
      setIsSubmittingComment(false)
    }, 300)
  }

  // 기본 대체 본문 생성기 (Fallback Content)
  const getFallbackContent = (p: Post) => {
    return `현지인들에게도 인기 많은 곳이라 웨이팅은 필수지만\n그만큼 만족도 100% 였던 곳! 🥵\n\n바삭한 돈까스와 정갈한 정찬 구성, 분위기까지 완벽 💛\n미야자키 가면 꼭 가봐야 한다는 이곳, 정말 대단해요.\n\n바삭하고 고소한 튀김옷 속에 부드럽고 촉촉한 육즙이 꽉 찬 고기가 정말 대단했습니다. 스크랩북에 무조건 저장해 두세요!`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff8f4]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="font-gaegu text-xl mt-4 text-on-surface-variant">다이어리를 꺼내 펼치는 중...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff8f4] text-center p-6">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">menu_book</span>
        <h2 className="font-gaegu text-3xl font-bold text-primary mb-2">아직 빈 페이지입니다</h2>
        <Link href="/" className="font-gaegu text-lg px-6 py-2 bg-primary text-white rounded-lg border-2 border-outline-variant scrapbook-shadow">
          첫 화면으로 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 relative flex flex-col w-full bg-[#fff8f4] select-none">
      
      {/* 1. Atelier Epicure 브랜딩 헤더 (Header Customization) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-6">
            <Link 
              href="/"
              className="font-gaegu text-2xl lg:text-3xl text-primary font-bold tracking-tight hover:-rotate-1 transition-all"
            >
              Atelier Epicure
            </Link>
            <nav className="hidden md:flex items-center space-x-6 font-gaegu text-lg text-on-surface-variant/80">
              <Link href="/" className="hover:text-primary transition-colors">Journal</Link>
              <button onClick={() => router.push('/')} className="hover:text-primary transition-colors flex items-center gap-0.5 bg-[#ac2a5d] text-white px-2.5 py-0.5 rounded-full text-sm">
                curation <span className="text-xs">✨</span>
              </button>
              <Link href="/" className="hover:text-primary transition-colors">Locales</Link>
              <Link href="/" className="hover:text-primary transition-colors">Atmosphere</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px] cursor-pointer hover:text-primary transition-colors">search</span>
            {user ? (
              <span className="hidden lg:inline font-nanum text-lg text-on-surface-variant">📔 {user.email?.split('@')[0]}님</span>
            ) : (
              <>
                <Link href="/login" className="font-gaegu text-md text-on-surface-variant hover:text-primary font-bold">Login</Link>
                <Link href="/login?mode=signup" className="font-gaegu text-md bg-[#feb246] hover:bg-[#feb246]/90 text-white px-4 py-1 rounded-md border-2 border-outline-variant/50 font-bold scrapbook-shadow">Sign Up!</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. 메인 글 상세 영역 (Grid Layout) */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-grow">
        
        {/* 뒤로 가기 */}
        <Link href="/" className="inline-flex items-center gap-1 font-gaegu text-lg text-on-surface-variant hover:-translate-x-0.5 transition-transform mb-6">
          <span className="material-symbols-outlined text-[20px] align-middle">arrow_back</span>
          목록으로 돌아가기
        </Link>

        {/* 상단 메인 히어로 배너 (Main Banner Area) */}
        <section className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden scrapbook-shadow border border-outline-variant/30 mb-8">
          <img 
            src={post.image_url} 
            className="w-full h-full object-cover" 
            alt={post.title} 
          />
          {/* 배너 정중앙 해시태그 스티커 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
            <div className="bg-white/95 px-6 py-2.5 rounded-full border-2 border-[#392f25]/80 scrapbook-shadow rotate-1 flex flex-col items-center">
              <span className="font-gaegu text-2xl lg:text-3xl text-[#392f25] font-bold">
                #{post.title}
              </span>
              <span className="font-nanum text-lg text-primary mt-0.5">#{post.location} {post.category}</span>
            </div>
          </div>
          {/* 노란색 별 장식 스티커 */}
          <div className="absolute top-4 right-4 text-[#feb246] rotate-12 scale-120 drop-shadow-md">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
        </section>

        {/* 3. 본문 3열 레이아웃: 좌측 액션 바 + 중앙 본문 + 우측 사이드 폴라로이드 */}
        <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_320px] gap-8 items-start mt-8">
          
          {/* [좌측]: 수직 고정 스티키 액션 바 (Social Sticky Bar) */}
          <div className="sticky top-24 hidden lg:flex flex-col items-center gap-4 bg-white p-3 rounded-full border border-outline-variant/30 scrapbook-shadow">
            <button 
              onClick={handleLike}
              disabled={liked}
              className="flex flex-col items-center gap-1 text-primary hover:scale-105 active:scale-95 transition-transform"
            >
              <span 
                className="material-symbols-outlined text-[28px] p-2 bg-[#ffd9e1]/30 hover:bg-[#ffd9e1]/60 rounded-full border border-outline-variant/20"
                style={{ fontVariationSettings: `'FILL' ${liked ? 1 : 0}` }}
              >
                favorite
              </span>
              <span className="font-gaegu text-sm font-bold">{likesCount}</span>
            </button>

            <button 
              onClick={() => alert('나의 북마크 저장소에 보관되었습니다!')}
              className="text-on-surface-variant hover:scale-105 transition-transform"
              title="저장"
            >
              <span className="material-symbols-outlined text-[24px] p-2 bg-surface-container rounded-full border border-outline-variant/15">bookmark</span>
            </button>

            <button 
              onClick={handleShare}
              className="text-on-surface-variant hover:scale-105 transition-transform"
              title="공유"
            >
              <span className="material-symbols-outlined text-[24px] p-2 bg-surface-container rounded-full border border-outline-variant/15">share</span>
            </button>
          </div>

          {/* [중앙]: 맛집 일기 정보 및 본문 영역 */}
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-xl border border-outline-variant/30 scrapbook-shadow relative">
            <div className="washi-tape-yellow w-20 h-6 -top-3 left-10 rotate-[-1deg]"></div>
            
            {/* 타이틀 정보 */}
            <div className="space-y-3 pb-4 border-b border-dashed border-outline-variant/30">
              <h1 className="font-gaegu text-3xl md:text-4xl text-on-surface font-bold leading-tight">
                {post.title} 다녀왔어요 💖
              </h1>

              {/* 작성자 정보 */}
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-9 h-9 rounded-full bg-[#fdebdc] flex items-center justify-center text-lg shadow-inner">
                  👤
                </div>
                <div className="font-gaegu text-base text-on-surface-variant/80">
                  <span className="font-bold text-on-surface">맛집탐험가</span> · 2026.06.03 · 📍 {post.location}
                </div>
              </div>

              {/* 카테고리 해시태그 목록 */}
              <div className="flex flex-wrap gap-2 pt-1.5">
                {[`#${post.location}맛집`, `#${post.category}맛집`, '#돈카츠맛집', '#일본여행', '#혼밥행'].map((hash) => (
                  <span 
                    key={hash}
                    className="font-gaegu text-md px-3.5 py-0.5 rounded-full bg-[#ffddb6]/30 border border-[#ffb95a]/50 text-secondary"
                  >
                    {hash}
                  </span>
                ))}
              </div>
            </div>

            {/* 본문 텍스트 영역 */}
            <div className="font-body-lg text-lg text-on-surface leading-relaxed whitespace-pre-wrap pt-2">
              {post.content ? post.content : getFallbackContent(post)}
            </div>

            {/* 모바일 화면용 액션 버튼 그룹 */}
            <div className="flex lg:hidden items-center justify-between pt-6 border-t border-dashed border-outline-variant/30">
              <button 
                onClick={handleLike}
                disabled={liked}
                className="flex items-center gap-1 bg-[#ffd9e1]/20 px-4 py-1.5 rounded-full border border-primary/20 text-[#ac2a5d] font-gaegu text-lg font-bold"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${liked ? 1 : 0}` }}>favorite</span>
                <span>공감 {likesCount}</span>
              </button>
              <div className="flex gap-2">
                <button onClick={handleShare} className="p-2 bg-surface-container rounded-full border border-outline-variant/30 hover:scale-105"><span className="material-symbols-outlined text-[20px]">share</span></button>
                <button onClick={() => alert('북마크 완료!')} className="p-2 bg-surface-container rounded-full border border-outline-variant/30 hover:scale-105"><span className="material-symbols-outlined text-[20px]">bookmark</span></button>
              </div>
            </div>
          </div>

          {/* [우측]: 폴라로이드 서브 사진 데코 & 댓글 섹션 (Sidebar Collage & Comments) */}
          <div className="space-y-8">
            
            {/* 폴라로이드 조합 카드 */}
            <div className="space-y-4">
              <div className="bg-white p-3 pb-6 border border-outline-variant/40 scrapbook-shadow rotate-[-2deg] hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=400&q=80" 
                  className="w-full aspect-[4/3] object-cover rounded-sm" 
                  alt="Side 1" 
                />
                <div className="text-center font-nanum text-lg text-primary mt-2 font-bold">안심 + 등심 ✨</div>
              </div>

              <div className="bg-white p-3 pb-6 border border-outline-variant/40 scrapbook-shadow rotate-[2deg] hover:rotate-0 transition-transform">
                <div className="washi-tape w-12 h-4.5 -top-2 left-4 bg-yellow-100/60 rotate-[-12deg]"></div>
                <img 
                  src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80" 
                  className="w-full aspect-[4/3] object-cover rounded-sm" 
                  alt="Side 2" 
                />
                <div className="text-center font-nanum text-lg text-secondary mt-2 font-bold">정찬 구성 ❤️</div>
              </div>
            </div>

            {/* 댓글창 박스 (Comments Box - s_2/screen.png 스타일 이식) */}
            <div className="bg-white rounded-xl border border-outline-variant/30 scrapbook-shadow p-5 space-y-4">
              <h3 className="font-gaegu text-xl font-bold text-on-surface border-b border-dashed border-outline-variant/20 pb-2">
                댓글 {comments.length}
              </h3>

              {/* 댓글 리스트 */}
              <div className="space-y-3.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    <img src={comment.avatar} className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" alt="" />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center leading-none">
                        <span className="font-gaegu text-[15px] font-bold text-on-surface">{comment.author}</span>
                        <span className="text-[10px] text-on-surface-variant/50 font-body-md">{comment.created_at}</span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-normal">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 댓글 입력창 */}
              <form onSubmit={handleAddComment} className="flex items-center bg-[#fdebdc]/20 border border-outline-variant/40 rounded-lg p-1.5 focus-within:bg-[#fdebdc]/45 transition-all">
                <input 
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력해주세요..."
                  className="flex-grow bg-transparent border-none text-xs font-body-md outline-none px-2 py-1 text-on-surface"
                />
                <button 
                  type="submit"
                  disabled={isSubmittingComment}
                  className="bg-[#392f25] text-white p-1.5 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>

      {/* 4. Atelier Epicure 커스텀 푸터 (Aesthetic Footer - s_2/screen.png) */}
      <footer className="bg-surface-container py-12 mt-16 border-t-2 border-dashed border-outline-variant/60">
        <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-start">
          
          {/* 소개 박스 */}
          <div className="bg-white p-5 rounded-xl border border-outline-variant/30 scrapbook-shadow -rotate-1">
            <h4 className="font-gaegu text-xl font-bold text-primary mb-2">Atelier Epicure</h4>
            <p className="font-nanum text-lg text-on-surface-variant/80 leading-normal">
              A Study in Taste. Documenting the intersection of culinary arts, design, and atmosphere. ✨
            </p>
          </div>

          {/* Legal Stuff */}
          <div className="bg-white p-5 rounded-xl border border-outline-variant/30 scrapbook-shadow rotate-1">
            <h4 className="font-gaegu text-xl font-bold text-secondary mb-2.5">Legal Stuff 📝</h4>
            <ul className="space-y-1 font-gaegu text-base text-on-surface-variant/80">
              <li className="hover:underline cursor-pointer">Editorial Policy</li>
              <li className="hover:underline cursor-pointer">Privacy Policy</li>
              <li className="hover:underline cursor-pointer">Terms of Service</li>
            </ul>
          </div>

          {/* Connect 💌 */}
          <div className="bg-white p-5 rounded-xl border border-outline-variant/30 scrapbook-shadow -rotate-1">
            <h4 className="font-gaegu text-xl font-bold text-primary mb-2.5">Connect 💌</h4>
            <ul className="space-y-1 font-gaegu text-base text-on-surface-variant/80">
              <li className="hover:underline cursor-pointer">Contact Us!</li>
              <li className="hover:underline cursor-pointer">Archive Explorer</li>
              <li className="hover:underline cursor-pointer">Get the Newsletter</li>
            </ul>
          </div>

        </div>

        {/* 저작권 */}
        <div className="text-center mt-10 pt-6 border-t border-dashed border-outline-variant/20">
          <p className="font-nanum text-lg text-on-surface-variant">
            © 2026 Atelier Epicure. A Study in Taste. ✌️
          </p>
        </div>
      </footer>

    </div>
  )
}
