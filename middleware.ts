/**
 * @file middleware.ts
 * @description Next.js 미들웨어(Middleware) 정의 파일로, 모든 정적 파일을 제외한 라우트 요청 시
 * Supabase 세션(Session)을 유효하게 유지하도록 설정합니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// 모든 요청(Request)마다 미들웨어 함수를 실행하여 세션을 업데이트합니다.
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 아래 경로들을 제외한 모든 경로에 미들웨어를 적용합니다:
     * - _next/static (정적 리소스 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - 이미지 파일 확장자들 (svg, png, jpg 등)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
