// Project Gutenberg Korea 작품 데이터
export interface GutenbergBook {
  id: string;
  title: string;
  author: string;
  description: string;
  text: string;
  category: string;
}

// Project Gutenberg Korea 작품 목록 (샘플 데이터)
// 실제로는 API를 통해 가져오거나 더 많은 작품을 추가할 수 있습니다.
export const gutenbergBooks: GutenbergBook[] = [
  {
    id: "1",
    title: "춘향전",
    author: "작자 미상",
    description: "한국 고전 소설의 대표작",
    category: "고전소설",
    text: `옛날 남원부에 월매라는 기생이 있었는데, 그 기생이 퇴기하여 성 밖 기생촌에 살면서 춘향을 낳아 기르고 있었다.

춘향은 나이 열여섯에 이르러 그 아름다움이 세상에 둘도 없었다. 얼굴은 달 같고 눈썹은 버들잎 같으며, 눈은 별 같고 코는 목련꽃 같았다. 입술은 앵두 같고 이는 조개 같았으며, 손가락은 파 뿌리 같고 허리는 버들가지 같았다.

이때 전라도 관찰사로 부임한 변학도는 그 아름다운 춘향을 보고 반하여, 춘향을 수청으로 들이려고 하였다. 그러나 춘향은 이미 이몽룡과 백년해로를 맹세한 사이였으므로, 변학도의 요구를 거절하였다.

변학도는 춘향을 옥에 가두고 갖은 고문을 가하였으나, 춘향은 끝내 굴복하지 않았다. 이때 이몽룡은 과거에 급제하여 암행어사가 되어 남원에 내려왔다.

이몽룡은 변학도의 죄상을 파악하고, 그를 처벌한 후 춘향을 구출하여 함께 서울로 올라가 행복하게 살았다고 한다.`,
  },
  {
    id: "2",
    title: "심청전",
    author: "작자 미상",
    description: "효행을 다룬 한국 고전 소설",
    category: "고전소설",
    text: `옛날 황주 땅에 심봉사라는 맹인이 살고 있었다. 심봉사에게는 심청이라는 딸이 있었는데, 심청은 나이 열여섯에 이르러 그 효성이 지극하였다.

심봉사는 눈을 뜨기 위해서는 삼백 석 공양미가 필요하다고 하였다. 심청은 아버지의 눈을 뜨게 하기 위해 공양미 삼백 석을 바치기로 하였다.

그러나 가난한 심청에게는 그 많은 쌀을 마련할 길이 없었다. 마침 인당수에 제물로 바칠 처녀를 구한다는 소문이 전해지자, 심청은 자진하여 제물이 되기로 하였다.

심청은 인당수에 빠져 용왕궁에 이르렀다. 용왕은 심청의 효성에 감동하여 그를 다시 살려 보내고, 심봉사의 눈도 뜨게 하였다.

심청은 다시 살아나서 아버지와 함께 행복하게 살았다고 한다.`,
  },
  {
    id: "3",
    title: "허생전",
    author: "박지원",
    description: "연암 박지원의 우화 소설",
    category: "고전소설",
    text: `허생은 서울에 사는 한 선비였다. 허생은 글을 읽고 글을 쓰는 일 외에는 아무것도 할 줄 몰랐다. 그래서 집안이 매우 가난하였다.

하루는 허생이 시장에 나가서 쌀을 사려고 하였으나, 돈이 없어서 쌀을 살 수 없었다. 허생은 한탄하며 집으로 돌아오는 길에, 한 노인이 그를 불러 세웠다.

노인은 허생에게 큰 돈을 주면서 장사를 하라고 권하였다. 허생은 처음에는 거절하였으나, 노인의 간곡한 권유에 못 이겨 돈을 받아 장사를 시작하였다.

허생은 장사를 시작한 지 얼마 되지 않아 큰 부자가 되었다. 허생은 부자가 된 후에도 여전히 검소하게 살았고, 가난한 사람들을 도와주었다.

허생의 이야기는 사람들에게 부와 덕을 함께 쌓는 것이 중요하다는 교훈을 주었다.`,
  },
  {
    id: "4",
    title: "토끼전",
    author: "작자 미상",
    description: "토끼와 자라의 우화",
    category: "고전소설",
    text: `옛날 바다 속 용궁에 용왕이 살고 있었다. 용왕은 병이 들어 사람의 간을 먹어야 낫는다고 하였다.

용왕은 자라를 시켜 사람의 간을 구해 오라고 하였다. 자라는 육지로 올라가서 토끼를 만났다.

자라는 토끼에게 용궁의 아름다움을 이야기하며 용궁으로 초대하였다. 토끼는 자라의 말을 믿고 용궁으로 따라갔다.

용궁에 도착한 토끼는 용왕의 병을 듣고, 자신의 간을 주겠다고 하였다. 그러나 토끼는 간을 집에 두고 왔다고 거짓말을 하였다.

자라는 토끼를 다시 육지로 데려가서 간을 가져오라고 하였다. 토끼는 육지에 도착하자마자 도망쳐 버렸다.

이 이야기는 지혜로움으로 위기를 모면하는 것의 중요성을 보여준다.`,
  },
  {
    id: "5",
    title: "흥부전",
    author: "작자 미상",
    description: "형제애를 다룬 고전 소설",
    category: "고전소설",
    text: `옛날에 흥부와 놀부라는 두 형제가 있었다. 흥부는 착하고 성실하였으나 가난하였고, 놀부는 부자였으나 인색하고 못된 사람이었다.

흥부는 가난하여 식구를 거의 굶어 죽게 되었다. 흥부는 형인 놀부에게 도움을 청하였으나, 놀부는 냉정하게 거절하였다.

흥부는 할 수 없이 제비를 구하여 집에 살게 하였다. 제비는 다리가 부러져서 날 수 없었는데, 흥부는 제비의 다리를 고쳐 주었다.

다음 해 봄, 제비는 박씨를 물고 와서 흥부에게 주었다. 흥부는 그 박씨를 심었더니, 큰 박이 열렸다.

박을 깨뜨리니 그 안에서 금은보화가 쏟아져 나왔다. 흥부는 그 보물로 부자가 되어 행복하게 살았다.

놀부는 흥부가 부자가 된 것을 보고, 제비의 다리를 일부러 부러뜨려서 고쳐 주었다. 그러나 놀부가 받은 박에서는 도깨비가 나와서 놀부를 혼내주었다.`,
  },
];

// 작품 검색
export const searchBooks = (query: string): GutenbergBook[] => {
  if (!query.trim()) return gutenbergBooks;
  
  const lowerQuery = query.toLowerCase();
  return gutenbergBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.description.toLowerCase().includes(lowerQuery) ||
      book.category.toLowerCase().includes(lowerQuery)
  );
};

// ID로 작품 가져오기
export const getBookById = (id: string): GutenbergBook | undefined => {
  return gutenbergBooks.find((book) => book.id === id);
};

// 카테고리별 작품 가져오기
export const getBooksByCategory = (category: string): GutenbergBook[] => {
  return gutenbergBooks.filter((book) => book.category === category);
};

// 모든 카테고리 가져오기
export const getAllCategories = (): string[] => {
  return Array.from(new Set(gutenbergBooks.map((book) => book.category)));
};

