/**
 * @file utils/supabase/client.ts
 * @description 클라이언트 컴포넌트(Client Components), 브라우저(Browser) 환경에서 
 * Supabase에 접근할 때 사용할 클라이언트를 생성하는 유틸리티 파일입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { createBrowserClient } from '@supabase/ssr'

// Next.js 클라이언트 측 Supabase 클라이언트(Client)를 생성하는 함수
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
