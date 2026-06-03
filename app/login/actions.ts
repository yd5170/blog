/**
 * @file app/login/actions.ts
 * @description Supabase Auth의 이메일(Email) 로그인 및 회원가입 처리를 담당하는
 * 100% 서버 액션(Server Actions) 파일입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

"use server"

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * @description 사용자 로그인(Login)을 처리하는 서버 액션입니다.
 * @param formData 폼(Form)에서 입력받은 데이터
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?mode=login&error=' + encodeURIComponent('이메일과 비밀번호를 모두 입력해 주세요.'))
  }

  const supabase = await createClient()

  // Supabase 이메일/비밀번호 로그인 API 호출
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // 로그인 실패 시 오류 메시지와 함께 로그인 페이지로 리다이렉트(Redirect)
    return redirect(`/login?mode=login&error=${encodeURIComponent(error.message)}`)
  }

  // 로그인 성공 시 루트('/') 대시보드로 이동
  return redirect('/')
}

/**
 * @description 사용자 회원가입(Sign Up)을 처리하는 서버 액션입니다.
 * @param formData 폼(Form)에서 입력받은 데이터
 */
export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !password || !confirmPassword) {
    return redirect('/login?mode=signup&error=' + encodeURIComponent('모든 항목을 입력해 주세요.'))
  }

  if (password !== confirmPassword) {
    return redirect('/login?mode=signup&error=' + encodeURIComponent('비밀번호가 서로 일치하지 않습니다.'))
  }

  const supabase = await createClient()

  // Supabase 회원가입 API 호출 (이메일 인증이 활성화되어 메일 인증 링크가 전송됨)
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    // 회원가입 실패 시 오류 메시지와 함께 회원가입 페이지로 리다이렉트
    return redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`)
  }

  // 회원가입 성공 시 메일 확인 안내 메시지와 함께 로그인 화면으로 리다이렉트
  return redirect('/login?mode=login&message=' + encodeURIComponent('가입 확인 이메일이 발송되었습니다! 메일함을 확인하고 링크를 클릭해 주세요.'))
}

/**
 * @description 사용자 로그아웃(Sign Out)을 처리하는 서버 액션입니다.
 */
export async function signOutAction() {
  const supabase = await createClient()
  
  // Supabase 세션 만료 및 로그아웃 API 호출
  await supabase.auth.signOut()
  
  // 로그인 화면으로 리다이렉트
  return redirect('/login')
}
