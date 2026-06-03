/**
 * @file app/layout.tsx
 * @description Next.js의 루트 레이아웃(Root Layout) 파일로, 공통 구글 폰트(Google Fonts) 로드 
 * 및 머티리얼 심볼(Material Symbols) 스타일시트를 설정합니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

import type { Metadata } from "next";
import { Noto_Sans_KR, Plus_Jakarta_Sans, Gaegu, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

// 'Noto Sans KR' 폰트 초기화 (깔끔하고 미니멀한 본문 및 타이틀용 한글 폰트)
const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// 'Plus Jakarta Sans' 폰트 초기화 (가독성 높은 영문 및 기본 본문용)
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// 예원's 맛집도감 감성 손글씨용 구글 폰트 '개구체' 초기화
const gaegu = Gaegu({
  variable: "--font-gaegu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// 포스트잇 메모 및 스티커 데코용 '나눔손글씨 펜체' 초기화
const nanumPen = Nanum_Pen_Script({
  variable: "--font-nanum-pen",
  subsets: ["latin"],
  weight: ["400"],
});

// 페이지 메타데이터(Metadata) 설정
export const metadata: Metadata = {
  title: "예원's 맛집도감 😊",
  description: "맛있는 추억을 담는 스크랩북 다이어리, 예원's 맛집도감",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSans.variable} ${plusJakarta.variable} ${gaegu.variable} ${nanumPen.variable} h-full antialiased`}
    >
      <head>
        {/* 구글 머티리얼 심볼(Material Symbols Outlined)을 불러옵니다 */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-full flex flex-col bg-[#fff8f4]">
        {children}
      </body>
    </html>
  );
}

