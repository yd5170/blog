/**
 * @file utils/supabase/server.ts
 * @description 서버 컴포넌트(Server Components), 서버 액션(Server Actions) 등 서버 환경에서 
 * Supabase에 접근할 때 사용할 클라이언트를 생성하는 유틸리티 파일입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Next.js 서버 측 Supabase 클라이언트(Client)를 생성하는 함수
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 쿠키(Cookies)를 가져오는 메서드
        getAll() {
          return cookieStore.getAll()
        },
        // 쿠키를 저장하고 설정하는 메서드
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트(Server Component) 내에서 setAll이 호출되는 경우 에러를 감지하지만,
            // 세션 리프레시 미들웨어(Middleware)가 존재하므로 무시해도 무방합니다.
          }
        },
      },
    }
  )
}
