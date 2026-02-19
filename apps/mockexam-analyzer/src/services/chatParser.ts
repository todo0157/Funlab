import { ChatMessage, ParsedChat } from '../types/mockexam';

// Date line patterns
const DATE_PATTERNS = [
  /^-+ (\d{4})년 (\d{1,2})월 (\d{1,2})일 .+ -+$/,
  /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 .요일$/,
];

// Message patterns for different platforms
const MESSAGE_PATTERNS = {
  // PC: [Name] [오후 3:45] Message
  pc: /^\[([^\]]+)\] \[([^\]]+)\] (.+)$/,
  // iOS: 2025. 1. 9. 22:07, Name : Message
  ios: /^(\d{4})\. ?(\d{1,2})\. ?(\d{1,2})\. (\d{1,2}):(\d{2}), ([^:]+) : (.+)$/,
  // Android: 2025년 4월 19일 오전 12:41, Name : Message
  android: /^(\d{4})년 (\d{1,2})월 (\d{1,2})일 (오전|오후) (\d{1,2}):(\d{2}), ([^:]+) : (.+)$/,
};

// System message patterns (to exclude)
const SYSTEM_PATTERNS = [
  /님이 들어왔습니다/,
  /님이 나갔습니다/,
  /님을 초대했습니다/,
  /채팅방을 나갔습니다/,
  /사진을 보냈습니다/,
  /동영상을 보냈습니다/,
  /파일을 보냈습니다/,
  /이모티콘을 보냈습니다/,
  /삭제된 메시지입니다/,
];

function isSystemMessage(content: string): boolean {
  return SYSTEM_PATTERNS.some((pattern) => pattern.test(content));
}

function detectMessageType(content: string): ChatMessage['messageType'] {
  if (isSystemMessage(content)) return 'system';
  if (content.includes('http://') || content.includes('https://')) return 'link';
  if (content === '사진' || content.includes('사진을 보냈습니다')) return 'photo';
  if (content === '이모티콘' || content.includes('이모티콘')) return 'emoticon';
  return 'text';
}

function parseTime(timeStr: string, currentDate: Date): Date {
  const date = new Date(currentDate);

  // Handle 오전/오후 format
  const ampmMatch = timeStr.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[2], 10);
    const minutes = parseInt(ampmMatch[3], 10);

    if (ampmMatch[1] === '오후' && hours !== 12) {
      hours += 12;
    } else if (ampmMatch[1] === '오전' && hours === 12) {
      hours = 0;
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // Handle HH:MM format
  const simpleMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (simpleMatch) {
    date.setHours(parseInt(simpleMatch[1], 10), parseInt(simpleMatch[2], 10), 0, 0);
    return date;
  }

  return date;
}

export function parseKakaoTalkChat(content: string): ParsedChat {
  const lines = content.split('\n');
  const messages: ChatMessage[] = [];
  const participants = new Set<string>();
  const messageCountBySender: Record<string, number> = {};

  let currentDate = new Date();

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check for date line
    for (const datePattern of DATE_PATTERNS) {
      const dateMatch = trimmedLine.match(datePattern);
      if (dateMatch) {
        currentDate = new Date(
          parseInt(dateMatch[1], 10),
          parseInt(dateMatch[2], 10) - 1,
          parseInt(dateMatch[3], 10)
        );
        break;
      }
    }

    // Try PC format
    const pcMatch = trimmedLine.match(MESSAGE_PATTERNS.pc);
    if (pcMatch) {
      const [, sender, timeStr, messageContent] = pcMatch;
      const timestamp = parseTime(timeStr, currentDate);
      const messageType = detectMessageType(messageContent);

      if (messageType !== 'system') {
        participants.add(sender);
        messageCountBySender[sender] = (messageCountBySender[sender] || 0) + 1;

        messages.push({
          sender,
          timestamp,
          content: messageContent,
          messageType,
        });
      }
      continue;
    }

    // Try iOS format
    const iosMatch = trimmedLine.match(MESSAGE_PATTERNS.ios);
    if (iosMatch) {
      const [, year, month, day, hour, minute, sender, messageContent] = iosMatch;
      const timestamp = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10)
      );
      const messageType = detectMessageType(messageContent);

      if (messageType !== 'system') {
        participants.add(sender.trim());
        const senderName = sender.trim();
        messageCountBySender[senderName] = (messageCountBySender[senderName] || 0) + 1;

        messages.push({
          sender: senderName,
          timestamp,
          content: messageContent,
          messageType,
        });
      }
      continue;
    }

    // Try Android format
    const androidMatch = trimmedLine.match(MESSAGE_PATTERNS.android);
    if (androidMatch) {
      const [, year, month, day, ampm, hourStr, minute, sender, messageContent] = androidMatch;
      let hour = parseInt(hourStr, 10);

      if (ampm === '오후' && hour !== 12) {
        hour += 12;
      } else if (ampm === '오전' && hour === 12) {
        hour = 0;
      }

      const timestamp = new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        hour,
        parseInt(minute, 10)
      );
      const messageType = detectMessageType(messageContent);

      if (messageType !== 'system') {
        participants.add(sender.trim());
        const senderName = sender.trim();
        messageCountBySender[senderName] = (messageCountBySender[senderName] || 0) + 1;

        messages.push({
          sender: senderName,
          timestamp,
          content: messageContent,
          messageType,
        });
      }
      continue;
    }
  }

  // Sort messages by timestamp
  messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const dateRange = {
    start: messages.length > 0 ? messages[0].timestamp : new Date(),
    end: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date(),
  };

  return {
    participants: Array.from(participants),
    messages,
    dateRange,
    totalMessageCount: messages.length,
    messageCountBySender,
  };
}

// Sample messages for analysis
export function sampleMessages(parsedChat: ParsedChat, maxMessages: number): ChatMessage[] {
  const { messages } = parsedChat;

  if (messages.length <= maxMessages) {
    return messages;
  }

  // Sample evenly across the conversation
  const step = messages.length / maxMessages;
  const sampled: ChatMessage[] = [];

  for (let i = 0; i < maxMessages; i++) {
    const index = Math.floor(i * step);
    sampled.push(messages[index]);
  }

  return sampled;
}

// Format messages for API
export function formatMessagesForAPI(messages: ChatMessage[]): string {
  return messages
    .filter((m) => m.messageType === 'text')
    .map((m) => `[${m.sender}] ${m.content}`)
    .join('\n');
}

// Statistics for a specific person
export interface PersonStats {
  name: string;
  messageCount: number;
  avgMessageLength: number;
  topWords: Array<{ word: string; count: number }>;
  topExpressions: Array<{ expression: string; count: number }>;
  activeHours: Array<{ hour: number; count: number }>;
  questionRate: number; // percentage of messages that are questions
  initiationRate: number; // percentage of conversations they start
  lateNightRate: number; // percentage of messages between 00:00-05:00
  commonEndings: Array<{ ending: string; count: number }>; // ~용, ~당, ㅎㅎ 등
}

// Expression patterns to track
const EXPRESSION_PATTERNS = [
  { pattern: /ㅋ{2,}/g, name: 'ㅋㅋ' },
  { pattern: /ㅎ{2,}/g, name: 'ㅎㅎ' },
  { pattern: /ㅠ{2,}/g, name: 'ㅠㅠ' },
  { pattern: /ㅜ{2,}/g, name: 'ㅜㅜ' },
  { pattern: /\?\?+/g, name: '??' },
  { pattern: /!!+/g, name: '!!' },
  { pattern: /\.{3,}/g, name: '...' },
  { pattern: /~{1,}/g, name: '~' },
];

// Common message endings
const ENDING_PATTERNS = [
  { pattern: /용[~.!?]*$/i, name: '~용' },
  { pattern: /당[~.!?]*$/i, name: '~당' },
  { pattern: /염[~.!?]*$/i, name: '~염' },
  { pattern: /긔[~.!?]*$/i, name: '~긔' },
  { pattern: /넹[~.!?]*$/i, name: '~넹' },
  { pattern: /욤[~.!?]*$/i, name: '~욤' },
  { pattern: /슴[~.!?]*$/i, name: '~슴' },
  { pattern: /ㅎㅎ[~.!?]*$/i, name: 'ㅎㅎ' },
  { pattern: /ㅋㅋ[~.!?]*$/i, name: 'ㅋㅋ' },
  { pattern: /ㅠㅠ[~.!?]*$/i, name: 'ㅠㅠ' },
];

// Stop words to exclude from word frequency
const STOP_WORDS = new Set([
  '나', '너', '그', '이', '저', '것', '수', '등', '더', '안', '못', '좀',
  '내', '네', '뭐', '왜', '어', '음', '응', '아', '오', '예', '네', '아니',
  '그냥', '진짜', '정말', '너무', '되게', '엄청', '완전', '약간', '조금',
  '하다', '되다', '있다', '없다', '같다', '보다', '오다', '가다',
]);

// Analyze statistics for a specific person
export function analyzePersonStats(
  messages: ChatMessage[],
  targetName: string,
  allMessages: ChatMessage[]
): PersonStats {
  const personMessages = messages.filter(m => m.sender === targetName && m.messageType === 'text');

  // Word frequency
  const wordCounts: Record<string, number> = {};
  const expressionCounts: Record<string, number> = {};
  const endingCounts: Record<string, number> = {};
  const hourCounts: Record<number, number> = {};
  let totalLength = 0;
  let questionCount = 0;

  for (const msg of personMessages) {
    const content = msg.content;
    totalLength += content.length;

    // Count questions
    if (content.includes('?') || content.match(/뭐|왜|어디|언제|어떻게|누구/)) {
      questionCount++;
    }

    // Count expressions
    for (const { pattern, name } of EXPRESSION_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        expressionCounts[name] = (expressionCounts[name] || 0) + matches.length;
      }
    }

    // Count endings
    for (const { pattern, name } of ENDING_PATTERNS) {
      if (pattern.test(content)) {
        endingCounts[name] = (endingCounts[name] || 0) + 1;
      }
    }

    // Count hours
    const hour = msg.timestamp.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;

    // Word frequency (Korean words 2+ chars)
    const words = content.match(/[가-힣]{2,}/g) || [];
    for (const word of words) {
      if (!STOP_WORDS.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    }
  }

  // Calculate initiation rate (who sends the first message of a conversation)
  // A new conversation starts if there's a 3+ hour gap
  let initiationCount = 0;
  let totalConversations = 0;
  let lastMsgTime: Date | null = null;

  for (const msg of allMessages) {
    if (!lastMsgTime || (msg.timestamp.getTime() - lastMsgTime.getTime()) > 3 * 60 * 60 * 1000) {
      totalConversations++;
      if (msg.sender === targetName) {
        initiationCount++;
      }
    }
    lastMsgTime = msg.timestamp;
  }

  // Late night messages (00:00 - 05:00)
  const lateNightMessages = personMessages.filter(m => {
    const hour = m.timestamp.getHours();
    return hour >= 0 && hour < 5;
  }).length;

  // Sort and get top items
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  const topExpressions = Object.entries(expressionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([expression, count]) => ({ expression, count }));

  const commonEndings = Object.entries(endingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ending, count]) => ({ ending, count }));

  const activeHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));

  return {
    name: targetName,
    messageCount: personMessages.length,
    avgMessageLength: personMessages.length > 0 ? Math.round(totalLength / personMessages.length) : 0,
    topWords,
    topExpressions,
    activeHours,
    questionRate: personMessages.length > 0 ? Math.round((questionCount / personMessages.length) * 100) : 0,
    initiationRate: totalConversations > 0 ? Math.round((initiationCount / totalConversations) * 100) : 0,
    lateNightRate: personMessages.length > 0 ? Math.round((lateNightMessages / personMessages.length) * 100) : 0,
    commonEndings,
  };
}

// Behavioral patterns extracted from conversation
export interface BehavioralPatterns {
  apologyPatterns: Array<{ message: string; context: string }>;
  aegyoPatterns: Array<{ message: string; context: string }>;
  emotionalPatterns: Array<{ type: 'happy' | 'sad' | 'angry'; message: string; context: string }>;
  delayedResponsePatterns: Array<{ message: string; gapMinutes: number }>;
  conversationStarters: Array<{ message: string; timeOfDay: string }>;
  conversationEnders: Array<{ message: string }>;
  uniquePhrases: Array<{ phrase: string; count: number; example: string }>;
}

// Extract behavioral patterns for a specific person
export function extractBehavioralPatterns(
  messages: ChatMessage[],
  targetName: string
): BehavioralPatterns {
  const patterns: BehavioralPatterns = {
    apologyPatterns: [],
    aegyoPatterns: [],
    emotionalPatterns: [],
    delayedResponsePatterns: [],
    conversationStarters: [],
    conversationEnders: [],
    uniquePhrases: [],
  };

  // Helper to get context (previous message)
  const getContext = (idx: number): string => {
    for (let i = idx - 1; i >= 0 && i >= idx - 3; i--) {
      if (messages[i].sender !== targetName) {
        return `[${messages[i].sender}] ${messages[i].content}`;
      }
    }
    return '';
  };

  // Track phrases for uniqueness
  const phraseCount: Record<string, { count: number; example: string }> = {};

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.sender !== targetName || msg.messageType !== 'text') continue;

    const content = msg.content;
    const context = getContext(i);

    // 1. Apology patterns (미안, 죄송, 잘못)
    if (/미안|죄송|잘못|sorry/i.test(content)) {
      if (patterns.apologyPatterns.length < 5) {
        patterns.apologyPatterns.push({ message: content, context });
      }
    }

    // 2. Aegyo patterns
    if (/[용당염긔넹욤슴]$|[용당염긔넹욤슴][~.!?ㅎㅋ]*$/i.test(content) ||
        /잉|헹|앵|엥|뀨|뿌|쀼/i.test(content)) {
      if (patterns.aegyoPatterns.length < 5) {
        patterns.aegyoPatterns.push({ message: content, context });
      }
    }

    // 3. Emotional patterns
    if (/ㅋ{4,}|하{3,}|ㅎ{4,}|웃{2,}/.test(content)) {
      if (patterns.emotionalPatterns.filter(p => p.type === 'happy').length < 3) {
        patterns.emotionalPatterns.push({ type: 'happy', message: content, context });
      }
    }
    if (/ㅠ{3,}|ㅜ{3,}|힝|흑|슬프|우울|속상/.test(content)) {
      if (patterns.emotionalPatterns.filter(p => p.type === 'sad').length < 3) {
        patterns.emotionalPatterns.push({ type: 'sad', message: content, context });
      }
    }
    if (/짜증|화나|열받|싫어|미워|어이없/.test(content)) {
      if (patterns.emotionalPatterns.filter(p => p.type === 'angry').length < 3) {
        patterns.emotionalPatterns.push({ type: 'angry', message: content, context });
      }
    }

    // 4. Delayed response patterns (after 1+ hour gap, they send first)
    if (i > 0) {
      const prevMsg = messages[i - 1];
      const gapMs = msg.timestamp.getTime() - prevMsg.timestamp.getTime();
      const gapMinutes = gapMs / (1000 * 60);

      if (gapMinutes >= 60 && prevMsg.sender !== targetName) {
        if (patterns.delayedResponsePatterns.length < 5) {
          patterns.delayedResponsePatterns.push({
            message: content,
            gapMinutes: Math.round(gapMinutes)
          });
        }
      }
    }

    // 5. Conversation starters (after 3+ hour gap)
    if (i === 0 || (i > 0 && (msg.timestamp.getTime() - messages[i-1].timestamp.getTime()) > 3 * 60 * 60 * 1000)) {
      const hour = msg.timestamp.getHours();
      let timeOfDay = '낮';
      if (hour >= 0 && hour < 6) timeOfDay = '새벽';
      else if (hour >= 6 && hour < 12) timeOfDay = '아침';
      else if (hour >= 12 && hour < 18) timeOfDay = '오후';
      else timeOfDay = '저녁/밤';

      if (patterns.conversationStarters.length < 5) {
        patterns.conversationStarters.push({ message: content, timeOfDay });
      }
    }

    // 6. Conversation enders (before 3+ hour gap or end of chat)
    const isLastMsg = i === messages.length - 1;
    const isBeforeLongGap = !isLastMsg &&
      (messages[i + 1].timestamp.getTime() - msg.timestamp.getTime()) > 3 * 60 * 60 * 1000;

    if ((isLastMsg || isBeforeLongGap) && patterns.conversationEnders.length < 5) {
      patterns.conversationEnders.push({ message: content });
    }

    // 7. Track unique phrases (2-4 word combinations that repeat)
    const phrases = content.match(/[가-힣]{2,6}/g) || [];
    for (const phrase of phrases) {
      if (phrase.length >= 2) {
        if (!phraseCount[phrase]) {
          phraseCount[phrase] = { count: 0, example: content };
        }
        phraseCount[phrase].count++;
      }
    }
  }

  // Get top unique phrases (used 3+ times, not common words)
  const commonWords = new Set(['그래서', '그러면', '그런데', '하지만', '그리고', '진짜로', '정말로']);
  patterns.uniquePhrases = Object.entries(phraseCount)
    .filter(([phrase, data]) => data.count >= 3 && !commonWords.has(phrase))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([phrase, data]) => ({ phrase, count: data.count, example: data.example }));

  return patterns;
}

// Format behavioral patterns for API
export function formatPatternsForAPI(patterns: BehavioralPatterns, targetName: string): string {
  let result = `\n## ${targetName}의 행동 패턴 분석\n\n`;

  // Apology patterns
  if (patterns.apologyPatterns.length > 0) {
    result += `### 사과할 때 패턴\n`;
    patterns.apologyPatterns.slice(0, 3).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
      if (p.context) result += `   (상황: ${p.context})\n`;
    });
    result += '\n';
  }

  // Aegyo patterns
  if (patterns.aegyoPatterns.length > 0) {
    result += `### 애교 표현 패턴\n`;
    patterns.aegyoPatterns.slice(0, 3).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
    });
    result += '\n';
  }

  // Emotional patterns
  const happyPatterns = patterns.emotionalPatterns.filter(p => p.type === 'happy');
  const sadPatterns = patterns.emotionalPatterns.filter(p => p.type === 'sad');
  const angryPatterns = patterns.emotionalPatterns.filter(p => p.type === 'angry');

  if (happyPatterns.length > 0) {
    result += `### 기분 좋을 때 표현\n`;
    happyPatterns.slice(0, 2).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
    });
    result += '\n';
  }

  if (sadPatterns.length > 0) {
    result += `### 슬프거나 힘들 때 표현\n`;
    sadPatterns.slice(0, 2).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
    });
    result += '\n';
  }

  if (angryPatterns.length > 0) {
    result += `### 화났을 때 표현\n`;
    angryPatterns.slice(0, 2).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
    });
    result += '\n';
  }

  // Delayed response patterns
  if (patterns.delayedResponsePatterns.length > 0) {
    result += `### 늦게 답장할 때 첫 마디\n`;
    patterns.delayedResponsePatterns.slice(0, 3).forEach((p, i) => {
      result += `${i + 1}. "${p.message}" (${p.gapMinutes}분 후)\n`;
    });
    result += '\n';
  }

  // Conversation starters
  if (patterns.conversationStarters.length > 0) {
    result += `### 대화 시작할 때 패턴\n`;
    patterns.conversationStarters.slice(0, 3).forEach((p, i) => {
      result += `${i + 1}. "${p.message}" (${p.timeOfDay})\n`;
    });
    result += '\n';
  }

  // Conversation enders
  if (patterns.conversationEnders.length > 0) {
    result += `### 대화 마무리 패턴\n`;
    patterns.conversationEnders.slice(0, 3).forEach((p, i) => {
      result += `${i + 1}. "${p.message}"\n`;
    });
    result += '\n';
  }

  // Unique phrases
  if (patterns.uniquePhrases.length > 0) {
    result += `### 자주 쓰는 특이한 표현\n`;
    patterns.uniquePhrases.slice(0, 5).forEach((p, i) => {
      result += `${i + 1}. "${p.phrase}" (${p.count}회) - 예: "${p.example}"\n`;
    });
    result += '\n';
  }

  return result;
}

// Format statistics for API prompt
export function formatStatsForAPI(stats: PersonStats): string {
  const hourLabels: Record<number, string> = {
    0: '자정', 1: '새벽 1시', 2: '새벽 2시', 3: '새벽 3시', 4: '새벽 4시', 5: '새벽 5시',
    6: '아침 6시', 7: '아침 7시', 8: '아침 8시', 9: '오전 9시', 10: '오전 10시', 11: '오전 11시',
    12: '정오', 13: '오후 1시', 14: '오후 2시', 15: '오후 3시', 16: '오후 4시', 17: '오후 5시',
    18: '저녁 6시', 19: '저녁 7시', 20: '밤 8시', 21: '밤 9시', 22: '밤 10시', 23: '밤 11시',
  };

  return `
## ${stats.name}의 대화 통계

### 기본 정보
- 총 메시지 수: ${stats.messageCount}개
- 평균 메시지 길이: ${stats.avgMessageLength}자
- 질문 비율: ${stats.questionRate}%
- 대화 시작 비율: ${stats.initiationRate}%
- 심야(00-05시) 메시지 비율: ${stats.lateNightRate}%

### 자주 쓰는 단어 TOP 5
${stats.topWords.slice(0, 5).map((w, i) => `${i + 1}. "${w.word}" (${w.count}회)`).join('\n')}

### 자주 쓰는 표현
${stats.topExpressions.map(e => `- ${e.expression}: ${e.count}회`).join('\n') || '- 특별한 표현 없음'}

### 자주 쓰는 말투/어미
${stats.commonEndings.map(e => `- ${e.ending}: ${e.count}회`).join('\n') || '- 특별한 어미 없음'}

### 가장 활발한 시간대 TOP 3
${stats.activeHours.slice(0, 3).map((h, i) => `${i + 1}. ${hourLabels[h.hour]} (${h.count}개)`).join('\n')}
`.trim();
}
