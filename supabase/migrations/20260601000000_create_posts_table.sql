-- 1. posts 테이블을 생성합니다.
-- 주석은 한국어로 작성되었습니다.
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. 행 레벨 보안 (RLS, Row-Level Security)을 활성화합니다.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책(Policies)을 생성합니다.

-- 정책 1: 누구나 블로그 글을 조회(SELECT)할 수 있도록 허용합니다.
CREATE POLICY "Allow public read access" ON public.posts
    FOR SELECT USING (true);

-- 정책 2: 인증된 사용자만 새 블로그 글을 추가(INSERT)할 수 있도록 허용합니다.
CREATE POLICY "Allow authenticated insert" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 정책 3: 좋아요(likes) 수 카운트 증가를 위해 누구나 글 정보 수정(UPDATE)을 할 수 있도록 허용합니다.
CREATE POLICY "Allow public update access" ON public.posts
    FOR UPDATE USING (true) WITH CHECK (true);

-- 4. 초기 시드 데이터(Seed Data)를 생성합니다.
-- 디자인 시안에 등장하는 4가지 감성 포토 카드 글 정보를 미리 채워둡니다.
INSERT INTO public.posts (title, location, category, image_url, likes, tag)
VALUES
    (
        '연남 오월', 
        '연남동', 
        '카페', 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuANKkB7D8otTV1WvXIaEtX0Wg8dSV0Kpqp8SRO8BOfVsQeZeBap4eoRQQMSHS_vPpORWtsoVJ_RDKzcFN__cpRY3djtIzVfA2EkLrezur2x6EgcbjmzOw7IZyftd-6yKiAlF9DNn8Jz1pLwxD8izwfN0vP4t8yhPjYtakHsq7WvoSwr0znlpl3Rb2GGagtQHcpbgaY-bp3qL6cR1RCvgo5wRwuEqOvCDUJPznAbzZVT4NPS_ej8pDrY7YrkKrMS3vNl2kHsd3eXXDw', 
        128, 
        '분위기 최고!'
    ),
    (
        '바질 인 더 가든', 
        '성수', 
        '이탈리안', 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBnPMaE_OLCuhE2Z9VR4OS7pa3Lnmu8v0Y9T4MCLxIagwTSYJ2Vnlxxfj3tpau32yCV0YbOpWGF1Xo6PKGAVBQrkGbfElaQU_NFb5Zna6A7O70oinIIFkLVY0_eBGTNxuOLb2XTw1R4oYNmq308y-VHl6_Ah9zJ5xL6fGSsvkoCNiNNQ59xFw6gljUgeq7jvrvRI4HXW5JJ9XYMuCkh9yUM1vRD4S2fpXDeB58GgsIeeTTdxkpAcNnkdiMT9fziVI9vV2bjKZvrDhE', 
        256, 
        '치즈 폭탄!'
    ),
    (
        '돈카츠 소', 
        '홍대', 
        '일식', 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXGAJRiO7NhDv99u9tF8ev_58RaX5fDFvhycAvNrRjTI5ctjIXtWp1GabT0vKzGCKsVgrKVKo-ubbMx4bogwBIfz_iKiDPzjInVmDiYuViQGN7sNvs5A_pdIxq8fpxh32AYwJjHoVYBhCeQow-kUeeYBDlqrfQ7uA9uuBC3szlhMsT56G9mXzP-edDUWNxrgUQXNpwNRrlPw_IJQDN1clNL2eHgkG9cQyKLthTQZqCWum2bwK-TcnxhXs5Mfyeat-MVMKR4fWcRc', 
        342, 
        '인생 돈카츠!'
    ),
    (
        '서촌 브런치 카페', 
        '서촌', 
        '카페', 
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBxMbzUp6JlQtRn5DE2cU1Xs28M7KCfJcZnwC0onsdOl5xDPl-Y7rhjAUFtpoMAOXLxJN56dX7viWBA9KLjr3qjcec_0AoSsLcpdmL88W4mifWIJh2UDV9OMd6Uk-8TqAWLKw3e0nn5WUo3VXNELoTvfjtmiE5mYj_WwX8ja6EWQITWcb8GOOwlBohXAC2EjltDCyKZsrJwm3k2dzfdpKkQyi5uJsT1h3183fU59vgZkyvSRuqITm0f0IPui5uE5-b0tBSzn5sDahc', 
        97, 
        '꼭 가봐야 할 곳!'
    );
