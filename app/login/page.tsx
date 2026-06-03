/**
 * @file app/login/page.tsx
 * @description 예원's 맛집도감의 로그인 및 회원가입 페이지 컴포넌트입니다.
 * 제공된 로그인/가입 화면 시안(s_1/screen.png)의 디자인 레이아웃을 그대로 반영했습니다.
 * 배경은 도트(Dot) 패턴이며, 좌측의 로그인(Login) 카드와 우측의 회원가입(SignUp) 카드가 나란히 배치되는 반응형 더블 카드 UI를 구현했습니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { loginAction, signupAction } from './actions'
import Link from 'next/link'

interface LoginPageProps {
  searchParams: Promise<{
    mode?: string
    error?: string
    message?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams
  const error = resolvedParams.error
  const message = resolvedParams.message
  const mode = resolvedParams.mode
  const isSignUp = mode === 'signup'

  // 구글 소셜 로그인/회원가입용 간단 SVG 로고
  const googleLogo = (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-6 login-bg select-none">
      
      {/* Kitsch 장식용 낙서 데코 (Sticker Doodles) */}
      <div className="fixed top-12 left-12 text-[#ac2a5d] opacity-20 rotate-12 pointer-events-none hidden xl:block">
        <span className="material-symbols-outlined text-[100px]">favorite</span>
      </div>
      <div className="fixed bottom-12 right-12 text-[#feb246] opacity-20 -rotate-12 pointer-events-none hidden xl:block">
        <span className="material-symbols-outlined text-[120px]">star</span>
      </div>

      {/* 헤더 홈 연결 버튼 */}
      <div className="mb-8 text-center z-10">
        <Link 
          href="/"
          className="font-gaegu text-4xl text-primary font-bold tracking-tight hover:-rotate-1 transition-transform inline-block"
        >
          {"예원's 맛집도감 😊"}
        </Link>
        <p className="font-nanum text-xl text-on-surface-variant/80 mt-1">
          오늘도 맛있는 일기를 펼쳐볼까요?
        </p>
      </div>

      {/* 피드백 스티커 (Error & Message) */}
      <div className="w-full max-w-md mb-6 z-10 space-y-3">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg border-2 border-dashed border-error rotate-[-1deg] scrapbook-shadow relative">
            <p className="font-nanum text-lg flex items-center gap-1.5 leading-tight">
              <span className="material-symbols-outlined text-[22px] align-middle">warning</span>
              {decodeURIComponent(error)}
            </p>
          </div>
        )}
        {message && (
          <div className="bg-[#fdebdc] text-on-secondary-fixed p-3 rounded-lg border-2 border-dashed border-secondary rotate-[1deg] scrapbook-shadow relative">
            <p className="font-nanum text-lg flex items-center gap-1.5 leading-tight">
              <span className="material-symbols-outlined text-[22px] align-middle">info</span>
              {decodeURIComponent(message)}
            </p>
          </div>
        )}
      </div>

      {/* 메인 로그인 & 회원가입 카드 분기 렌더링 */}
      <div className="relative w-full max-w-md z-10">
        
        {!isSignUp ? (
          /* 1. 로그인 카드 (Login Card) */
          <div className="bg-white rounded-2xl p-8 scrapbook-shadow border border-outline-variant/30 relative flex flex-col justify-between rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300 min-h-[480px]">
            {/* 노란 땡땡이 마스킹 테이프 */}
            <div className="washi-tape-yellow w-24 h-6 -top-3 left-8 rotate-[-3deg]"></div>
            
            <form action={loginAction} className="space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-gaegu text-3xl font-bold text-on-surface flex items-center gap-1.5">
                    로그인 <span className="text-[#ac2a5d] text-2xl">♡</span>
                  </h2>
                  {/* 포크와 나이프 아이콘 장식 */}
                  <span className="material-symbols-outlined text-outline-variant text-[28px] opacity-70">restaurant</span>
                </div>

                <div className="space-y-4">
                  {/* 이메일 */}
                  <div>
                    <label className="block font-gaegu text-lg text-on-surface-variant mb-1">이메일</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      placeholder="이메일을 입력하세요"
                      className="w-full bg-[#fdebdc]/20 border-2 border-outline-variant/60 rounded-xl py-3 px-4 font-body-md text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block font-gaegu text-lg text-on-surface-variant mb-1">비밀번호</label>
                    <div className="relative">
                      <input 
                        name="password"
                        type="password"
                        required
                        placeholder="비밀번호를 입력하세요"
                        className="w-full bg-[#fdebdc]/20 border-2 border-outline-variant/60 rounded-xl py-3 px-4 font-body-md text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:bg-white focus:outline-none transition-all text-sm pr-10"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant/60 text-[20px] cursor-pointer">visibility</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="space-y-3 mt-6">
                <button 
                  type="submit" 
                  className="w-full bg-[#392f25] text-white font-gaegu text-xl py-3.5 rounded-xl border-2 border-outline-variant hover:scale-101 hover:rotate-1 transition-all cursor-pointer font-bold scrapbook-shadow"
                >
                  로그인
                </button>
                
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-dashed border-outline-variant/40 w-full"></div>
                  <span className="absolute bg-white px-3 font-nanum text-base text-on-surface-variant">또는</span>
                </div>

                <button 
                  type="button"
                  className="w-full bg-white text-on-surface font-gaegu text-lg py-2.5 rounded-xl border border-outline-variant/60 hover:scale-101 transition-transform cursor-pointer flex items-center justify-center gap-2 scrapbook-shadow"
                >
                  {googleLogo}
                  <span>Google로 로그인</span>
                </button>

                {/* 회원가입 전환용 링크 */}
                <div className="mt-6 text-center pt-4 border-t border-dashed border-outline-variant/40">
                  <p className="font-nanum text-lg text-on-surface-variant">
                    처음 방문하셨나요?
                    <Link 
                      href="/login?mode=signup" 
                      className="text-primary font-bold hover:underline ml-2 transform hover:scale-102 transition-transform inline-block"
                    >
                      회원가입하기
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* 2. 회원가입 카드 (SignUp Card) */
          <div className="bg-white rounded-2xl p-8 scrapbook-shadow border border-outline-variant/30 relative flex flex-col justify-between rotate-[0.5deg] hover:rotate-0 transition-transform duration-300 min-h-[480px]">
            {/* 노란 땡땡이 마스킹 테이프 */}
            <div className="washi-tape-yellow w-24 h-6 -top-3 right-8 rotate-[2deg]"></div>

            <form action={signupAction} className="space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-gaegu text-3xl font-bold text-on-surface flex items-center gap-1.5">
                    회원가입 <span className="text-[#feb246] text-2xl">⭐</span>
                  </h2>
                  {/* 별 스티커 장식 */}
                  <span className="material-symbols-outlined text-[#feb246] text-[28px] opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>

                <div className="space-y-4">
                  {/* 이메일 */}
                  <div>
                    <label className="block font-gaegu text-lg text-on-surface-variant mb-1">이메일</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      placeholder="이메일을 입력하세요"
                      className="w-full bg-[#fdebdc]/20 border-2 border-outline-variant/60 rounded-xl py-3 px-4 font-body-md text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block font-gaegu text-lg text-on-surface-variant mb-1">비밀번호</label>
                    <input 
                      name="password"
                      type="password"
                      required
                      placeholder="비밀번호를 입력하세요"
                      className="w-full bg-[#fdebdc]/20 border-2 border-outline-variant/60 rounded-xl py-3 px-4 font-body-md text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block font-gaegu text-lg text-on-surface-variant mb-1">비밀번호 확인</label>
                    <input 
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full bg-[#fdebdc]/20 border-2 border-outline-variant/60 rounded-xl py-3 px-4 font-body-md text-on-surface placeholder-on-surface-variant/40 focus:border-primary focus:bg-white focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="space-y-3 mt-6">
                <button 
                  type="submit" 
                  className="w-full bg-[#392f25] text-white font-gaegu text-xl py-3.5 rounded-xl border-2 border-outline-variant hover:scale-101 hover:-rotate-1 transition-all cursor-pointer font-bold scrapbook-shadow"
                >
                  회원가입
                </button>

                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-dashed border-outline-variant/40 w-full"></div>
                  <span className="absolute bg-white px-3 font-nanum text-base text-on-surface-variant">또는</span>
                </div>

                <button 
                  type="button"
                  className="w-full bg-white text-on-surface font-gaegu text-lg py-2.5 rounded-xl border border-outline-variant/60 hover:scale-101 transition-transform cursor-pointer flex items-center justify-center gap-2 scrapbook-shadow"
                >
                  {googleLogo}
                  <span>Google로 가입</span>
                </button>

                {/* 로그인 전환용 링크 */}
                <div className="mt-6 text-center pt-4 border-t border-dashed border-outline-variant/40">
                  <p className="font-nanum text-lg text-on-surface-variant">
                    이미 회원이신가요?
                    <Link 
                      href="/login?mode=login" 
                      className="text-secondary font-bold hover:underline ml-2 transform hover:scale-102 transition-transform inline-block"
                    >
                      로그인하기
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
