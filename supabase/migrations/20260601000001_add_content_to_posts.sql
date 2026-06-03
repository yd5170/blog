-- posts 테이블에 마크다운 본문을 저장하기 위한 content 컬럼을 추가합니다.
-- 주석은 한국어로 작성되었습니다.

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS content TEXT;
