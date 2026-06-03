/**
 * @file app/page.tsx
 * @description 로그인에 성공한 사용자에게만 보여주는 메인(Home) 페이지 서버 컴포넌트입니다.
 * 비로그인 상태일 시 미들웨어 또는 본 컴포넌트 레벨에서 `/login`으로 강제 리다이렉트(Redirect) 처리합니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import { createClient } from '@/utils/supabase/server'
import BlogHome from './blog-home'

export default async function Home() {
  const supabase = await createClient()

  // 로그인된 사용자 정보(User Session)를 확인합니다.
  // 비로그인 상태여도 메인 페이지를 볼 수 있도록 redirect를 제거하고 user 객체만 전달합니다.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <BlogHome initialUser={user} />
}
