-- 1. posts 테이블의 행 레벨 보안 (RLS, Row-Level Security)을 활성화합니다.
-- 주석은 한국어로 작성되었습니다.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 조건 없이 블로그 글 목록을 조회(SELECT)할 수 있도록 허용하는 정책(Policy)을 생성합니다.
-- 이미 동일한 이름의 정책이 존재할 경우 오류가 발생할 수 있으므로, 기존 정책이 있다면 삭제 후 재생성할 수 있도록 합니다.
DROP POLICY IF EXISTS "Allow public read access" ON public.posts;

CREATE POLICY "Allow public read access" ON public.posts
    FOR SELECT USING (true);
