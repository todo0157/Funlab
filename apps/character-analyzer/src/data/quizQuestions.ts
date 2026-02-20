import type { QuizQuestion } from '../types/character';

export const quizQuestions: QuizQuestion[] = [
  // 대화 스타일 (Communication)
  {
    id: 'comm-1',
    category: 'communication',
    question: '친구가 고민을 털어놓았을 때, 당신의 반응은?',
    options: [
      {
        text: '일단 끝까지 들어주고, 공감해준다',
        traits: { warmth: 90, emotion: 80, directness: 30 },
      },
      {
        text: '문제 해결책을 바로 제시한다',
        traits: { warmth: 50, emotion: 30, directness: 90, initiative: 80 },
      },
      {
        text: '농담으로 분위기를 풀어준다',
        traits: { warmth: 70, humor: 90, energy: 70 },
      },
      {
        text: '조용히 옆에 있어준다',
        traits: { warmth: 75, emotion: 60, energy: 30, loyalty: 85 },
      },
    ],
  },
  {
    id: 'comm-2',
    category: 'communication',
    question: '화가 났을 때 당신의 표현 방식은?',
    options: [
      {
        text: '바로 말로 표현한다 (직설적)',
        traits: { directness: 95, energy: 75, emotion: 70 },
      },
      {
        text: '일단 참고, 나중에 정리해서 말한다',
        traits: { directness: 40, emotion: 45, initiative: 50 },
      },
      {
        text: '표정이나 행동으로 은근히 표현한다',
        traits: { directness: 30, emotion: 65, warmth: 35 },
      },
      {
        text: '혼자 삭힌다 (말 안 함)',
        traits: { directness: 15, emotion: 50, warmth: 40, energy: 25 },
      },
    ],
  },
  {
    id: 'comm-3',
    category: 'communication',
    question: '새로운 사람을 만났을 때 당신은?',
    options: [
      {
        text: '먼저 다가가서 말을 건다',
        traits: { initiative: 95, energy: 85, warmth: 75 },
      },
      {
        text: '상대방이 말 걸어주길 기다린다',
        traits: { initiative: 25, energy: 35, warmth: 55 },
      },
      {
        text: '상황 봐서 적절히 대응한다',
        traits: { initiative: 55, energy: 50, warmth: 60 },
      },
      {
        text: '관심 있는 사람에게만 다가간다',
        traits: { initiative: 70, ambition: 65, directness: 60 },
      },
    ],
  },
  // 에너지/텐션 (Energy)
  {
    id: 'energy-1',
    category: 'energy',
    question: '모임에서 당신의 역할은?',
    options: [
      {
        text: '분위기 메이커! 모두를 웃긴다',
        traits: { energy: 95, humor: 95, initiative: 80, warmth: 80 },
      },
      {
        text: '조용히 참여하며 리액션 담당',
        traits: { energy: 40, warmth: 70, initiative: 30 },
      },
      {
        text: '계획하고 이끄는 리더 역할',
        traits: { initiative: 95, ambition: 80, energy: 70 },
      },
      {
        text: '필요할 때만 나서는 서포터',
        traits: { loyalty: 85, warmth: 75, initiative: 45 },
      },
    ],
  },
  {
    id: 'energy-2',
    category: 'energy',
    question: '주말에 가장 하고 싶은 것은?',
    options: [
      {
        text: '친구들과 신나게 놀기',
        traits: { energy: 90, warmth: 80, initiative: 70 },
      },
      {
        text: '집에서 혼자 충전하기',
        traits: { energy: 25, warmth: 50, initiative: 30 },
      },
      {
        text: '새로운 것 배우거나 도전하기',
        traits: { ambition: 90, initiative: 85, energy: 70 },
      },
      {
        text: '소수의 친한 친구와 조용히 만남',
        traits: { warmth: 85, loyalty: 90, energy: 45 },
      },
    ],
  },
  {
    id: 'energy-3',
    category: 'energy',
    question: '스트레스 받을 때 당신은?',
    options: [
      {
        text: '운동이나 활동적인 것으로 푼다',
        traits: { energy: 85, initiative: 75, emotion: 55 },
      },
      {
        text: '혼자만의 시간을 갖는다',
        traits: { energy: 30, emotion: 60, warmth: 40 },
      },
      {
        text: '누군가에게 털어놓는다',
        traits: { warmth: 80, emotion: 85, loyalty: 70 },
      },
      {
        text: '문제 해결에 집중한다',
        traits: { ambition: 85, initiative: 80, directness: 70 },
      },
    ],
  },
  // 관계/감정 (Relationship)
  {
    id: 'rel-1',
    category: 'relationship',
    question: '친구 관계에서 당신은?',
    options: [
      {
        text: '넓고 다양한 친구 관계를 선호',
        traits: { energy: 80, warmth: 70, initiative: 75 },
      },
      {
        text: '소수의 깊은 친구 관계를 선호',
        traits: { loyalty: 95, warmth: 80, emotion: 75 },
      },
      {
        text: '필요에 따라 유연하게',
        traits: { initiative: 60, warmth: 55, ambition: 55 },
      },
      {
        text: '혼자 있는 시간도 중요',
        traits: { energy: 30, warmth: 45, emotion: 50 },
      },
    ],
  },
  {
    id: 'rel-2',
    category: 'relationship',
    question: '갈등이 생겼을 때 당신의 해결 방식은?',
    options: [
      {
        text: '즉시 대화로 해결하려 한다',
        traits: { directness: 95, initiative: 85, warmth: 65 },
      },
      {
        text: '시간을 두고 천천히 풀어간다',
        traits: { directness: 35, emotion: 55, warmth: 60 },
      },
      {
        text: '상대방이 먼저 다가오길 기다린다',
        traits: { initiative: 25, directness: 30, emotion: 65 },
      },
      {
        text: '중재자를 통해 해결한다',
        traits: { warmth: 55, initiative: 45, directness: 40 },
      },
    ],
  },
  {
    id: 'rel-3',
    category: 'relationship',
    question: '감정 표현에 대해 당신은?',
    options: [
      {
        text: '감정을 솔직하게 표현하는 편',
        traits: { emotion: 95, directness: 85, warmth: 70 },
      },
      {
        text: '필요할 때만 표현하는 편',
        traits: { emotion: 50, directness: 55, warmth: 55 },
      },
      {
        text: '표현보다 행동으로 보여주는 편',
        traits: { emotion: 45, warmth: 75, loyalty: 85, directness: 35 },
      },
      {
        text: '감정 표현이 어려운 편',
        traits: { emotion: 25, directness: 25, warmth: 40 },
      },
    ],
  },
  // 가치관/성향 (Values)
  {
    id: 'val-1',
    category: 'values',
    question: '목표를 달성하는 당신의 스타일은?',
    options: [
      {
        text: '치밀하게 계획하고 실행한다',
        traits: { ambition: 95, initiative: 85, directness: 70 },
      },
      {
        text: '직감과 순발력으로 돌파한다',
        traits: { energy: 85, initiative: 80, ambition: 70 },
      },
      {
        text: '주변 도움을 받아 함께 간다',
        traits: { warmth: 85, loyalty: 80, ambition: 55 },
      },
      {
        text: '흐름에 맡기며 유연하게',
        traits: { ambition: 35, warmth: 60, energy: 45 },
      },
    ],
  },
  {
    id: 'val-2',
    category: 'values',
    question: '옳지 않은 상황을 목격했을 때?',
    options: [
      {
        text: '바로 나서서 말한다',
        traits: { directness: 100, initiative: 95, ambition: 75, loyalty: 80 },
      },
      {
        text: '상황을 보고 신중하게 행동한다',
        traits: { directness: 55, initiative: 60, emotion: 50 },
      },
      {
        text: '다른 방법으로 돕는다 (신고 등)',
        traits: { warmth: 70, loyalty: 75, initiative: 50 },
      },
      {
        text: '일단 지켜본다',
        traits: { initiative: 25, directness: 25, emotion: 45 },
      },
    ],
  },
  {
    id: 'val-3',
    category: 'values',
    question: '변화나 새로운 환경에 대해?',
    options: [
      {
        text: '설레고 기대된다',
        traits: { energy: 90, initiative: 85, ambition: 80 },
      },
      {
        text: '적응하는 데 시간이 필요하다',
        traits: { energy: 40, warmth: 55, emotion: 60 },
      },
      {
        text: '필요하면 빠르게 적응한다',
        traits: { initiative: 75, ambition: 70, energy: 65 },
      },
      {
        text: '현재가 좋아서 변화를 원치 않는다',
        traits: { ambition: 25, warmth: 65, loyalty: 70 },
      },
    ],
  },
];

export function getQuestionsByCategory(category: QuizQuestion['category']): QuizQuestion[] {
  return quizQuestions.filter(q => q.category === category);
}
