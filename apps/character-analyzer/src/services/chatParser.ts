import type { Message, ParsedChat } from '../types/character';

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
  const messages: Message[] = [];
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

      if (!isSystemMessage(messageContent)) {
        const timestamp = parseTime(timeStr, currentDate);
        participants.add(sender);
        messageCountBySender[sender] = (messageCountBySender[sender] || 0) + 1;

        messages.push({
          sender,
          content: messageContent,
          timestamp,
          hour: timestamp.getHours(),
        });
      }
      continue;
    }

    // Try iOS format
    const iosMatch = trimmedLine.match(MESSAGE_PATTERNS.ios);
    if (iosMatch) {
      const [, year, month, day, hour, minute, sender, messageContent] = iosMatch;

      if (!isSystemMessage(messageContent)) {
        const timestamp = new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10),
          parseInt(hour, 10),
          parseInt(minute, 10)
        );
        const senderName = sender.trim();
        participants.add(senderName);
        messageCountBySender[senderName] = (messageCountBySender[senderName] || 0) + 1;

        messages.push({
          sender: senderName,
          content: messageContent,
          timestamp,
          hour: timestamp.getHours(),
        });
      }
      continue;
    }

    // Try Android format
    const androidMatch = trimmedLine.match(MESSAGE_PATTERNS.android);
    if (androidMatch) {
      const [, year, month, day, ampm, hourStr, minute, sender, messageContent] = androidMatch;

      if (!isSystemMessage(messageContent)) {
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
        const senderName = sender.trim();
        participants.add(senderName);
        messageCountBySender[senderName] = (messageCountBySender[senderName] || 0) + 1;

        messages.push({
          sender: senderName,
          content: messageContent,
          timestamp,
          hour: timestamp.getHours(),
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
    totalMessageCount: messages.length,
    messageCountBySender,
    dateRange,
  };
}

// Sample messages for analysis
export function sampleMessages(parsedChat: ParsedChat, maxMessages: number): Message[] {
  const { messages } = parsedChat;

  if (messages.length <= maxMessages) {
    return messages;
  }

  // Sample evenly across the conversation
  const step = messages.length / maxMessages;
  const sampled: Message[] = [];

  for (let i = 0; i < maxMessages; i++) {
    const index = Math.floor(i * step);
    sampled.push(messages[index]);
  }

  return sampled;
}

// Format messages for API
export function formatMessagesForAPI(messages: Message[], targetName: string): string {
  return messages
    .filter((m) => m.sender === targetName)
    .map((m) => `[${m.sender}] ${m.content}`)
    .join('\n');
}

// Get all messages formatted for API
export function formatAllMessagesForAPI(messages: Message[]): string {
  return messages
    .map((m) => `[${m.sender}] ${m.content}`)
    .join('\n');
}

// Calculate basic stats for a person
export function calculatePersonStats(messages: Message[], targetName: string) {
  const personMessages = messages.filter(m => m.sender === targetName);

  // Word frequency
  const wordCounts: Record<string, number> = {};
  let totalLength = 0;
  let questionCount = 0;
  let exclamationCount = 0;
  const hourCounts: Record<number, number> = {};

  for (const msg of personMessages) {
    const content = msg.content;
    totalLength += content.length;

    // Count questions
    if (content.includes('?') || /뭐|왜|어디|언제|어떻게|누구/.test(content)) {
      questionCount++;
    }

    // Count exclamations
    if (content.includes('!') || /ㅋ{2,}|ㅎ{2,}/.test(content)) {
      exclamationCount++;
    }

    // Count hours
    hourCounts[msg.hour] = (hourCounts[msg.hour] || 0) + 1;

    // Word frequency (Korean words 2+ chars)
    const words = content.match(/[가-힣]{2,}/g) || [];
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }

  // Calculate initiation rate
  let initiationCount = 0;
  let totalConversations = 0;
  let lastMsgTime: Date | null = null;

  for (const msg of messages) {
    if (!lastMsgTime || (msg.timestamp.getTime() - lastMsgTime.getTime()) > 3 * 60 * 60 * 1000) {
      totalConversations++;
      if (msg.sender === targetName) {
        initiationCount++;
      }
    }
    lastMsgTime = msg.timestamp;
  }

  // Late night messages (00:00 - 05:00)
  const lateNightMessages = personMessages.filter(m => m.hour >= 0 && m.hour < 5).length;

  // Top words
  const topWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  // Active hours
  const activeHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }));

  return {
    name: targetName,
    messageCount: personMessages.length,
    avgMessageLength: personMessages.length > 0 ? Math.round(totalLength / personMessages.length) : 0,
    questionRate: personMessages.length > 0 ? Math.round((questionCount / personMessages.length) * 100) : 0,
    exclamationRate: personMessages.length > 0 ? Math.round((exclamationCount / personMessages.length) * 100) : 0,
    initiationRate: totalConversations > 0 ? Math.round((initiationCount / totalConversations) * 100) : 0,
    lateNightRate: personMessages.length > 0 ? Math.round((lateNightMessages / personMessages.length) * 100) : 0,
    topWords,
    activeHours,
  };
}

// Format stats for API
export function formatStatsForAPI(stats: ReturnType<typeof calculatePersonStats>): string {
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
- 느낌표/웃음 비율: ${stats.exclamationRate}%
- 대화 시작 비율: ${stats.initiationRate}%
- 심야(00-05시) 메시지 비율: ${stats.lateNightRate}%

### 자주 쓰는 단어 TOP 5
${stats.topWords.slice(0, 5).map((w, i) => `${i + 1}. "${w.word}" (${w.count}회)`).join('\n')}

### 가장 활발한 시간대 TOP 3
${stats.activeHours.slice(0, 3).map((h, i) => `${i + 1}. ${hourLabels[h.hour]} (${h.count}개)`).join('\n')}
`.trim();
}
