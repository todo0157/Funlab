import type { ChatMessage, ParsedChat, PreferenceInsight } from '../types/balance';

// PC 카카오톡 패턴: [이름] [오전/오후 시:분] 메시지
const PC_MESSAGE_PATTERN = /^\[([^\]]+)\] \[([^\]]+)\] (.+)$/;

// 모바일 (Android/iOS) 패턴: 이름, [오전/오후] 시:분 : 메시지 또는 yyyy. m. d. 오전/오후 시:분, 이름 : 메시지
const MOBILE_MESSAGE_PATTERN1 = /^(.+?), \[(오전|오후) (\d{1,2}:\d{2})\] : (.+)$/;
const MOBILE_MESSAGE_PATTERN2 = /^\d{4}\. \d{1,2}\. \d{1,2}\. (오전|오후) \d{1,2}:\d{2}, (.+?) : (.+)$/;

// 날짜 구분선 패턴
const DATE_PATTERN = /^-+ (\d{4}년 \d{1,2}월 \d{1,2}일|(\d{4})\. (\d{1,2})\. (\d{1,2})).*-+$/;
const DATE_PATTERN2 = /^(\d{4})년 (\d{1,2})월 (\d{1,2})일/;

// 시스템 메시지 필터링
const SYSTEM_MESSAGES = [
  '님이 들어왔습니다',
  '님이 나갔습니다',
  '님을 내보냈습니다',
  '채팅방 관리자가',
  '님이 입장하셨습니다',
  '님이 퇴장하셨습니다',
  '사진',
  '동영상',
  '이모티콘',
  '삭제된 메시지입니다',
];

function isSystemMessage(message: string): boolean {
  return SYSTEM_MESSAGES.some((sys) => message.includes(sys));
}

export function parseKakaoChat(content: string): ParsedChat {
  const lines = content.split('\n');
  const messages: ChatMessage[] = [];
  const participantsSet = new Set<string>();
  let currentDate = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 날짜 구분선 체크
    const dateMatch = trimmedLine.match(DATE_PATTERN) || trimmedLine.match(DATE_PATTERN2);
    if (dateMatch) {
      currentDate = trimmedLine;
      continue;
    }

    // PC 패턴
    let match = trimmedLine.match(PC_MESSAGE_PATTERN);
    if (match) {
      const [, sender, timestamp, message] = match;
      if (!isSystemMessage(message)) {
        messages.push({ sender, timestamp, message, date: currentDate });
        participantsSet.add(sender);
      }
      continue;
    }

    // 모바일 패턴 1
    match = trimmedLine.match(MOBILE_MESSAGE_PATTERN1);
    if (match) {
      const [, sender, ampm, time, message] = match;
      if (!isSystemMessage(message)) {
        messages.push({
          sender,
          timestamp: `${ampm} ${time}`,
          message,
          date: currentDate,
        });
        participantsSet.add(sender);
      }
      continue;
    }

    // 모바일 패턴 2
    match = trimmedLine.match(MOBILE_MESSAGE_PATTERN2);
    if (match) {
      const [, , sender, message] = match;
      if (!isSystemMessage(message)) {
        messages.push({
          sender,
          timestamp: '',
          message,
          date: currentDate,
        });
        participantsSet.add(sender);
      }
      continue;
    }
  }

  return {
    messages,
    participants: Array.from(participantsSet),
  };
}

// 취향/선호도 추출을 위한 키워드
const PREFERENCE_KEYWORDS = {
  음식: ['치킨', '피자', '햄버거', '짜장면', '짬뽕', '라면', '초밥', '삼겹살', '떡볶이', '커피', '차', '콜라', '사이다', '맥주', '소주', '와인'],
  여행: ['바다', '산', '해외', '국내', '여행', '휴가', '캠핑', '호텔', '펜션', '비행기', '기차'],
  취미: ['게임', '영화', '드라마', '운동', '독서', '음악', '노래', '춤', '그림', '요리', '쇼핑'],
  계절: ['봄', '여름', '가을', '겨울', '더위', '추위'],
  시간: ['아침', '저녁', '밤', '새벽', '주말', '평일'],
  스타일: ['귀여운', '멋진', '섹시', '청순', '편한', '화려한'],
};

export function extractPreferences(messages: ChatMessage[], targetName: string): PreferenceInsight[] {
  const targetMessages = messages.filter((m) => m.sender === targetName);
  const insights: PreferenceInsight[] = [];

  for (const [category, keywords] of Object.entries(PREFERENCE_KEYWORDS)) {
    const foundPreferences: string[] = [];
    const examples: string[] = [];

    for (const msg of targetMessages) {
      for (const keyword of keywords) {
        if (msg.message.includes(keyword)) {
          if (!foundPreferences.includes(keyword)) {
            foundPreferences.push(keyword);
            if (examples.length < 3) {
              examples.push(msg.message.slice(0, 50));
            }
          }
        }
      }
    }

    if (foundPreferences.length > 0) {
      insights.push({
        category,
        preferences: foundPreferences,
        examples,
      });
    }
  }

  return insights;
}

export function getMessageStats(messages: ChatMessage[], targetName: string) {
  const targetMessages = messages.filter((m) => m.sender === targetName);

  // 자주 쓰는 단어
  const wordCount: Record<string, number> = {};
  for (const msg of targetMessages) {
    const words = msg.message.split(/\s+/).filter((w) => w.length >= 2);
    for (const word of words) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  }

  const topWords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);

  return {
    totalMessages: targetMessages.length,
    topWords,
    avgLength: Math.round(targetMessages.reduce((sum, m) => sum + m.message.length, 0) / targetMessages.length),
  };
}
