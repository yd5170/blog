/**
 * @file scripts/seed.js
 * @description 로컬 .env.local 환경 변수를 읽어 Supabase에 직접 시드 데이터를 추가하는 Node.js 스크립트입니다.
 * 주석은 한국어로 작성되었으며, 기술적인 용어는 영어를 병기합니다.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. .env.local 파일 로드 및 환경변수 파싱 (Parsing)
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('오류: .env.local 파일을 찾을 수 없습니다.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    // 따옴표 제거
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('오류: .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 정의되어 있지 않습니다.');
  process.exit(1);
}

// 2. Supabase 클라이언트(Client) 인스턴스 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 시드용 맛집 데이터 리스트
const seedPosts = [
  {
    title: '연남 오월',
    location: '연남동',
    category: '카페',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANKkB7D8otTV1WvXIaEtX0Wg8dSV0Kpqp8SRO8BOfVsQeZeBap4eoRQQMSHS_vPpORWtsoVJ_RDKzcFN__cpRY3djtIzVfA2EkLrezur2x6EgcbjmzOw7IZyftd-6yKiAlF9DNn8Jz1pLwxD8izwfN0vP4t8yhPjYtakHsq7WvoSwr0znlpl3Rb2GGagtQHcpbgaY-bp3qL6cR1RCvgo5wRwuEqOvCDUJPznAbzZVT4NPS_ej8pDrY7YrkKrMS3vNl2kHsd3eXXDw',
    likes: 128,
    tag: '분위기 최고!'
  },
  {
    title: '바질 인 더 가든',
    location: '성수',
    category: '이탈리안',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnPMaE_OLCuhE2Z9VR4OS7pa3Lnmu8v0Y9T4MCLxIagwTSYJ2Vnlxxfj3tpau32yCV0YbOpWGF1Xo6PKGAVBQrkGbfElaQU_NFb5Zna6A7O70oinIIFkLVY0_eBGTNxuOLb2XTw1R4oYNmq308y-VHl6_Ah9zJ5xL6fGSsvkoCNiNNQ59xFw6gljUgeq7jvrvRI4HXW5JJ9XYMuCkh9yUM1vRD4S2fpXDeB58GgsIeeTTdxkpAcNnkdiMT9fziVI9vV2bjKZvrDhE',
    likes: 256,
    tag: '치즈 폭탄!'
  },
  {
    title: '돈카츠 소',
    location: '홍대',
    category: '일식',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQXGAJRiO7NhDv99u9tF8ev_58RaX5fDFvhycAvNrRjTI5ctjIXtWp1GabT0vKzGCKsVgrKVKo-ubbMx4bogwBIfz_iKiDPzjInVmDiYuViQGN7sNvs5A_pdIxq8fpxh32AYwJjHoVYBhCeQow-kUeeYBDlqrfQ7uA9uuBC3szlhMsT56G9mXzP-edDUWNxrgUQXNpwNRrlPw_IJQDN1clNL2eHgkG9cQyKLthTQZqCWum2bwK-TcnxhXs5Mfyeat-MVMKR4fWcRc',
    likes: 342,
    tag: '인생 돈카츠!'
  },
  {
    title: '서촌 브런치 카페',
    location: '서촌',
    category: '카페',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxMbzUp6JlQtRn5DE2cU1Xs28M7KCfJcZnwC0onsdOl5xDPl-Y7rhjAUFtpoMAOXLxJN56dX7viWBA9KLjr3qjcec_0AoSsLcpdmL88W4mifWIJh2UDV9OMd6Uk-8TqAWLKw3e0nn5WUo3VXNELoTvfjtmiE5mYj_WwX8ja6EWQITWcb8GOOwlBohXAC2EjltDCyKZsrJwm3k2dzfdpKkQyi5uJsT1h3183fU59vgZkyvSRuqITm0f0IPui5uE5-b0tBSzn5sDahc',
    likes: 97,
    tag: '꼭 가봐야 할 곳!'
  }
];

async function seedDatabase() {
  console.log('Supabase 데이터베이스에 시드 데이터를 입력하는 중입니다...');

  try {
    // 3. 기존 테이블 데이터 개수 체크
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`테이블 정보 조회 실패: ${countError.message}. (마이그레이션이 먼저 실행되었는지 확인해 주세요)`);
    }

    if (count > 0) {
      console.log(`알림: 이미 posts 테이블에 ${count}개의 데이터가 존재합니다. 시딩을 건너뜁니다.`);
      return;
    }

    // 4. 시드 데이터 다량 등록 (Bulk Insert)
    const { data, error: insertError } = await supabase
      .from('posts')
      .insert(seedPosts)
      .select();

    if (insertError) {
      throw insertError;
    }

    console.log('성공: 시드 데이터 4개가 데이터베이스에 정상 등록되었습니다! 📔');
    console.log(data);
  } catch (error) {
    console.error('오류 발생:', error.message || error);
  }
}

seedDatabase();
