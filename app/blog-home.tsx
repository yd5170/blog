/**
 * @file app/blog-home.tsx
 * @description 클라이언트 사이드에서 작동하는 예원's 맛집도감 메인 홈 화면 컴포넌트입니다.
 * Supabase 클라이언트 SDK를 활용하여 실시간 검색, 태그 필터링, 좋아요 수 증가 기능을 처리하며,
 * 제공된 2D/3D 스크랩북 디자인 시안(_2/screen.png)을 완벽히 이식했습니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
}

interface BlogHomeProps {
  initialUser: User | null
}

// 식당 대표 이미지 선택용 프리셋 리스트 (Unsplash 무료 고화질 이미지)
const IMAGE_PRESETS = [
  { name: '브런치 & 아보카도 토스트', url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&auto=format&fit=crop&q=80' },
  { name: '감성 바질 파스타', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80' },
  { name: '바삭한 일식 돈카츠', url: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=600&auto=format&fit=crop&q=80' },
  { name: '시원한 카페 라떼', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80' },
  { name: '화덕 치즈 피자', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
  { name: '신선한 모듬 초밥', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80' }
]

export default function BlogHome({ initialUser }: BlogHomeProps) {
  const supabase = createClient()
  const router = useRouter()

  // 상태 관리 (State Management)
  const [user, setUser] = useState<User | null>(initialUser)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTag, setActiveTag] = useState<string>('전체')
  
  // 사용자가 좋아요를 누른 글들을 기억하기 위한 로컬 상태 (중복 방지용)
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set())

  // 컴포넌트 마운트 시 포스트 목록 가져오기 (Fetch posts on mount)
  useEffect(() => {
    fetchPosts()

    // 실시간 세션(Auth Session) 변경 모니터링
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Supabase 데이터베이스로부터 블로그 글 리스트 읽기
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('데이터 조회 오류:', error.message)
      } else {
        setPosts(data || [])
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃 핸들러 (Sign Out Handler)
  const handleSignOut = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await supabase.auth.signOut()
      setUser(null)
      router.refresh()
    }
  }

  // 좋아요 수 증가 핸들러 (Optimistic Update)
  const handleLike = async (postId: string, currentLikes: number) => {
    if (likedPostIds.has(postId)) {
      return
    }

    // 1. 화면에 즉시 증가된 숫자를 렌더링 (Optimistic Update)
    setLikedPostIds(prev => {
      const next = new Set(prev)
      next.add(postId)
      return next
    })
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))

    // 2. Supabase 데이터베이스 업데이트 API 호출
    const { error } = await supabase
      .from('posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', postId)

    if (error) {
      console.error('좋아요 업데이트 실패:', error.message)
      // 실패 시 롤백 (Rollback on failure)
      setLikedPostIds(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes } : p))
    }
  }

  // 검색어 및 활성화된 해시태그에 맞게 포스트 필터링 (Filtering Logic)
  const filteredPosts = posts.filter(post => {
    // 1. 검색어 필터링
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tag && post.tag.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false

    // 2. 사이드바 태그 필터링
    if (activeTag === '전체') return true
    if (activeTag === '데이트') return post.tag === '분위기 최고!' || post.tag === '꼭 가봐야 할 곳!' || post.category.includes('데이트')
    if (activeTag === '브런치') return post.category.includes('카페') || post.category.includes('브런치') || post.category.includes('베이커리')
    if (activeTag === '혼밥') return post.tag?.includes('혼밥') || post.location.includes('혼자') || post.category.includes('일식') || post.category.includes('분식')
    if (activeTag === '숨은맛집') return post.tag === '인생 돈카츠!' || post.tag === '치즈 폭탄!' || post.title.includes('숨은')
    if (activeTag === '에디터픽') return post.likes >= 10 || post.title.includes('오월') || post.title.includes('바질')

    return true
  })

  // 이번 주 인기 맛집 (좋아요 높은 상위 4개)
  const popularPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4)

  // 최근 업데이트 맛집 (최신 등록 4개)
  const recentPosts = posts.slice(0, 4)

  // 각 포스트 카드의 인덱스에 따라 약간의 회전 각도를 계산하여 스크랩북 감성 제공
  const getCardRotation = (index: number) => {
    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
    return rotations[index % rotations.length]
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 relative flex flex-col w-full bg-[#fff8f4]">
      {/* 1. 상단 내비게이션 바 (TopNavBar) */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b-2 border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-screen-2xl mx-auto">
          {/* 로고 브랜드 영역 (Logo Brand Area) */}
          <Link 
            href="/"
            onClick={() => { setSearchTerm(''); setActiveTag('전체'); }}
            className="font-gaegu text-headline-lg text-primary tracking-tight -rotate-1 hover:rotate-0 transition-transform flex items-center gap-1 cursor-pointer select-none"
          >
            {"예원's 맛집도감"}
            <span className="material-symbols-outlined text-[26px] align-middle text-secondary-container">stars</span>
          </Link>

          {/* 중앙 검색창 (시안 _2 반영 - Search Bar) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <input 
              className="w-full bg-[#fdebdc]/50 rounded-full py-2 pl-4 pr-10 border-2 border-outline-variant/60 focus:border-primary focus:bg-white focus:ring-0 font-body-md text-base outline-none transition-all" 
              placeholder="맛집, 지역, 메뉴를 검색해보세요 :)" 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-2.5 text-on-surface-variant text-[22px]">search</span>
          </div>

          {/* 우측 로그인/회원가입/로그아웃 제어 단추 */}
          <div className="flex items-center space-x-3">
            {/* 로그인 여부와 무관하게 언제나 글쓰기가 가능하도록 글작성 버튼 항상 노출 */}
            <Link 
              href="/post/create"
              className="font-gaegu text-md px-4 py-1.5 bg-[#feb246] hover:bg-[#feb246]/90 text-white rounded-md border-2 border-outline-variant/70 hover:-rotate-1 transition-transform scrapbook-shadow text-center font-bold"
            >
              글작성
            </Link>

            {user ? (
              <>
                <span className="hidden lg:inline-block font-nanum text-label-accent text-lg text-on-surface-variant max-w-[150px] truncate mr-2">
                  📔 {user.email?.split('@')[0]}님
                </span>
                <button 
                  onClick={handleSignOut}
                  className="font-gaegu text-md px-4 py-1.5 bg-surface-container rounded-md border-2 border-outline-variant/60 text-on-surface hover:rotate-1 transition-transform scrapbook-shadow cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login?mode=login" 
                  className="font-gaegu text-md px-4 py-1.5 bg-surface-container rounded-md border-2 border-outline-variant/60 text-on-surface hover:-rotate-1 transition-transform scrapbook-shadow text-center font-bold"
                >
                  로그인
                </Link>
                <Link 
                  href="/login?mode=signup" 
                  className="font-gaegu text-md px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-md border-2 border-outline-variant/60 hover:rotate-1 transition-transform scrapbook-shadow text-center font-bold"
                >
                  회원가입
                </Link>
              </>
            )}
            
            {/* 햄버거 메뉴 아이콘 */}
            <button className="p-1 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-[28px] align-middle">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 2열 그리드 레이아웃 (시안 _2 레이아웃 이식) */}
      <div className="max-w-screen-2xl w-full mx-auto px-6 py-6 flex-grow grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        
        {/* 좌측 사이드바 (Sidebar Menu) */}
        <aside className="hidden md:block">
          <div className="sticky top-20 bg-white p-4 rounded-xl border border-outline-variant/40 scrapbook-shadow flex flex-col space-y-2">
            {[
              { label: '전체', icon: 'grid_view' },
              { label: '데이트', icon: 'favorite' },
              { label: '브런치', icon: 'local_cafe' },
              { label: '혼밥', icon: 'restaurant' },
              { label: '숨은맛집', icon: 'explore' },
              { label: '에디터픽', icon: 'stars' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTag(item.label)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg border-2 text-left font-gaegu text-lg transition-all cursor-pointer ${
                  activeTag === item.label
                    ? 'bg-[#ff6b9d] text-white border-primary-container font-bold -translate-y-0.5 scale-102 scrapbook-shadow'
                    : 'bg-transparent border-transparent text-on-surface hover:bg-surface-container-low hover:border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* 우측 메인 컨텐츠 영역 (Main Content Area) */}
        <main className="w-full space-y-10">
          
          {/* 상단 감성 타이틀 배너 (Top Aesthetic Banner) */}
          <section className="bg-[#fff2e6]/70 rounded-2xl p-6 md:p-8 border border-outline-variant/30 scrapbook-shadow relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            {/* 스크랩북 점선 패턴 데코 */}
            <div className="absolute inset-0 pointer-events-none opacity-20 border-2 border-dashed border-[#8a7176] rounded-2xl m-2"></div>
            
            <div className="space-y-3 z-10 text-center md:text-left">
              {/* 별 스티커 낙서 */}
              <div className="inline-block bg-[#eee3ad] text-secondary font-nanum text-xl px-2 py-0.5 rounded-sm border border-outline/10 -rotate-2 mb-1">
                ⭐ 에디터의 추천
              </div>
              <h1 className="font-gaegu text-4xl lg:text-5xl text-on-surface font-bold leading-tight">
                친구가 추천해주는 <br/>
                <span className="text-[#ac2a5d] underline decoration-wavy decoration-[#feb246]">찐 맛집 아카이브</span>
              </h1>
              <p className="font-nanum text-2xl text-on-surface-variant/80 mt-2">
                오늘 뭐 먹지? 여기서 찾자! 😊
              </p>
            </div>

            {/* 우측 폴라로이드 2장 겹침 장식 */}
            <div className="relative w-[280px] h-[160px] hidden sm:block z-10">
              {/* 첫 번째 폴라로이드 사진 */}
              <div className="absolute top-2 left-2 w-[140px] bg-white p-1.5 pb-5 border border-outline-variant/40 scrapbook-shadow -rotate-6 transform hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=300&auto=format&fit=crop&q=80" 
                  className="w-full h-[90px] object-cover rounded-sm"
                  alt="Brunch preset"
                />
                <div className="text-center font-nanum text-xs text-on-surface-variant mt-1.5">바삭 브런치 🥯</div>
              </div>
              {/* 두 번째 폴라로이드 사진 (위에 포개짐) */}
              <div className="absolute top-1 right-2 w-[140px] bg-white p-1.5 pb-5 border border-outline-variant/40 scrapbook-shadow rotate-6 transform hover:rotate-0 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=80" 
                  className="w-full h-[90px] object-cover rounded-sm"
                  alt="Pasta preset"
                />
                <div className="text-center font-nanum text-xs text-on-surface-variant mt-1.5">감성 파스타 🍝</div>
                {/* 노란색 땡땡이 테이프 */}
                <div className="washi-tape-yellow w-10 h-3.5 -top-2 left-1/2 -translate-x-1/2 -rotate-3"></div>
              </div>
            </div>
          </section>

          {/* 모바일 카테고리 슬라이드 칩 (Mobile Only Category) */}
          <section className="block md:hidden overflow-x-auto whitespace-nowrap pb-2 flex gap-3">
            {['전체', '데이트', '브런치', '혼밥', '숨은맛집', '에디터픽'].map((tag) => (
              <span 
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`inline-block font-gaegu text-md px-4 py-1.5 rounded-full border scrapbook-shadow cursor-pointer transition-all ${
                  activeTag === tag 
                    ? 'bg-[#ff6b9d] border-[#ac2a5d] text-white font-bold scale-105' 
                    : 'bg-white border-outline-variant/50 text-on-surface-variant'
                }`}
              >
                {tag}
              </span>
            ))}
          </section>

          {/* 이번 주 인기 맛집 🔥 (인기 맛집 폴라로이드 카드 섹션) */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="font-gaegu text-3xl font-bold text-on-surface flex items-center gap-1.5">
                ⭐ 이번 주 인기 맛집 🔥
              </h2>
              <span className="font-nanum text-xl text-on-surface-variant cursor-pointer hover:underline">더보기 &gt;</span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
              </div>
            ) : popularPosts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-outline-variant/50 p-10 text-center rounded-xl font-gaegu text-xl">
                아직 인기 맛집 데이터가 비어 있습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularPosts.map((post, idx) => (
                  <Link key={post.id} href={`/post/${post.id}`} className="block">
                    <article className={`bg-white p-3 pb-6 border border-outline-variant/30 scrapbook-shadow tilt-card relative ${getCardRotation(idx)}`}>
                      {/* 노란색 땡땡이 마스킹 테이프 데코 */}
                      <div className="washi-tape-yellow w-14 h-4.5 -top-2.5 left-1/2 -translate-x-1/2 rotate-2"></div>
                      
                      {/* 이미지 영역 */}
                      <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-surface-variant mb-3">
                        <img 
                          src={post.image_url} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                          alt={post.title} 
                        />
                        {/* 이미지 오버레이 스티커 */}
                        <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-sm border border-outline/20 font-nanum text-label-accent text-sm text-primary rotate-3">
                          {post.tag || '감성 가득! ✨'}
                        </div>
                      </div>

                      {/* 맛집 정보 */}
                      <div className="space-y-1.5 pt-1">
                        <h3 className="font-gaegu text-xl font-bold text-on-surface truncate leading-tight">{post.title}</h3>
                        <p className="font-body-md text-xs text-on-surface-variant/80">
                          📍 {post.location.split(' ')[0]} · <span className="text-[#845400] font-semibold">{post.category}</span>
                        </p>
                        
                        <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-outline-variant/30">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLike(post.id, post.likes);
                            }}
                            disabled={likedPostIds.has(post.id)}
                            className="flex items-center space-x-1 text-[#ac2a5d] active:scale-90 transition-transform"
                          >
                            <span 
                              className="material-symbols-outlined text-[20px]" 
                              style={{ fontVariationSettings: `'FILL' ${likedPostIds.has(post.id) ? 1 : 0}` }}
                            >
                              favorite
                            </span>
                            <span className="font-gaegu text-sm font-bold">{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* 카테고리로 찾기 (퀵 썸네일 카테고리 칩) */}
          <section className="space-y-4">
            <h2 className="font-gaegu text-3xl font-bold text-on-surface">
              ⭐ 카테고리로 찾기
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { name: '데이트 맛집', tag: '데이트', emoji: '💖', bg: 'bg-[#ffd9e1]/40 border-[#ffb1c5]' },
                { name: '브런치 맛집', tag: '브런치', emoji: '🥗', bg: 'bg-[#eee3ad]/40 border-[#d1c794]' },
                { name: '혼밥 맛집', tag: '혼밥', emoji: '🍜', bg: 'bg-[#ffddb6]/40 border-[#ffb95a]' },
                { name: '숨은 로컬 맛집', tag: '숨은맛집', emoji: '🔍', bg: 'bg-[#f1dfd1]/40 border-[#ddbfc5]' },
                { name: '에디터 추천 픽', tag: '에디터픽', emoji: '⭐', bg: 'bg-white border-outline-variant/60' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTag(item.tag)}
                  className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-xl font-gaegu text-lg transition-transform hover:scale-102 scrapbook-shadow cursor-pointer ${item.bg}`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-bold text-on-surface">{item.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 최근 업데이트 (필터링된 모든 포스트 리스트) */}
          <section className="space-y-4 pb-12">
            <h2 className="font-gaegu text-3xl font-bold text-on-surface">
              ⭐ {activeTag === '전체' ? '최근 업데이트' : `${activeTag} 맛집 일기`}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-outline-variant p-12 text-center rounded-xl scrapbook-shadow">
                <span className="material-symbols-outlined text-6xl text-outline-variant/70">import_contacts</span>
                <p className="font-gaegu text-2xl mt-4 text-on-surface-variant">아직 비어있는 다이어리 페이지입니다.</p>
                <p className="font-nanum text-xl text-on-surface-variant/60 mt-1">로그인 후 첫 맛집 추억을 채워보세요!</p>
                {user ? (
                  <Link 
                    href="/post/create"
                    className="mt-6 inline-block font-gaegu text-lg px-6 py-2 bg-primary text-white rounded-lg border-2 border-outline-variant/60 scrapbook-shadow hover:scale-105 transition-transform"
                  >
                    첫 맛집 일기 작성하기 📔
                  </Link>
                ) : (
                  <Link 
                    href="/login"
                    className="mt-6 inline-block font-gaegu text-lg px-6 py-2 bg-[#845400] text-white rounded-lg border-2 border-outline-variant/60 scrapbook-shadow hover:scale-105 transition-transform"
                  >
                    로그인하고 첫 글 쓰기 🔑
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPosts.map((post, index) => (
                  <Link key={post.id} href={`/post/${post.id}`} className="block">
                    <article className={`bg-white p-3.5 pb-6 rounded-sm border border-outline-variant/30 scrapbook-shadow relative tilt-card ${getCardRotation(index)}`}>
                      {/* 노란 땡땡이 테이프 장식 */}
                      <div className="washi-tape-yellow w-14 h-4.5 -top-2 left-1/2 -translate-x-1/2 rotate-1"></div>

                      {/* 이미지 */}
                      <div className="relative aspect-square overflow-hidden bg-surface-variant rounded-sm mb-3">
                        <img 
                          src={post.image_url} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                          alt={post.title} 
                        />
                        {post.tag && (
                          <div className="absolute top-2 right-2 bg-white/95 px-2 py-0.5 rounded-sm border border-outline/25 font-nanum text-label-accent text-sm text-primary rotate-3">
                            {post.tag}
                          </div>
                        )}
                      </div>

                      {/* 맛집 정보 */}
                      <div className="space-y-1">
                        <h3 className="font-gaegu text-xl font-bold text-on-surface truncate leading-tight">{post.title}</h3>
                        <p className="font-body-md text-xs text-on-surface-variant/80">
                          📍 {post.location} · <span className="font-semibold text-secondary">{post.category}</span>
                        </p>
                        
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-outline-variant/20">
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleLike(post.id, post.likes)
                            }}
                            disabled={likedPostIds.has(post.id)}
                            className="flex items-center space-x-1 text-[#ac2a5d]"
                          >
                            <span 
                              className="material-symbols-outlined text-[20px]" 
                              style={{ fontVariationSettings: `'FILL' ${likedPostIds.has(post.id) ? 1 : 0}` }}
                            >
                              favorite
                            </span>
                            <span className="font-gaegu text-sm font-bold">{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}

                {/* 언제나 새 맛집 추가 카드 노출 */}
                <Link 
                  href="/post/create"
                  className="bg-[#fff1e7]/40 border-2 border-dashed border-outline-variant/60 p-6 rounded-sm text-center flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer scrapbook-shadow rotate-1 aspect-square relative block"
                >
                  <div className="washi-tape-yellow w-14 h-4.5 -top-2 left-1/2 -translate-x-1/2 rotate-2"></div>
                  <span className="material-symbols-outlined text-4xl text-[#ac2a5d] mb-2">add_circle</span>
                  <span className="font-gaegu text-xl font-bold text-on-surface-variant">새로운 맛집 추가</span>
                  <span className="font-nanum text-lg text-on-surface-variant/70 mt-1">다이어리에 새 추억 스크랩</span>
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* 3. 모바일 전용 하단 내비게이션 바 (Mobile BottomNavBar) */}
      <nav className="md:hidden bg-white/95 fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2.5 border-t border-outline-variant/20 z-50 shadow-lg">
        <a 
          className={`flex flex-col items-center justify-center transition-transform ${activeTag === '전체' ? 'text-primary rotate-3 scale-105' : 'text-on-surface-variant opacity-60'}`}
          onClick={() => { setActiveTag('전체'); setSearchTerm(''); }}
        >
          <span className="material-symbols-outlined text-[24px]">grid_view</span>
          <span className="font-gaegu text-sm">둘러보기</span>
        </a>
        <Link 
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-60 text-center"
          href={user ? "/post/create" : "/login"}
        >
          <span className="material-symbols-outlined text-[30px] text-secondary-container">add_circle</span>
          <span className="font-gaegu text-sm">글추가</span>
        </Link>
        <a 
          className="flex flex-col items-center justify-center text-on-surface-variant opacity-60"
          href={user ? '#' : '/login'}
          onClick={(e) => {
            if (user) {
              e.preventDefault();
              handleSignOut();
            }
          }}
        >
          <span className="material-symbols-outlined text-[24px]">{user ? 'check_circle' : 'person'}</span>
          <span className="font-gaegu text-sm">{user ? '로그아웃' : '로그인'}</span>
        </a>
      </nav>

      {/* 4. 최하단 푸터 (Footer) */}
      <footer className="bg-surface-container py-10 mt-12 border-t-2 border-dashed border-outline-variant/60 text-center space-y-4 px-6 pb-24 md:pb-10">
        <div className="font-gaegu text-headline-md text-primary font-bold">
          {"예원's 맛집도감 😊"}
        </div>
        <p className="font-nanum text-lg text-on-surface-variant/80">
          © 2026 사랑을 담아 스크랩함 (Scrapped with Love)
        </p>
      </footer>
    </div>
  )
}
