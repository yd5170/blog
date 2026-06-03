/**
 * @file utils/supabase/middleware.ts
 * @description Next.js 미들웨어(Middleware)에서 사용자 세션(Session)을 확인하고 
 * 토큰 만료 시 자동으로 세션을 갱신(Refresh)해 주는 기능을 수행하는 유틸리티 파일입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 사용자 세션을 갱신하고 검증하는 비동기 함수
export async function updateSession(request: NextRequest) {
  // 기본 응답(Response) 객체 초기화
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 미들웨어 전용 Supabase 서버 클라이언트 생성
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청에서 모든 쿠키를 읽어옴
        getAll() {
          return request.cookies.getAll()
        },
        // 토큰 갱신 등으로 변경된 쿠키 정보를 요청 및 응답 헤더에 동기화
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 중요: 사용자 세션이 유효한지 Supabase에 확인 (토큰 갱신 자동 트리거)
  await supabase.auth.getUser()

  return supabaseResponse
}
